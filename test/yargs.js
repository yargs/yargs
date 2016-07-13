/* global describe, it, beforeEach */

var expect = require('chai').expect
var fs = require('fs')
var path = require('path')
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
      .command('blerg', 'handle blerg things', function () {}, function (argv) {
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
        boolean: ['help'],
        string: [],
        alias: {},
        default: {},
        key: {help: true},
        narg: {},
        defaultDescription: {},
        choices: {},
        requiresArg: [],
        skipValidation: [],
        count: [],
        normalize: [],
        number: [],
        config: {},
        envPrefix: undefined,
        global: ['help'],
        demanded: {}
      }

      expect(y.getOptions()).to.deep.equal(emptyOptions)
      expect(y.getUsageInstance().getDescriptions()).to.deep.equal({help: '__yargsString__:Show help'})
      expect(y.getValidationInstance().getImplied()).to.deep.equal({})
      expect(y.getCommandInstance().getCommandHandlers()).to.deep.equal({})
      expect(y.getExitProcess()).to.equal(true)
      expect(y.getStrict()).to.equal(false)
      expect(y.getDemanded()).to.deep.equal({})
      expect(y.getGroups()).to.deep.equal({})
    })
  })

  describe('command', function () {
    it('executes command handler with parsed argv', function (done) {
      yargs(['blerg'])
        .command(
          'blerg',
          'handle blerg things',
          function () {},
          function (argv) {
            // we should get the argv from the prior yargs.
            argv._[0].should.equal('blerg')
            return done()
          }
        )
        .exitProcess(false) // defaults to true.
        .argv
    })

    it("skips executing top-level command if builder's help is executed", function () {
      var r = checkOutput(function () {
        yargs(['blerg', '-h'])
          .command(
            'blerg',
            'handle blerg things',
            function (yargs) {
              return yargs
                .command('snuh', 'snuh command')
                .help('h')
                .wrap(null)
            },
            function () {
              throw Error('should not happen')
            }
          )
          .help('h')
          .argv
      })

      r.logs[0].split('\n').should.deep.equal([
        './usage blerg',
        '',
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
            return yargs
              .command('snuh', 'snuh command')
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

    it("accepts an object for describing a command's options", function () {
      var r = checkOutput(function () {
        yargs(['blerg', '-h'])
          .command('blerg <foo>', 'handle blerg things', {
            foo: {
              default: 99
            },
            bar: {
              default: 'hello world'
            }
          })
          .help('h')
          .wrap(null)
          .argv
      })

      var usageString = r.logs[0]
      usageString.should.match(/usage blerg <foo>/)
      usageString.should.match(/--foo.*default: 99/)
      usageString.should.match(/--bar.*default: "hello world"/)
    })

    it("accepts a module with a 'builder' and 'handler' key", function () {
      var argv = yargs(['blerg', 'bar'])
        .command('blerg <foo>', 'handle blerg things', require('./fixtures/command'))
        .argv

      argv.banana.should.equal('cool')
      argv.batman.should.equal('sad')
      argv.foo.should.equal('bar')

      global.commandHandlerCalledWith.banana.should.equal('cool')
      global.commandHandlerCalledWith.batman.should.equal('sad')
      global.commandHandlerCalledWith.foo.should.equal('bar')
      delete global.commandHandlerCalledWith
    })

    it("accepts a module with a keys 'command', 'describe', 'builder', and 'handler'", function () {
      var argv = yargs(['blerg', 'bar'])
        .command(require('./fixtures/command-module'))
        .argv

      argv.banana.should.equal('cool')
      argv.batman.should.equal('sad')
      argv.foo.should.equal('bar')

      global.commandHandlerCalledWith.banana.should.equal('cool')
      global.commandHandlerCalledWith.batman.should.equal('sad')
      global.commandHandlerCalledWith.foo.should.equal('bar')
      delete global.commandHandlerCalledWith
    })

    it('derives \'command\' string from filename when missing', function () {
      var argv = yargs('nameless --foo bar')
        .command(require('./fixtures/cmddir_noname/nameless'))
        .argv

      argv.banana.should.equal('cool')
      argv.batman.should.equal('sad')
      argv.foo.should.equal('bar')

      global.commandHandlerCalledWith.banana.should.equal('cool')
      global.commandHandlerCalledWith.batman.should.equal('sad')
      global.commandHandlerCalledWith.foo.should.equal('bar')
      delete global.commandHandlerCalledWith
    })

    it('throws error for non-module command object missing \'command\' string', function () {
      expect(function () {
        yargs.command({
          desc: 'A command with no name',
          builder: function (yargs) { return yargs },
          handler: function (argv) {}
        })
      }).to.throw(/No command name given for module: { desc: 'A command with no name',\n {2}builder: \[Function\],\n {2}handler: \[Function\] }/)
    })
  })

  describe('terminalWidth', function () {
    it('returns the maximum width of the terminal', function () {
      yargs.terminalWidth().should.be.gte(0)
    })
  })

  describe('number', function () {
    it('accepts number arguments when a number type is specified', function () {
      var argv = yargs('-w banana')
        .number('w')
        .argv

      expect(typeof argv.w).to.equal('number')
    })

    it('should expose an options short-hand for numbers', function () {
      var argv = yargs('-w banana')
        .option('w', {
          number: true
        })
        .alias('w', 'x')
        .argv

      expect(typeof argv.w).to.equal('number')
      expect(typeof argv.x).to.equal('number')
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

  describe('config', function () {
    it('allows a parsing function to be provided as a second argument', function () {
      var argv = yargs('--config ./test/fixtures/config.json')
        .config('config', function (path) {
          return JSON.parse(fs.readFileSync(path))
        })
        .argv

      argv.foo.should.equal('baz')
    })

    it('allows key to be specified with option shorthand', function () {
      var argv = yargs('--config ./test/fixtures/config.json')
        .option('config', {
          config: true
        })
        .argv

      argv.foo.should.equal('baz')
    })

    it('allows to pass a configuration object', function () {
      var argv = yargs
          .config({foo: 1, bar: 2})
          .argv

      argv.foo.should.equal(1)
      argv.bar.should.equal(2)
    })
  })

  describe('normalize', function () {
    it('normalizes paths passed as arguments', function () {
      var argv = yargs('--path /foo/bar//baz/asdf/quux/..')
        .normalize(['path'])
        .argv

      argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep))
    })

    it('normalizes path when when it is updated', function () {
      var argv = yargs('--path /batman')
        .normalize(['path'])
        .argv

      argv.path = '/foo/bar//baz/asdf/quux/..'
      argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep))
    })

    it('allows key to be specified with option shorthand', function () {
      var argv = yargs('--path /batman')
        .option('path', {
          normalize: true
        })
        .argv

      argv.path = '/foo/bar//baz/asdf/quux/..'
      argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep))
    })
  })

  describe('narg', function () {
    it('accepts a key as the first argument and a count as the second', function () {
      var argv = yargs('--foo a b c')
        .nargs('foo', 2)
        .argv

      argv.foo.should.deep.equal(['a', 'b'])
      argv._.should.deep.equal(['c'])
    })

    it('accepts a hash of keys and counts', function () {
      var argv = yargs('--foo a b c')
        .nargs({
          foo: 2
        })
        .argv

      argv.foo.should.deep.equal(['a', 'b'])
      argv._.should.deep.equal(['c'])
    })

    it('allows key to be specified with option shorthand', function () {
      var argv = yargs('--foo a b c')
        .option('foo', {
          nargs: 2
        })
        .argv

      argv.foo.should.deep.equal(['a', 'b'])
      argv._.should.deep.equal(['c'])
    })
  })

  describe('global', function () {
    it('does not reset a global options when reset is called', function () {
      var y = yargs('--foo a b c')
        .option('foo', {
          nargs: 2
        })
        .option('bar', {
          nargs: 2
        })
        .global('foo')
        .reset()
      var options = y.getOptions()
      options.key.foo.should.equal(true)
      expect(options.key.bar).to.equal(undefined)
    })

    it('does not reset alias of global option', function () {
      var y = yargs('--foo a b c')
        .option('foo', {
          nargs: 2,
          alias: 'awesome-sauce'
        })
        .string('awesome-sauce')
        .demand('awesomeSauce')
        .option('bar', {
          nargs: 2,
          string: true,
          demand: true
        })
        .global('foo')
        .reset({
          foo: ['awesome-sauce', 'awesomeSauce']
        })
      var options = y.getOptions()

      options.key.foo.should.equal(true)
      options.string.should.include('awesome-sauce')
      Object.keys(options.demanded).should.include('awesomeSauce')

      expect(options.key.bar).to.equal(undefined)
      options.string.should.not.include('bar')
      Object.keys(options.demanded).should.not.include('bar')
    })

    it('should set help to global option by default', function () {
      var y = yargs('--foo')
        .help('help')
      var options = y.getOptions()
      options.global.should.include('help')
    })

    it('should set version to global option by default', function () {
      var y = yargs('--foo')
        .version()
      var options = y.getOptions()
      options.global.should.include('version')
    })

    it('should not reset usage descriptions of global options', function () {
      var y = yargs('--foo')
        .describe('bar', 'my awesome bar option')
        .describe('foo', 'my awesome foo option')
        .global('foo')
        .reset()
      var descriptions = y.getUsageInstance().getDescriptions()
      Object.keys(descriptions).should.include('foo')
      Object.keys(descriptions).should.not.include('bar')
    })

    it('should not reset implications of global options', function () {
      var y = yargs(['--x=33'])
        .implies({
          x: 'y'
        })
        .implies({
          z: 'w'
        })
        .global(['x'])
        .reset()
      var implied = y.getValidationInstance().getImplied()
      Object.keys(implied).should.include('x')
      Object.keys(implied).should.not.include('z')
    })

    it('should expose an options short-hand for declaring global options', function () {
      var y = yargs('--foo a b c')
        .option('foo', {
          nargs: 2,
          global: true
        })
        .option('bar', {
          nargs: 2
        })
        .reset()
      var options = y.getOptions()
      options.key.foo.should.equal(true)
      expect(options.key.bar).to.equal(undefined)
    })
  })

  describe('pkgConf', function () {
    it('uses values from package.json', function () {
      var argv = yargs('--foo a').pkgConf('repository').argv

      argv.foo.should.equal('a')
      argv.type.should.equal('git')
    })

    it('combines yargs defaults with package.json values', function () {
      var argv = yargs('--foo a')
        .default('b', 99)
        .pkgConf('repository')
        .argv

      argv.b.should.equal(99)
      argv.foo.should.equal('a')
      argv.type.should.equal('git')
    })

    it('should use value from package.json, if argv value is using default value', function () {
      var argv = yargs('--foo a')
        .default('b', 99)
        .pkgConf('repository')
        .default('type', 'default')
        .argv

      argv.b.should.equal(99)
      argv.foo.should.equal('a')
      argv.type.should.equal('git')
    })

    it('should apply value from config object to all aliases', function () {
      var argv = yargs('--foo a')
        .pkgConf('repository')
        .alias('type', 't')
        .alias('t', 'u')
        .argv

      argv.foo.should.equal('a')
      argv.type.should.equal('git')
      argv.t.should.equal('git')
      argv.u.should.equal('git')
    })

    it('is cool with a key not existing', function () {
      var argv = yargs('--foo a')
        .default('b', 99)
        .pkgConf('banana')
        .argv

      argv.b.should.equal(99)
      argv.foo.should.equal('a')
      expect(argv.type).to.equal(undefined)
    })

    it('allows an alternative cwd to be specified', function () {
      var argv = yargs('--foo a')
        .pkgConf('yargs', './test/fixtures')
        .argv

      argv.foo.should.equal('a')
      argv.dotNotation.should.equal(false)
    })

    it('doesn\'t mess up other pkg lookups when cwd is specified', function () {
      var r = checkOutput(function () {
        return yargs('--version')
          .pkgConf('repository', './test/fixtures')
          .version()
          .argv
      })
      const options = yargs.getOptions()

      // assert pkgConf lookup (test/fixtures/package.json)
      options.configObjects.should.deep.equal([{ type: 'svn' }])
      // assert parseArgs and guessVersion lookup (package.json)
      expect(options.configuration['dot-notation']).to.be.undefined
      r.logs[0].should.not.equal('9.9.9') // breaks when yargs gets to this version
    })

    // see https://github.com/yargs/yargs/issues/485
    it('handles an invalid package.json', function () {
      var argv = yargs('--foo a')
        .pkgConf('yargs', './test/fixtures/broken-json')
        .argv

      argv.foo.should.equal('a')
    })
  })

  describe('skipValidation', function () {
    it('skips validation if an option with skipValidation is present', function () {
      var argv = yargs(['--koala', '--skip'])
          .demand(1)
          .fail(function (msg) {
            expect.fail()
          })
          .skipValidation(['skip', 'reallySkip'])
          .argv
      argv.koala.should.equal(true)
    })

    it('does not skip validation if no option with skipValidation is present', function (done) {
      var argv = yargs(['--koala'])
          .demand(1)
          .fail(function (msg) {
            return done()
          })
          .skipValidation(['skip', 'reallySkip'])
          .argv
      argv.koala.should.equal(true)
    })

    it('allows key to be specified with option shorthand', function () {
      var argv = yargs(['--koala', '--skip'])
          .demand(1)
          .fail(function (msg) {
            expect.fail()
          })
          .option('skip', {
            skipValidation: true
          })
          .argv
      argv.koala.should.equal(true)
    })
  })
})

describe('yargs context', function () {
  beforeEach(function () {
    delete require.cache[require.resolve('../')]
    yargs = require('../')
  })

  it('should begin with initial state', function () {
    var context = yargs.getContext()
    context.resets.should.equal(0)
    context.commands.should.deep.equal([])
  })

  it('should track number of resets', function () {
    var context = yargs.getContext()
    yargs.reset()
    context.resets.should.equal(1)
    yargs.reset()
    yargs.reset()
    context.resets.should.equal(3)
  })

  it('should track commands being executed', function () {
    var context
    yargs('one two')
      .command('one', 'level one', function (yargs) {
        context = yargs.getContext()
        context.commands.should.deep.equal(['one'])
        return yargs.command('two', 'level two', function (yargs) {
          context.commands.should.deep.equal(['one', 'two'])
        }, function (argv) {
          context.commands.should.deep.equal(['one', 'two'])
        })
      }, function (argv) {
        context.commands.should.deep.equal(['one'])
      })
      .argv
    context.commands.should.deep.equal([])
  })
})
