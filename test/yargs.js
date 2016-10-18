/* global context, describe, it, beforeEach */

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

  it('should not require config object for an option', function () {
    var r = checkOutput(function () {
      return yargs([])
        .option('x')
        .argv
    })

    expect(r.errors).to.deep.equal([])
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
        .coerce('foo', function (foo) { return foo + 'bar' })
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
        coerce: {},
        requiresArg: [],
        skipValidation: [],
        count: [],
        normalize: [],
        number: [],
        config: {},
        configObjects: [],
        envPrefix: 'YARGS', // preserved as global
        global: ['help'],
        demanded: {}
      }

      expect(y.getOptions()).to.deep.equal(emptyOptions)
      expect(y.getUsageInstance().getDescriptions()).to.deep.equal({help: '__yargsString__:Show help'})
      expect(y.getValidationInstance().getImplied()).to.deep.equal({})
      expect(y.getCommandInstance().getCommandHandlers()).to.deep.equal({})
      expect(y.getExitProcess()).to.equal(false)
      expect(y.getStrict()).to.equal(false)
      expect(y.getDemanded()).to.deep.equal({})
      expect(y.getGroups()).to.deep.equal({})
    })

    it('does not invoke parse with an error if reset has been called', function (done) {
      var y = yargs()
        .demand('cake')

      y.parse('hello', function (err) {
        err.message.should.match(/Missing required argumen/)
      })
      y.reset()
      y.parse('cake', function (err) {
        expect(err).to.equal(null)
        return done()
      })
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

    it('recommends a similar command if no command handler is found', function () {
      var r = checkOutput(function () {
        yargs(['boat'])
          .command('goat')
          .recommendCommands()
          .argv
      })

      r.errors[1].should.match(/Did you mean goat/)
    })

    it('does not recommend a similiar command if no similar command exists', function () {
      var r = checkOutput(function () {
        yargs(['foo'])
          .command('nothingSimilar')
          .recommendCommands()
          .argv
      })

      r.logs.should.be.empty
    })

    it('recommends the longest match first', function () {
      var r = checkOutput(function () {
        yargs(['boat'])
          .command('bot')
          .command('goat')
          .recommendCommands()
          .argv
      })

      r.errors[1].should.match(/Did you mean goat/)
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
      }).to.throw(/No command name given for module: { desc: 'A command with no name',\n {2}builder: \[Function(: builder)?\],\n {2}handler: \[Function(: handler)?\] }/)
    })
  })

  describe('terminalWidth', function () {
    it('returns the maximum width of the terminal', function () {
      if (!process.stdout.isTTY) {
        return this.skip()
      }

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

    it('ignores implicit help command (with short-circuit)', function () {
      var parsed = yargs.help().parse('help', true)
      parsed._.should.deep.equal(['help'])
    })

    it('allows an optional context object to be provided', function () {
      var a1 = yargs.parse('-x=2 --foo=bar', {
        context: 'look at me go!'
      })
      a1.x.should.equal(2)
      a1.foo.should.equal('bar')
      a1.context.should.equal('look at me go!')
    })
  })

  // yargs.parse(['foo', '--bar'], function (err, argv, output) {}
  context('function passed as second argument to parse', function () {
    it('does not print to stdout', function () {
      var r = checkOutput(function () {
        yargs()
          .help('h')
          .parse('-h', function (_err, argv, output) {})
      })

      r.logs.length.should.equal(0)
      r.errors.length.should.equal(0)
    })

    it('gets passed error as first argument', function () {
      var err = null
      var r = checkOutput(function () {
        yargs()
          .demand('robin')
          .parse('batman', function (_err, argv, output) {
            err = _err
          })
      })
      r.logs.length.should.equal(0)
      r.errors.length.should.equal(0)
      err.should.match(/Missing required argument/)
    })

    it('gets passed argv as second argument', function () {
      var argv = null
      var r = checkOutput(function () {
        yargs()
          .demand('robin')
          .parse('batman --foo', function (_err, _argv, output) {
            argv = _argv
          })
      })
      r.logs.length.should.equal(0)
      r.errors.length.should.equal(0)
      argv.foo.should.equal(true)
    })

    it('gets passed output as third argument', function () {
      var output = null
      var r = checkOutput(function () {
        yargs()
          .demand('robin')
          .help()
          .parse('--help', function (_err, argv, _output) {
            output = _output
          })
      })
      r.logs.length.should.equal(0)
      r.errors.length.should.equal(0)
      output.should.match(/--robin.*\[required\]/)
    })

    it('reinstates original exitProcess setting after invocation', function () {
      var callbackCalled = false
      var r = checkOutput(function () {
        yargs
          .exitProcess(true)
          .help()
          .parse('--help', function () {
            callbackCalled = true
            yargs.getExitProcess().should.be.false
          })
      })
      r.logs.length.should.equal(0)
      r.errors.length.should.equal(0)
      r.exit.should.be.false
      callbackCalled.should.be.true
      yargs.getExitProcess().should.be.true
    })

    it('does not call callback if subsequently called without callback', function () {
      var callbackCalled = 0
      var callback = function () {
        callbackCalled++
      }
      yargs.help()
      var r1 = checkOutput(function () {
        yargs.parse('--help', callback)
      })
      var r2 = checkOutput(function () {
        yargs.parse('--help')
      })
      callbackCalled.should.equal(1)
      r1.logs.length.should.equal(0)
      r1.errors.length.should.equal(0)
      r1.exit.should.be.false
      r2.exit.should.be.true
      r2.errors.length.should.equal(0)
      r2.logs[0].should.match(/--help.*Show help.*\[boolean\]/)
    })

    it('resets error state between calls to parse', function () {
      var y = yargs()
        .demand(2)

      var err1 = null
      var out1 = null
      var argv1 = null
      y.parse('foo', function (err, argv, output) {
        err1 = err
        argv1 = argv
        out1 = output
      })

      err1.message.should.match(/Not enough non-option arguments/)
      argv1._.should.include('foo')
      out1.should.match(/Not enough non-option arguments/)

      var err2 = null
      var argv2 = null
      var out2 = null
      y.parse('foo bar', function (err, argv, output) {
        err2 = err
        argv2 = argv
        out2 = output
      })

      expect(err2).to.equal(null)
      argv2._.should.deep.equal([
        'foo',
        'bar'
      ])
      expect(out2).to.equal('')
    })

    describe('commands', function () {
      it('does not invoke command handler if output is populated', function () {
        var err = null
        var handlerCalled = false
        var r = checkOutput(function () {
          yargs()
            .command('batman <api-token>', 'batman command', function () {}, function () {
              handlerCalled = true
            })
            .parse('batman --what', function (_err, argv, output) {
              err = _err
            })
        })
        r.logs.length.should.equal(0)
        r.errors.length.should.equal(0)
        err.message.should.match(/Not enough non-option arguments/)
        handlerCalled.should.equal(false)
      })

      it('invokes command handler normally if no output is populated', function () {
        var argv = null
        var output = null
        var r = checkOutput(function () {
          yargs()
            .command('batman <api-token>', 'batman command', function () {}, function (_argv) {
              argv = _argv
            })
            .parse('batman robin --what', function (_err, argv, _output) {
              output = _output
            })
        })
        r.logs.length.should.equal(0)
        r.errors.length.should.equal(0)
        output.should.equal('')
        argv['api-token'].should.equal('robin')
        argv.what.should.equal(true)
      })

      it('allows context object to be passed to parse', function () {
        var argv = null
        yargs()
          .command('batman <api-token>', 'batman command', function () {}, function (_argv) {
            argv = _argv
          })
          .parse('batman robin --what', {
            state: 'grumpy but rich'
          }, function (_err, argv, _output) {})

        argv.state.should.equal('grumpy but rich')
        argv['api-token'].should.equal('robin')
        argv.what.should.equal(true)
      })

      // see: https://github.com/yargs/yargs/issues/671
      it('does not fail if context object has cyclical reference', function () {
        var argv = null
        var context = {state: 'grumpy but rich'}
        context.res = context
        yargs()
          .command('batman <api-token>', 'batman command', function () {}, function (_argv) {
            argv = _argv
          })
          .parse('batman robin --what', context, function (_err, argv, _output) {})

        argv.state.should.equal('grumpy but rich')
        argv['api-token'].should.equal('robin')
        argv.what.should.equal(true)
      })

      it('allows nested sub-commands to be invoked multiple times', function () {
        var context = {counter: 0}

        checkOutput(function () {
          var parser = yargs()
            .commandDir('fixtures/cmddir')

          parser.parse('dream within-a-dream --what', {context: context}, function (_err, argv, _output) {})
          parser.parse('dream within-a-dream --what', {context: context}, function (_err, argv, _output) {})
          parser.parse('dream within-a-dream --what', {context: context}, function (_err, argv, _output) {})
        })

        context.counter.should.equal(3)
      })

      it('overwrites the prior context object, when parse is called multiple times', function () {
        var argv = null
        var parser = yargs()
          .command('batman <api-token>', 'batman command', function () {}, function (_argv) {})

        parser.parse('batman robin --what', {
          state: 'grumpy but rich'
        }, function (_err, _argv, _output) {})

        parser.parse('batman robin --what', {
          state: 'the hero we need'
        }, function (_err, _argv, _output) {
          argv = _argv
        })

        argv.state.should.equal('the hero we need')
      })

      it('populates argv appropriately when parse is called multiple times', function () {
        var parser = yargs()
          .command('batman <api-token>', 'batman command', function () {}, function (_argv) {})
          .command('robin <egg>', 'robin command', function () {}, function (_argv) {})

        var argv1 = null
        parser.parse('batman abc123', function (_err, argv, _output) {
          argv1 = argv
        })
        var argv2 = null
        parser.parse('robin blue', function (_err, argv, _output) {
          argv2 = argv
        })
        expect(argv1.egg).to.equal(undefined)
        argv1['api-token'].should.equal('abc123')

        expect(argv2['api-token']).to.equal(undefined)
        argv2.egg.should.equal('blue')
      })

      it('populates output appropriately when parse is called multiple times', function () {
        var parser = yargs()
          .command('batman <api-token>', 'batman command', function () {}, function (_argv) {})
          .command('robin <egg>', 'robin command', function () {}, function (_argv) {})
          .wrap(null)
          .help()

        var output1 = null
        parser.parse('batman help', function (_err, _argv, output) {
          output1 = output
        })
        var output2 = null
        parser.parse('robin help', function (_err, _argv, output) {
          output2 = output
        })

        output1.split('\n').should.deep.equal([
          'ndm batman <api-token>',
          '',
          'Options:',
          '  --help  Show help  [boolean]',
          ''
        ])

        output2.split('\n').should.deep.equal([
          'ndm robin <egg>',
          '',
          'Options:',
          '  --help  Show help  [boolean]',
          ''
        ])
      })

      it('resets errors when parse is called multiple times', function () {
        var parser = yargs()
          .command('batman <api-token>', 'batman command', function () {}, function (_argv) {})
          .command('robin <egg>', 'robin command', function () {}, function (_argv) {})
          .wrap(null)
          .help()

        var error1 = null
        var output1 = null
        parser.parse('batman', function (err, _argv, output) {
          error1 = err
          output1 = output
        })
        var error2 = null
        var output2 = null
        parser.parse('robin help', function (err, _argv, output) {
          error2 = err
          output2 = output
        })

        error1.message.should.match(/Not enough non-option arguments/)
        output1.split('\n').should.deep.equal([
          'ndm batman <api-token>',
          '',
          'Options:',
          '  --help  Show help  [boolean]',
          '',
          'Not enough non-option arguments: got 0, need at least 1'
        ])

        expect(error2).to.equal(undefined)
        output2.split('\n').should.deep.equal([
          'ndm robin <egg>',
          '',
          'Options:',
          '  --help  Show help  [boolean]',
          ''
        ])
      })

      it('preserves top-level config when parse is called multiple times', function () {
        var x = 'wrong'
        var err
        var output
        // set some top-level, reset-able config
        var parser = yargs()
          .demand(1, 'Must call a command')
          .strict()
          .command('one <x>', 'The one and only command')
        // first call parse with command, which calls reset
        parser.parse('one two', function (_, argv) {
          x = argv.x
        })
        // then call parse without command, which should enforce top-level config
        parser.parse('', function (_err, argv, _output) {
          err = _err || {}
          output = _output || ''
        })
        x.should.equal('two')
        err.should.have.property('message').and.equal('Must call a command')
        output.split('\n').should.deep.equal([
          'Commands:',
          '  one <x>  The one and only command',
          '',
          'Must call a command'
        ])
      })
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

    it('allows having an option that skips validation but not skipping validation if that option is not used', function () {
      var skippedValidation = true
      yargs(['--no-skip'])
          .demand(5)
          .option('skip', {
            skipValidation: true
          })
          .fail(function (msg) {
            skippedValidation = false
          })
          .argv
      expect(skippedValidation).to.equal(false)
    })
  })

  describe('.help()', function () {
    it('enables `--help` option and `help` command without arguments', function () {
      var option = checkOutput(function () {
        return yargs('--help')
          .help()
          .wrap(null)
          .argv
      })
      var command = checkOutput(function () {
        return yargs('help')
          .help()
          .wrap(null)
          .argv
      })
      var expected = [
        'Options:',
        '  --help  Show help  [boolean]',
        ''
      ]
      option.logs[0].split('\n').should.deep.equal(expected)
      command.logs[0].split('\n').should.deep.equal(expected)
    })

    it('enables `--help` option and `help` command with `true` argument', function () {
      var option = checkOutput(function () {
        return yargs('--help')
          .help(true)
          .wrap(null)
          .argv
      })
      var command = checkOutput(function () {
        return yargs('help')
          .help(true)
          .wrap(null)
          .argv
      })
      var expected = [
        'Options:',
        '  --help  Show help  [boolean]',
        ''
      ]
      option.logs[0].split('\n').should.deep.equal(expected)
      command.logs[0].split('\n').should.deep.equal(expected)
    })

    it('enables only `--help` option with `false` argument', function () {
      var option = checkOutput(function () {
        return yargs('--help')
          .help(false)
          .wrap(null)
          .argv
      })
      var command = checkOutput(function () {
        return yargs('help')
          .help(false)
          .wrap(null)
          .argv
      })
      option.logs[0].split('\n').should.deep.equal([
        'Options:',
        '  --help  Show help  [boolean]',
        ''
      ])
      command.result.should.have.property('_').and.deep.equal(['help'])
    })

    it('enables given string as help option and command with string argument', function () {
      var option = checkOutput(function () {
        return yargs('--info')
          .help('info')
          .wrap(null)
          .argv
      })
      var command = checkOutput(function () {
        return yargs('info')
          .help('info')
          .wrap(null)
          .argv
      })
      var helpOption = checkOutput(function () {
        return yargs('--help')
          .help('info')
          .wrap(null)
          .argv
      })
      var expected = [
        'Options:',
        '  --info  Show help  [boolean]',
        ''
      ]
      option.logs[0].split('\n').should.deep.equal(expected)
      command.logs[0].split('\n').should.deep.equal(expected)
      helpOption.result.should.have.property('help').and.be.true
    })

    it('enables given string as help option and command with string argument and `true` argument', function () {
      var option = checkOutput(function () {
        return yargs('--info')
          .help('info', true)
          .wrap(null)
          .argv
      })
      var command = checkOutput(function () {
        return yargs('info')
          .help('info', true)
          .wrap(null)
          .argv
      })
      var helpOption = checkOutput(function () {
        return yargs('--help')
          .help('info', true)
          .wrap(null)
          .argv
      })
      var expected = [
        'Options:',
        '  --info  Show help  [boolean]',
        ''
      ]
      option.logs[0].split('\n').should.deep.equal(expected)
      command.logs[0].split('\n').should.deep.equal(expected)
      helpOption.result.should.have.property('help').and.be.true
    })

    it('enables given string as help option only with string argument and `false` argument', function () {
      var option = checkOutput(function () {
        return yargs('--info')
          .help('info', false)
          .wrap(null)
          .argv
      })
      var command = checkOutput(function () {
        return yargs('info')
          .help('info', false)
          .wrap(null)
          .argv
      })
      option.logs[0].split('\n').should.deep.equal([
        'Options:',
        '  --info  Show help  [boolean]',
        ''
      ])
      command.result.should.have.property('_').and.deep.equal(['info'])
    })

    it('enables given string as help option and command with custom description with two string arguments', function () {
      var option = checkOutput(function () {
        return yargs('--info')
          .help('info', 'Display info')
          .wrap(null)
          .argv
      })
      var command = checkOutput(function () {
        return yargs('info')
          .help('info', 'Display info')
          .wrap(null)
          .argv
      })
      var expected = [
        'Options:',
        '  --info  Display info  [boolean]',
        ''
      ]
      option.logs[0].split('\n').should.deep.equal(expected)
      command.logs[0].split('\n').should.deep.equal(expected)
    })

    it('enables given string as help option and command with custom description with two string arguments and `true` argument', function () {
      var option = checkOutput(function () {
        return yargs('--info')
          .help('info', 'Display info', true)
          .wrap(null)
          .argv
      })
      var command = checkOutput(function () {
        return yargs('info')
          .help('info', 'Display info', true)
          .wrap(null)
          .argv
      })
      var expected = [
        'Options:',
        '  --info  Display info  [boolean]',
        ''
      ]
      option.logs[0].split('\n').should.deep.equal(expected)
      command.logs[0].split('\n').should.deep.equal(expected)
    })

    it('enables given string as help option only and custom description with two string arguments and `false` argument', function () {
      var option = checkOutput(function () {
        return yargs('--info')
          .help('info', 'Display info', false)
          .wrap(null)
          .argv
      })
      var command = checkOutput(function () {
        return yargs('info')
          .help('info', 'Display info', false)
          .wrap(null)
          .argv
      })
      option.logs[0].split('\n').should.deep.equal([
        'Options:',
        '  --info  Display info  [boolean]',
        ''
      ])
      command.result.should.have.property('_').and.deep.equal(['info'])
    })
  })

  describe('.help() with .alias()', function () {
    it('uses multi-char (but not single-char) help alias as command', function () {
      var info = checkOutput(function () {
        return yargs('info')
          .help().alias('h', 'help').alias('h', 'info')
          .wrap(null)
          .argv
      })
      var h = checkOutput(function () {
        return yargs('h')
          .help().alias('h', 'help').alias('h', 'info')
          .wrap(null)
          .argv
      })
      info.logs[0].split('\n').should.deep.equal([
        'Options:',
        '  -h, --help, --info  Show help  [boolean]',
        ''
      ])
      h.result.should.have.property('_').and.deep.equal(['h'])
    })

    it('uses single-char help alias as command if there are no multi-char aliases', function () {
      var h = checkOutput(function () {
        return yargs('h')
          .help('h').alias('h', '?')
          .wrap(null)
          .argv
      })
      var q = checkOutput(function () {
        return yargs('?')
          .help('h').alias('h', '?')
          .wrap(null)
          .argv
      })
      var expected = [
        'Options:',
        '  -h, -?  Show help  [boolean]',
        ''
      ]
      h.logs[0].split('\n').should.deep.equal(expected)
      q.logs[0].split('\n').should.deep.equal(expected)
    })
  })

  describe('.coerce()', function () {
    it('supports string and function args (as option key and coerce function)', function () {
      var argv = yargs(['--file', path.join(__dirname, 'fixtures', 'package.json')])
        .coerce('file', function (arg) {
          return JSON.parse(fs.readFileSync(arg, 'utf8'))
        })
        .argv
      expect(argv.file).to.have.property('version').and.equal('9.9.9')
    })

    it('supports object arg (as map of multiple options)', function () {
      var argv = yargs('--expand abc --range 1..3')
        .coerce({
          expand: function (arg) {
            return arg.split('')
          },
          range: function (arg) {
            var arr = arg.split('..').map(Number)
            return { begin: arr[0], end: arr[1] }
          }
        })
        .argv
      expect(argv.expand).to.deep.equal(['a', 'b', 'c'])
      expect(argv.range).to.have.property('begin').and.equal(1)
      expect(argv.range).to.have.property('end').and.equal(3)
    })

    it('supports array and function args (as option keys and coerce function)', function () {
      var argv = yargs(['--src', 'in', '--dest', 'out'])
        .coerce(['src', 'dest'], function (arg) {
          return path.resolve(arg)
        })
        .argv
      argv.src.should.match(/in/).and.have.length.above(2)
      argv.dest.should.match(/out/).and.have.length.above(3)
    })

    it('allows an error to be handled by fail() handler', function () {
      var msg
      var err
      yargs('--json invalid')
        .coerce('json', function (arg) {
          return JSON.parse(arg)
        })
        .fail(function (m, e) {
          msg = m
          err = e
        })
        .argv
      expect(msg).to.match(/Unexpected token i/)
      expect(err).to.exist
    })

    it('supports an option alias', function () {
      var argv = yargs('-d 2016-08-12')
        .coerce('date', Date.parse)
        .alias('date', 'd')
        .argv
      argv.date.should.equal(1470960000000)
    })

    it('supports a global option within command', function () {
      var regex
      yargs('check --regex x')
        .global('regex')
        .coerce('regex', RegExp)
        .command('check', 'Check something', {}, function (argv) {
          regex = argv.regex
        })
        .argv
      expect(regex).to.be.an.instanceof(RegExp)
      regex.toString().should.equal('/x/')
    })

    it('is supported by .option()', function () {
      var argv = yargs('--env SHELL=/bin/bash')
        .option('env', {
          coerce: function (arg) {
            var arr = arg.split('=')
            return { name: arr[0], value: arr[1] || '' }
          }
        })
        .argv
      expect(argv.env).to.have.property('name').and.equal('SHELL')
      expect(argv.env).to.have.property('value').and.equal('/bin/bash')
    })

    it('supports positional and variadic args for a command', function () {
      var age
      var dates
      yargs('add 30days 2016-06-13 2016-07-18')
        .command('add <age> [dates..]', 'Testing', function (yargs) {
          return yargs
            .coerce('age', function (arg) {
              return parseInt(arg, 10) * 86400000
            })
            .coerce('dates', function (arg) {
              return arg.map(function (str) {
                return new Date(str)
              })
            })
        }, function (argv) {
          age = argv.age
          dates = argv.dates
        })
        .argv
      expect(age).to.equal(2592000000)
      expect(dates).to.have.lengthOf(2)
      dates[0].toString().should.equal(new Date('2016-06-13').toString())
      dates[1].toString().should.equal(new Date('2016-07-18').toString())
    })

    it('returns camelcase args for a command', function () {
      var age1
      var age2
      var dates
      yargs('add 30days 2016-06-13 2016-07-18')
        .command('add <age-in-days> [dates..]', 'Testing', function (yargs) {
          return yargs
            .coerce('age-in-days', function (arg) {
              return parseInt(arg, 10) * 86400000
            })
            .coerce('dates', function (arg) {
              return arg.map(function (str) {
                return new Date(str)
              })
            })
        }, function (argv) {
          age1 = argv.ageInDays
          age2 = argv['age-in-days']
          dates = argv.dates
        })
        .argv
      expect(age1).to.equal(2592000000)
      expect(age2).to.equal(2592000000)
      expect(dates).to.have.lengthOf(2)
      dates[0].toString().should.equal(new Date('2016-06-13').toString())
      dates[1].toString().should.equal(new Date('2016-07-18').toString())
    })

    it('allows an error from positional arg to be handled by fail() handler', function () {
      var msg
      var err
      yargs('throw ball')
        .command('throw <msg>', false, function (yargs) {
          return yargs
            .coerce('msg', function (arg) {
              throw new Error(arg)
            })
            .fail(function (m, e) {
              msg = m
              err = e
            })
        })
        .argv
      expect(msg).to.equal('ball')
      expect(err).to.exist
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
