/* global describe, it, beforeEach */

var expect = require('chai').expect
var checkOutput = require('./helpers/utils').checkOutput
var yargs = require('../')

require('chai').should()

describe('yargs dsl tests', function () {
  beforeEach(function () {
    yargs.reset()
  })

  it('should use bin name for $0, eliminating path', function () {
    process.argv[1] = '/usr/local/bin/ndm'
    process.env._ = '/usr/local/bin/ndm'
    process.execPath = '/usr/local/bin/ndm'
    var argv = yargs([]).argv
    argv['$0'].should.eql('ndm')
  })

  it('accepts an object for aliases', function () {
    var argv = yargs([])
    .alias({
      cool: 'cat'
    })
    .default('cool', 33)
    .argv

    argv.cat.should.eql(33)
  })

  it('populates argv with placeholder keys for all options', function () {
    var argv = yargs([])
      .option('cool', {})
      .argv

    Object.keys(argv).should.include('cool')
  })

  it('populates argv with placeholder keys when passed into command handler', function (done) {
    yargs(['blerg'])
      .option('cool', {})
      .command('blerg', 'handle blerg things', function (yargs, argv) {
        Object.keys(argv).should.include('cool')
        return done()
      })
      .exitProcess(false) // defaults to true.
      .argv
  })

  it('accepts an object for implies', function () {
    var r = checkOutput(function () {
      return yargs(['--x=33'])
        .implies({
          x: 'y'
        })
        .argv
    })

    r.errors[1].should.match(/Implications failed/)
  })

  it('accepts an object for describes', function () {
    var r = checkOutput(function () {
      return yargs([])
        .describe({
          x: 'really cool key'
        })
        .demand('x')
        .wrap(null)
        .argv
    })

    r.errors[0].should.match(/really cool key/)
  })

  it('treats usage as alias for options, if object provided as first argument', function () {
    var argv = yargs([])
      .usage({
        a: {
          default: 99
        }
      })
      .argv

    argv.a.should.eql(99)
  })

  it('a function can be provided, to execute when a parsing failure occurs', function (done) {
    yargs(['--x=33'])
      .implies({
        x: 'y'
      })
      .fail(function (msg) {
        msg.should.match(/Implications failed/)
        return done()
      })
      .argv
  })

  it('should set alias to string if option is string', function () {
    var argv = yargs(['--cat=99'])
      .options('c', {
        alias: 'cat',
        string: true
      })
      .argv

    argv.cat.should.eql('99')
    argv.c.should.eql('99')
  })

  it('should allow a valid choice', function () {
    var argv = yargs(['--looks=good'])
      .option('looks', {
        choices: ['good', 'bad']
      })
      .argv

    argv.looks.should.eql('good')
  })

  it('should allow defaultDescription to be set with .option()', function () {
    var optDefaultDescriptions = yargs([])
      .option('port', {
        defaultDescription: '80 for HTTP and 443 for HTTPS'
      })
      .getOptions().defaultDescription

    optDefaultDescriptions.should.deep.equal({
      port: '80 for HTTP and 443 for HTTPS'
    })
  })

  describe('showHelpOnFail', function () {
    it('should display custom failure message, if string is provided as first argument', function () {
      var r = checkOutput(function () {
        return yargs([])
          .showHelpOnFail('pork chop sandwiches')
          .demand('cat')
          .argv
      })

      r.errors[3].should.match(/pork chop sandwiches/)
    })

    it('calling with no arguments should default to displaying help', function () {
      var r = checkOutput(function () {
        return yargs([])
          .showHelpOnFail()
          .demand('cat')
          .argv
      })

      r.errors[1].should.match(/required argument/)
    })
  })

  describe('exitProcess', function () {
    describe('when exitProcess is set to false and a failure occurs', function () {
      it('should throw an exception', function () {
        checkOutput(function () {
          expect(function () {
            yargs([])
              .demand('cat')
              .showHelpOnFail(false)
              .exitProcess(false)
              .argv
          }).to.throw(/Missing required argument/)
        })
      })
      it('should output the errors to stderr once', function () {
        var r = checkOutput(function () {
          try {
            yargs([])
              .demand('cat')
              .showHelpOnFail(false)
              .exitProcess(false)
              .argv
          } catch (err) {
            // ignore the error, we only test the output here
          }
        })
        expect(r.logs).to.deep.equal([])
        expect(r.errors).to.deep.equal(['Missing required argument: cat'])
      })
    })
    it('should set exit process to true, if no argument provided', function () {
      var r = checkOutput(function () {
        return yargs([])
          .demand('cat')
          .exitProcess()
          .argv
      })

      r.exit.should.eql(true)
    })
  })

  describe('reset', function () {
    it('should put yargs back into its initial state', function () {
      // create a command line with all the things.
      // so that we can confirm they're reset.
      var y = yargs(['--help'])
        .help('help')
        .command('foo', 'bar', function () {})
        .default('foo', 'bar')
        .describe('foo', 'foo variable')
        .demand('foo')
        .string('foo')
        .alias('foo', 'bar')
        .string('foo')
        .choices('foo', ['bar', 'baz'])
        .implies('foo', 'snuh')
        .group('foo', 'Group:')
        .strict()
        .exitProcess(false)  // defaults to true.
        .env('YARGS')
        .reset()

      var emptyOptions = {
        array: [],
        boolean: [],
        string: [],
        alias: {},
        default: {},
        key: {},
        narg: {},
        defaultDescription: {},
        choices: {},
        requiresArg: [],
        count: [],
        normalize: [],
        config: {},
        envPrefix: undefined
      }

      expect(y.getOptions()).to.deep.equal(emptyOptions)
      expect(y.getUsageInstance().getDescriptions()).to.deep.equal({})
      expect(y.getValidationInstance().getImplied()).to.deep.equal({})
      expect(y.getExitProcess()).to.equal(true)
      expect(y.getStrict()).to.equal(false)
      expect(y.getDemanded()).to.deep.equal({})
      expect(y.getCommandHandlers()).to.deep.equal({})
      expect(y.getGroups()).to.deep.equal({})
    })
  })

  describe('command', function () {
    it('allows a function to be associated with a command', function (done) {
      yargs(['blerg'])
        .command('blerg', 'handle blerg things', function (yargs, argv) {
          // a fresh yargs instance for performing command-specific parsing,
          // and an argv instance containing the parsing performed thus far
          // should be passed to the command handler.
          (typeof yargs.option).should.equal('function')
          // we should get the argv from the prior yargs.
          argv._[0].should.equal('blerg')

          // the yargs instance has been reset.
          yargs.getCommandHandlers().should.deep.equal({})
          return done()
        })
        .exitProcess(false) // defaults to true.
        .argv
    })

    it('does not execute top-level help if a handled command is provided', function () {
      var r = checkOutput(function () {
        yargs(['blerg', '-h'])
          .command('blerg', 'handle blerg things', function (yargs) {
            yargs.command('snuh', 'snuh command')
              .help('h')
              .wrap(null)
              .argv
          })
          .help('h')
          .argv
      })

      r.logs[0].split('\n').should.deep.equal([
        'Commands:',
        '  snuh  snuh command',
        '',
        'Options:',
        '  -h  Show help  [boolean]',
        ''
      ])
    })

    it('executes top-level help if no handled command is provided', function () {
      var r = checkOutput(function () {
        yargs(['snuh', '-h'])
          .command('blerg', 'handle blerg things', function (yargs) {
            yargs.command('snuh', 'snuh command')
              .help('h')
              .argv
          })
          .help('h')
          .wrap(null)
          .argv
      })

      r.logs[0].split('\n').should.deep.equal([
        'Commands:',
        '  blerg  handle blerg things',
        '',
        'Options:',
        '  -h  Show help  [boolean]',
        ''
      ])
    })
  })

  describe('terminalWidth', function () {
    it('returns the maximum width of the terminal', function () {
      yargs.terminalWidth().should.be.gte(0)
    })
  })

  describe('choices', function () {
    it('accepts an object', function () {
      var optChoices = yargs([])
        .choices({
          color: ['red', 'green', 'blue'],
          stars: [1, 2, 3, 4, 5]
        })
        .choices({
          size: ['xl', 'l', 'm', 's', 'xs']
        })
        .getOptions().choices

      optChoices.should.deep.equal({
        color: ['red', 'green', 'blue'],
        stars: [1, 2, 3, 4, 5],
        size: ['xl', 'l', 'm', 's', 'xs']
      })
    })

    it('accepts a string and array', function () {
      var optChoices = yargs([])
        .choices('meat', ['beef', 'chicken', 'pork', 'bison'])
        .choices('temp', ['rare', 'med-rare', 'med', 'med-well', 'well'])
        .getOptions().choices

      optChoices.should.deep.equal({
        meat: ['beef', 'chicken', 'pork', 'bison'],
        temp: ['rare', 'med-rare', 'med', 'med-well', 'well']
      })
    })

    it('accepts a string and single value', function () {
      var optChoices = yargs([])
        .choices('gender', 'male')
        .choices('gender', 'female')
        .getOptions().choices

      optChoices.should.deep.equal({
        gender: ['male', 'female']
      })
    })
  })

  describe('locale', function () {
    it('uses english as a default locale', function () {
      ['LANGUAGE', 'LC_ALL', 'LANG', 'LC_MESSAGES'].forEach(function (e) {
        delete process.env[e]
      })
      yargs.locale().should.equal('en_US')
    })

    it("detects the operating system's locale", function () {
      loadLocale('es_ES.UTF-8')
      yargs.locale().should.equal('es_ES')
      loadLocale('en_US.UTF-8')
    })

    it("should not detect the OS locale if detectLocale is 'false'", function () {
      loadLocale('es_ES.UTF-8')

      var r = checkOutput(function () {
        yargs(['snuh', '-h'])
          .command('blerg', 'blerg command')
          .help('h')
          .wrap(null)
          .detectLocale(false)
          .argv
      })

      yargs.locale().should.equal('en')
      yargs.getDetectLocale().should.equal(false)
      r.logs.join(' ').should.match(/Commands:/)

      loadLocale('en_US.UTF-8')
    })

    function loadLocale (locale) {
      delete require.cache[require.resolve('../')]
      delete require.cache[require.resolve('os-locale')]
      yargs = require('../')
      process.env.LC_ALL = locale
    }

    it("allows a locale other than the default 'en' to be specified", function () {
      var r = checkOutput(function () {
        yargs(['snuh', '-h'])
          .command('blerg', 'blerg command')
          .help('h')
          .wrap(null)
          .locale('pirate')
          .argv
      })

      r.logs.join(' ').should.match(/Choose yer command:/)
    })

    it('handles a missing locale', function () {
      loadLocale('zz_ZZ.UTF-8')

      var r = checkOutput(function () {
        yargs(['snuh', '-h'])
          .command('blerg', 'blerg command')
          .help('h')
          .wrap(null)
          .argv
      })

      yargs.locale().should.equal('zz_ZZ')
      loadLocale('en_US.UTF-8')
      r.logs.join(' ').should.match(/Commands:/)
    })

    it('properly translates a region-specific locale file', function () {
      loadLocale('pt_BR.UTF-8')

      var r = checkOutput(function () {
        yargs(['-h'])
          .help('h')
          .wrap(null)
          .argv
      })

      yargs.locale().should.equal('pt_BR')
      loadLocale('en_US.UTF-8')
      r.logs.join(' ').should.match(/Exibe ajuda/)
    })

    it('handles os-locale throwing an exception', function () {
      // make os-locale throw.
      require('os-locale')
      require.cache[require.resolve('os-locale')].exports.sync = function () { throw Error('an error!') }

      delete require.cache[require.resolve('../')]
      yargs = require('../')

      yargs.locale().should.equal('en')
    })

    it('uses locale string for help option default desc on .locale().help()', function () {
      var r = checkOutput(function () {
        yargs(['-h'])
          .locale('pirate')
          .help('h')
          .wrap(null)
          .argv
      })

      r.logs.join(' ').should.match(/Parlay this here code of conduct/)
    })

    it('uses locale string for help option default desc on .help().locale()', function () {
      var r = checkOutput(function () {
        yargs(['-h'])
          .help('h')
          .locale('pirate')
          .wrap(null)
          .argv
      })

      r.logs.join(' ').should.match(/Parlay this here code of conduct/)
    })

    describe('updateLocale', function () {
      it('allows you to override the default locale strings', function () {
        var r = checkOutput(function () {
          yargs(['snuh', '-h'])
            .command('blerg', 'blerg command')
            .help('h')
            .wrap(null)
            .updateLocale({
              'Commands:': 'COMMANDS!'
            })
            .argv
        })

        r.logs.join(' ').should.match(/COMMANDS!/)
      })

      it('allows you to use updateStrings() as an alias for updateLocale()', function () {
        var r = checkOutput(function () {
          yargs(['snuh', '-h'])
            .command('blerg', 'blerg command')
            .help('h')
            .wrap(null)
            .updateStrings({
              'Commands:': '!SDNAMMOC'
            })
            .argv
        })

        r.logs.join(' ').should.match(/!SDNAMMOC/)
      })
    })
  })

  describe('env', function () {
    it('translates no arg as empty prefix (parser applies all env vars)', function () {
      var options = yargs.env().getOptions()
      options.envPrefix.should.equal('')
    })

    it('accepts true as a valid prefix (parser applies all env vars)', function () {
      var options = yargs.env(true).getOptions()
      options.envPrefix.should.equal(true)
    })

    it('accepts empty string as a valid prefix (parser applies all env vars)', function () {
      var options = yargs.env('').getOptions()
      options.envPrefix.should.equal('')
    })

    it('accepts a string prefix', function () {
      var options = yargs.env('COOL').getOptions()
      options.envPrefix.should.equal('COOL')
    })

    it('translates false as undefined prefix (disables parsing of env vars)', function () {
      var options = yargs.env(false).getOptions()
      expect(options.envPrefix).to.be.undefined
    })
  })

  describe('parse', function () {
    it('parses a simple string', function () {
      var a1 = yargs.parse('-x=2 --foo=bar')
      var a2 = yargs('-x=2 --foo=bar').argv
      a1.x.should.equal(2)
      a2.x.should.equal(2)

      a1.foo.should.equal('bar')
      a2.foo.should.equal('bar')
    })

    it('parses a quoted string', function () {
      var a1 = yargs.parse('-x=\'marks "the" spot\' --foo "break \'dance\'"')
      var a2 = yargs('-x=\'marks "the" spot\' --foo "break \'dance\'"').argv

      a1.x.should.equal('marks "the" spot')
      a2.x.should.equal('marks "the" spot')

      a1.foo.should.equal("break 'dance'")
      a2.foo.should.equal("break 'dance'")
    })

    it('parses an array', function () {
      var a1 = yargs.parse(['-x', '99', '--why=hello world'])
      var a2 = yargs(['-x', '99', '--why=hello world']).argv

      a1.x.should.equal(99)
      a2.x.should.equal(99)

      a1.why.should.equal('hello world')
      a2.why.should.equal('hello world')
    })
  })
})
