'use strict'
/* global context, describe, it, beforeEach, afterEach */

const expect = require('chai').expect
const fs = require('fs')
const path = require('path')
const checkOutput = require('./helpers/utils').checkOutput
let yargs
const YError = require('../lib/yerror')

require('chai').should()

const noop = () => {}

describe('yargs dsl tests', () => {
  beforeEach(() => {
    yargs = require('../')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../')]
  })

  it('should use bin name for $0, eliminating path', () => {
    process.argv[1] = '/usr/local/bin/ndm'
    process.env._ = '/usr/local/bin/ndm'
    process.execPath = '/usr/local/bin/ndm'
    const argv = yargs([]).argv
    argv['$0'].should.eql('ndm')
  })

  it('accepts an object for aliases', () => {
    const argv = yargs([])
    .alias({
      cool: 'cat'
    })
    .default('cool', 33)
    .argv

    argv.cat.should.eql(33)
  })

  it('populates argv with placeholder keys for all options', () => {
    const argv = yargs([])
      .option('cool', {})
      .argv

    Object.keys(argv).should.include('cool')
  })

  it('accepts an object for implies', () => {
    const r = checkOutput(() => yargs(['--x=33'])
        .implies({
          x: 'y'
        })
        .argv
      )

    r.errors[1].should.match(/Implications failed/)
  })

  it('accepts an object for describes', () => {
    const r = checkOutput(() => yargs([])
        .describe({
          x: 'really cool key'
        })
        .demand('x')
        .wrap(null)
        .argv
      )

    r.errors[0].should.match(/really cool key/)
    r.result.should.have.property('x')
    r.result.should.not.have.property('[object Object]')
  })

  it('a function can be provided, to execute when a parsing failure occurs', (done) => {
    yargs(['--x=33'])
      .implies({
        x: 'y'
      })
      .fail((msg) => {
        msg.should.match(/Implications failed/)
        return done()
      })
      .argv
  })

  it('should set alias to string if option is string', () => {
    const argv = yargs(['--cat=99'])
      .options('c', {
        alias: 'cat',
        string: true
      })
      .argv

    argv.cat.should.eql('99')
    argv.c.should.eql('99')
  })

  it('should allow a valid choice', () => {
    const argv = yargs(['--looks=good'])
      .option('looks', {
        choices: ['good', 'bad']
      })
      .argv

    argv.looks.should.eql('good')
  })

  it('should allow defaultDescription to be set with .option()', () => {
    const optDefaultDescriptions = yargs([])
      .option('port', {
        defaultDescription: '80 for HTTP and 443 for HTTPS'
      })
      .getOptions().defaultDescription

    optDefaultDescriptions.should.deep.equal({
      port: '80 for HTTP and 443 for HTTPS'
    })
  })

  it('should not require config object for an option', () => {
    const r = checkOutput(() => yargs([])
        .option('x')
        .argv
      )

    expect(r.errors).to.deep.equal([])
  })

  describe('showHelpOnFail', () => {
    it('should display custom failure message, if string is provided as first argument', () => {
      const r = checkOutput(() => yargs([])
          .showHelpOnFail('pork chop sandwiches')
          .demand('cat')
          .argv
        )

      r.errors[3].should.match(/pork chop sandwiches/)
    })

    it('calling with no arguments should default to displaying help', () => {
      const r = checkOutput(() => yargs([])
          .showHelpOnFail()
          .demand('cat')
          .argv
        )

      r.errors[1].should.match(/required argument/)
    })
  })

  describe('exitProcess', () => {
    describe('when exitProcess is set to false and a failure occurs', () => {
      it('should throw an exception', () => {
        checkOutput(() => {
          expect(() => {
            yargs([])
              .demand('cat')
              .showHelpOnFail(false)
              .exitProcess(false)
              .argv
          }).to.throw(/Missing required argument/)
        })
      })
      it('should output the errors to stderr once', () => {
        const r = checkOutput(() => {
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
    it('should set exit process to true, if no argument provided', () => {
      const r = checkOutput(() => yargs([])
          .demand('cat')
          .exitProcess()
          .argv
        )

      r.exit.should.eql(true)
    })
  })

  describe('reset', () => {
    it('should put yargs back into its initial state', () => {
      // create a command line with all the things.
      // so that we can confirm they're reset.
      const y = yargs(['--help'])
        .command('foo', 'bar', noop)
        .default('foo', 'bar')
        .describe('foo', 'foo variable')
        .demandCommand(1)
        .demandOption('foo')
        .string('foo')
        .alias('foo', 'bar')
        .string('foo')
        .choices('foo', ['bar', 'baz'])
        .coerce('foo', foo => `${foo}bar`)
        .implies('foo', 'snuh')
        .conflicts('qux', 'xyzzy')
        .group('foo', 'Group:')
        .exitProcess(false)  // defaults to true.
        .global('foo', false)
        .global('qux', false)
        .env('YARGS')
        .reset()

      const emptyOptions = {
        array: [],
        boolean: ['help', 'version'],
        string: [],
        alias: {},
        default: {},
        key: {help: true, version: true},
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
        demandedCommands: {},
        demandedOptions: {},
        local: [
          '_',
          'foo',
          'qux'
        ]
      }

      expect(y.getOptions()).to.deep.equal(emptyOptions)
      expect(y.getUsageInstance().getDescriptions()).to.deep.equal({
        help: '__yargsString__:Show help',
        version: '__yargsString__:Show version number'
      })
      expect(y.getValidationInstance().getImplied()).to.deep.equal({})
      expect(y.getValidationInstance().getConflicting()).to.deep.equal({})
      expect(y.getCommandInstance().getCommandHandlers()).to.deep.equal({})
      expect(y.getExitProcess()).to.equal(false)
      expect(y.getDemandedOptions()).to.deep.equal({})
      expect(y.getDemandedCommands()).to.deep.equal({})
      expect(y.getGroups()).to.deep.equal({})
    })

    it('does not invoke parse with an error if reset has been called and option is not global', (done) => {
      const y = yargs()
        .demand('cake')
        .global('cake', false)

      y.parse('hello', (err) => {
        err.message.should.match(/Missing required argument/)
      })
      y.reset()
      y.parse('cake', (err) => {
        expect(err).to.equal(null)
        return done()
      })
    })
  })

  describe('command', () => {
    it('executes command handler with parsed argv', (done) => {
      yargs(['blerg'])
        .command(
          'blerg',
          'handle blerg things',
          noop,
          (argv) => {
            // we should get the argv from the prior yargs.
            argv._[0].should.equal('blerg')
            return done()
          }
        )
        .exitProcess(false) // defaults to true.
        .argv
    })
    it('runs all middleware before reaching the handler', function (done) {
      yargs(['foo'])
        .command(
          'foo',
          'handle foo things',
          function () {},
          function (argv) {
            // we should get the argv filled with data from the middleware
            argv._[0].should.equal('foo')
            argv.hello.should.equal('world')
            return done()
          },
        [function (argv) {
          return {hello: 'world'}
        }]
        )
        .exitProcess(false) // defaults to true.
        .argv
    })
    it('recommends a similar command if no command handler is found', () => {
      const r = checkOutput(() => {
        yargs(['boat'])
          .command('goat')
          .recommendCommands()
          .argv
      })

      r.errors[1].should.match(/Did you mean goat/)
    })

    it('does not recommend a similiar command if no similar command exists', () => {
      const r = checkOutput(() => {
        yargs(['foo'])
          .command('nothingSimilar')
          .recommendCommands()
          .argv
      })

      r.logs.should.be.empty
    })

    it('recommends the longest match first', () => {
      const r = checkOutput(() => {
        yargs(['boat'])
          .command('bot')
          .command('goat')
          .recommendCommands()
          .argv
      })

      r.errors[1].should.match(/Did you mean goat/)
    })

    // see: https://github.com/yargs/yargs/issues/822
    it('does not print command recommendation if help message will be shown', (done) => {
      const parser = yargs()
        .command('goat')
        .help()
        .recommendCommands()

      parser.parse('boat help', {}, (err, _argv, output) => {
        if (err) return done(err)
        output.split('Commands:').length.should.equal(2)
        return done()
      })
    })

    it("skips executing root-level command if builder's help is executed", () => {
      const r = checkOutput(() => {
        yargs(['blerg', '-h'])
          .command(
            'blerg',
            'handle blerg things',
            yargs => yargs
                .command('snuh', 'snuh command')
                .help('h')
                .wrap(null),
            () => {
              throw Error('should not happen')
            }
          )
          .help('h')
          .argv
      })

      r.logs[0].split('\n').should.deep.equal([
        'usage blerg',
        '',
        'handle blerg things',
        '',
        'Commands:',
        '  usage blerg snuh  snuh command',
        '',
        'Options:',
        '  --version  Show version number  [boolean]',
        '  -h         Show help  [boolean]',
        ''
      ])
    })

    it('executes top-level help if no handled command is provided', () => {
      const r = checkOutput(() => {
        yargs(['snuh', '-h'])
          .command('blerg', 'handle blerg things', yargs => yargs
              .command('snuh', 'snuh command')
              .help('h')
              .argv
            )
          .help('h')
          .wrap(null)
          .argv
      })

      r.logs[0].split('\n').should.deep.equal([
        'usage [command]',
        '',
        'Commands:',
        '  usage blerg  handle blerg things',
        '',
        'Options:',
        '  --version  Show version number  [boolean]',
        '  -h         Show help  [boolean]',
        ''
      ])
    })

    it("accepts an object for describing a command's options", () => {
      const r = checkOutput(() => {
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

      const usageString = r.logs[0]
      usageString.should.match(/usage blerg <foo>/)
      usageString.should.match(/--foo.*default: 99/)
      usageString.should.match(/--bar.*default: "hello world"/)
    })

    it("accepts a module with a 'builder' and 'handler' key", () => {
      const argv = yargs(['blerg', 'bar'])
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

    it("accepts a module with a keys 'command', 'describe', 'builder', and 'handler'", () => {
      const argv = yargs(['blerg', 'bar'])
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

    it('derives \'command\' string from filename when missing', () => {
      const argv = yargs('nameless --foo bar')
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

    it('throws error for non-module command object missing \'command\' string', () => {
      expect(() => {
        yargs.command({
          desc: 'A command with no name',
          builder (yargs) { return yargs },
          handler (argv) {}
        })
      }).to.throw(/No command name given for module: { desc: 'A command with no name',\n {2}builder: \[Function(: builder)?],\n {2}handler: \[Function(: handler)?] }/)
    })
  })

  describe('terminalWidth', () => {
    it('returns the maximum width of the terminal', function () {
      if (!process.stdout.isTTY) {
        return this.skip()
      }

      yargs.terminalWidth().should.be.gte(0)
    })
  })

  describe('number', () => {
    it('accepts number arguments when a number type is specified', () => {
      const argv = yargs('-w banana')
        .number('w')
        .argv

      expect(typeof argv.w).to.equal('number')
    })

    it('should expose an options short-hand for numbers', () => {
      const argv = yargs('-w banana')
        .option('w', {
          number: true
        })
        .alias('w', 'x')
        .argv

      expect(typeof argv.w).to.equal('number')
      expect(typeof argv.x).to.equal('number')
    })
  })

  describe('choices', () => {
    it('accepts an object', () => {
      const optChoices = yargs([])
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

    it('accepts a string and array', () => {
      const optChoices = yargs([])
        .choices('meat', ['beef', 'chicken', 'pork', 'bison'])
        .choices('temp', ['rare', 'med-rare', 'med', 'med-well', 'well'])
        .getOptions().choices

      optChoices.should.deep.equal({
        meat: ['beef', 'chicken', 'pork', 'bison'],
        temp: ['rare', 'med-rare', 'med', 'med-well', 'well']
      })
    })

    it('accepts a string and single value', () => {
      const optChoices = yargs([])
        .choices('gender', 'male')
        .choices('gender', 'female')
        .getOptions().choices

      optChoices.should.deep.equal({
        gender: ['male', 'female']
      })
    })
  })

  describe('locale', () => {
    it('uses english as a default locale', () => {
      ['LANGUAGE', 'LC_ALL', 'LANG', 'LC_MESSAGES'].forEach((e) => {
        delete process.env[e]
      })
      yargs.locale().should.equal('en_US')
    })

    it("detects the operating system's locale", () => {
      loadLocale('es_ES.UTF-8')
      yargs.locale().should.equal('es_ES')
      loadLocale('en_US.UTF-8')
    })

    it("should not detect the OS locale if detectLocale is 'false'", () => {
      loadLocale('es_ES.UTF-8')

      const r = checkOutput(() => {
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

    it("allows a locale other than the default 'en' to be specified", () => {
      const r = checkOutput(() => {
        yargs(['snuh', '-h'])
          .command('blerg', 'blerg command')
          .help('h')
          .wrap(null)
          .locale('pirate')
          .argv
      })

      r.logs.join(' ').should.match(/Choose yer command:/)
    })

    it('handles a missing locale', () => {
      loadLocale('zz_ZZ.UTF-8')

      const r = checkOutput(() => {
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

    it('properly translates a region-specific locale file', () => {
      loadLocale('pt_BR.UTF-8')

      const r = checkOutput(() => {
        yargs(['-h'])
          .help('h')
          .wrap(null)
          .argv
      })

      yargs.locale().should.equal('pt_BR')
      loadLocale('en_US.UTF-8')
      r.logs.join(' ').should.match(/Exibe ajuda/)
    })

    it('handles os-locale throwing an exception', () => {
      // make os-locale throw.
      require('os-locale')
      require.cache[require.resolve('os-locale')].exports.sync = () => { throw Error('an error!') }

      delete require.cache[require.resolve('../')]
      yargs = require('../')

      yargs.locale().should.equal('en')
    })

    it('uses locale string for help option default desc on .locale().help()', () => {
      const r = checkOutput(() => {
        yargs(['-h'])
          .locale('pirate')
          .help('h')
          .wrap(null)
          .argv
      })

      r.logs.join(' ').should.match(/Parlay this here code of conduct/)
    })

    it('uses locale string for help option default desc on .help().locale()', () => {
      const r = checkOutput(() => {
        yargs(['-h'])
          .help('h')
          .locale('pirate')
          .wrap(null)
          .argv
      })

      r.logs.join(' ').should.match(/Parlay this here code of conduct/)
    })

    describe('updateLocale', () => {
      it('allows you to override the default locale strings', () => {
        const r = checkOutput(() => {
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

      it('allows you to use updateStrings() as an alias for updateLocale()', () => {
        const r = checkOutput(() => {
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

  describe('env', () => {
    it('translates no arg as empty prefix (parser applies all env vars)', () => {
      const options = yargs.env().getOptions()
      options.envPrefix.should.equal('')
    })

    it('accepts true as a valid prefix (parser applies all env vars)', () => {
      const options = yargs.env(true).getOptions()
      options.envPrefix.should.equal(true)
    })

    it('accepts empty string as a valid prefix (parser applies all env vars)', () => {
      const options = yargs.env('').getOptions()
      options.envPrefix.should.equal('')
    })

    it('accepts a string prefix', () => {
      const options = yargs.env('COOL').getOptions()
      options.envPrefix.should.equal('COOL')
    })

    it('translates false as undefined prefix (disables parsing of env vars)', () => {
      const options = yargs.env(false).getOptions()
      expect(options.envPrefix).to.be.undefined
    })
  })

  describe('parse', () => {
    it('parses a simple string', () => {
      const a1 = yargs.parse('-x=2 --foo=bar')
      const a2 = yargs('-x=2 --foo=bar').argv
      a1.x.should.equal(2)
      a2.x.should.equal(2)

      a1.foo.should.equal('bar')
      a2.foo.should.equal('bar')
    })

    it('parses a quoted string', () => {
      const a1 = yargs.parse('-x=\'marks "the" spot\' --foo "break \'dance\'"')
      const a2 = yargs('-x=\'marks "the" spot\' --foo "break \'dance\'"').argv

      a1.x.should.equal('marks "the" spot')
      a2.x.should.equal('marks "the" spot')

      a1.foo.should.equal("break 'dance'")
      a2.foo.should.equal("break 'dance'")
    })

    it('parses an array', () => {
      const a1 = yargs.parse(['-x', '99', '--why=hello world'])
      const a2 = yargs(['-x', '99', '--why=hello world']).argv

      a1.x.should.equal(99)
      a2.x.should.equal(99)

      a1.why.should.equal('hello world')
      a2.why.should.equal('hello world')
    })

    it('ignores implicit help command (with short-circuit)', () => {
      const parsed = yargs.help().parse('help', true)
      parsed._.should.deep.equal(['help'])
    })

    it('allows an optional context object to be provided', () => {
      const a1 = yargs.parse('-x=2 --foo=bar', {
        context: 'look at me go!'
      })
      a1.x.should.equal(2)
      a1.foo.should.equal('bar')
      a1.context.should.equal('look at me go!')
    })

    // see https://github.com/yargs/yargs/issues/724
    it('overrides parsed value of argv with context object', () => {
      const a1 = yargs.parse('-x=33', {
        x: 42
      })
      a1.x.should.equal(42)
    })

    it('parses process.argv if no arguments are provided', () => {
      const r = checkOutput(() => {
        yargs(['--help'])
          .command('blerg', 'blerg command')
          .wrap(null)
          .parse()
      })

      r.logs[0].should.match(/Commands:[\s\S]*blerg command/)
    })
  })

  // yargs.parse(['foo', '--bar'], function (err, argv, output) {}
  context('function passed as second argument to parse', () => {
    it('does not print to stdout', () => {
      const r = checkOutput(() => {
        yargs()
          .help('h')
          .parse('-h', (_err, argv, output) => {})
      })

      r.logs.length.should.equal(0)
      r.errors.length.should.equal(0)
    })

    it('gets passed error as first argument', () => {
      let err = null
      const r = checkOutput(() => {
        yargs()
          .demand('robin')
          .parse('batman', (_err, argv, output) => {
            err = _err
          })
      })
      r.logs.length.should.equal(0)
      r.errors.length.should.equal(0)
      err.should.match(/Missing required argument/)
    })

    it('gets passed argv as second argument', () => {
      let argv = null
      const r = checkOutput(() => {
        yargs()
          .demand('robin')
          .parse('batman --foo', (_err, _argv, output) => {
            argv = _argv
          })
      })
      r.logs.length.should.equal(0)
      r.errors.length.should.equal(0)
      argv.foo.should.equal(true)
    })

    it('gets passed output as third argument', () => {
      let output = null
      const r = checkOutput(() => {
        yargs()
          .demand('robin')
          .help()
          .parse('--help', (_err, argv, _output) => {
            output = _output
          })
      })
      r.logs.length.should.equal(0)
      r.errors.length.should.equal(0)
      output.should.match(/--robin.*\[required]/)
    })

    it('reinstates original exitProcess setting after invocation', () => {
      let callbackCalled = false
      const r = checkOutput(() => {
        yargs
          .exitProcess(true)
          .help()
          .parse('--help', () => {
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

    it('does not call callback if subsequently called without callback', () => {
      let callbackCalled = 0
      const callback = () => {
        callbackCalled++
      }
      yargs.help()
      const r1 = checkOutput(() => {
        yargs.parse('--help', callback)
      })
      const r2 = checkOutput(() => {
        yargs.parse('--help')
      })
      callbackCalled.should.equal(1)
      r1.logs.length.should.equal(0)
      r1.errors.length.should.equal(0)
      r1.exit.should.be.false
      r2.exit.should.be.true
      r2.errors.length.should.equal(0)
      r2.logs[0].should.match(/--help.*Show help.*\[boolean]/)
    })

    it('resets error state between calls to parse', () => {
      const y = yargs()
        .demand(2)

      let err1 = null
      let out1 = null
      let argv1 = null
      y.parse('foo', (err, argv, output) => {
        err1 = err
        argv1 = argv
        out1 = output
      })

      err1.message.should.match(/Not enough non-option arguments/)
      argv1._.should.include('foo')
      out1.should.match(/Not enough non-option arguments/)

      let err2 = null
      let argv2 = null
      let out2 = null
      y.parse('foo bar', (err, argv, output) => {
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

    describe('commands', () => {
      it('does not invoke command handler if output is populated', () => {
        let err = null
        let handlerCalled = false
        const r = checkOutput(() => {
          yargs()
            .command('batman <api-token>', 'batman command', noop, () => {
              handlerCalled = true
            })
            .parse('batman --what', (_err, argv, output) => {
              err = _err
            })
        })
        r.logs.length.should.equal(0)
        r.errors.length.should.equal(0)
        err.message.should.match(/Not enough non-option arguments/)
        handlerCalled.should.equal(false)
      })

      it('invokes command handler normally if no output is populated', () => {
        let argv = null
        let output = null
        const r = checkOutput(() => {
          yargs()
            .command('batman <api-token>', 'batman command', noop, (_argv) => {
              argv = _argv
            })
            .parse('batman robin --what', (_err, argv, _output) => {
              output = _output
            })
        })
        r.logs.length.should.equal(0)
        r.errors.length.should.equal(0)
        output.should.equal('')
        argv['api-token'].should.equal('robin')
        argv.what.should.equal(true)
      })

      it('allows context object to be passed to parse', () => {
        let argv = null
        yargs()
          .command('batman <api-token>', 'batman command', noop, (_argv) => {
            argv = _argv
          })
          .parse('batman robin --what', {
            state: 'grumpy but rich'
          }, (_err, argv, _output) => {})

        argv.state.should.equal('grumpy but rich')
        argv['api-token'].should.equal('robin')
        argv.what.should.equal(true)
      })

      // see: https://github.com/yargs/yargs/issues/671
      it('does not fail if context object has cyclical reference', () => {
        let argv = null
        const context = {state: 'grumpy but rich'}
        context.res = context
        yargs()
          .command('batman <api-token>', 'batman command', noop, (_argv) => {
            argv = _argv
          })
          .parse('batman robin --what', context, (_err, argv, _output) => {})

        argv.state.should.equal('grumpy but rich')
        argv['api-token'].should.equal('robin')
        argv.what.should.equal(true)
      })

      it('allows nested sub-commands to be invoked multiple times', () => {
        const context = {counter: 0}

        checkOutput(() => {
          const parser = yargs()
            .commandDir('fixtures/cmddir')

          parser.parse('dream within-a-dream --what', {context}, (_err, argv, _output) => {})
          parser.parse('dream within-a-dream --what', {context}, (_err, argv, _output) => {})
          parser.parse('dream within-a-dream --what', {context}, (_err, argv, _output) => {})
        })

        context.counter.should.equal(3)
      })

      it('overwrites the prior context object, when parse is called multiple times', () => {
        let argv = null
        const parser = yargs()
          .command('batman <api-token>', 'batman command', noop, (_argv) => {})

        parser.parse('batman robin --what', {
          state: 'grumpy but rich'
        }, (_err, _argv, _output) => {})

        parser.parse('batman robin --what', {
          state: 'the hero we need'
        }, (_err, _argv, _output) => {
          argv = _argv
        })

        argv.state.should.equal('the hero we need')
      })

      it('populates argv appropriately when parse is called multiple times', () => {
        const parser = yargs()
          .command('batman <api-token>', 'batman command', noop, (_argv) => {})
          .command('robin <egg>', 'robin command', noop, (_argv) => {})

        let argv1 = null
        parser.parse('batman abc123', (_err, argv, _output) => {
          argv1 = argv
        })
        let argv2 = null
        parser.parse('robin blue', (_err, argv, _output) => {
          argv2 = argv
        })
        expect(argv1.egg).to.equal(undefined)
        argv1['api-token'].should.equal('abc123')

        expect(argv2['api-token']).to.equal(undefined)
        argv2.egg.should.equal('blue')
      })

      it('populates output appropriately when parse is called multiple times', () => {
        const parser = yargs()
          .command('batman <api-token>', 'batman command', noop, (_argv) => {})
          .command('robin <egg>', 'robin command', noop, (_argv) => {})
          .wrap(null)

        let output1 = null
        parser.parse('batman help', (_err, _argv, output) => {
          output1 = output
        })
        let output2 = null
        parser.parse('robin help', (_err, _argv, output) => {
          output2 = output
        })

        output1.split('\n').should.deep.equal([
          'ndm batman <api-token>',
          '',
          'batman command',
          '',
          'Options:',
          '  --help     Show help  [boolean]',
          '  --version  Show version number  [boolean]',
          ''
        ])

        output2.split('\n').should.deep.equal([
          'ndm robin <egg>',
          '',
          'robin command',
          '',
          'Options:',
          '  --help     Show help  [boolean]',
          '  --version  Show version number  [boolean]',
          ''
        ])
      })

      it('resets errors when parse is called multiple times', () => {
        const parser = yargs()
          .command('batman <api-token>', 'batman command', noop, (_argv) => {})
          .command('robin <egg>', 'robin command', noop, (_argv) => {})
          .wrap(null)

        let error1 = null
        let output1 = null
        parser.parse('batman', (err, _argv, output) => {
          error1 = err
          output1 = output
        })
        let error2 = null
        let output2 = null
        parser.parse('robin help', (err, _argv, output) => {
          error2 = err
          output2 = output
        })

        error1.message.should.match(/Not enough non-option arguments/)
        output1.split('\n').should.deep.equal([
          'ndm batman <api-token>',
          '',
          'batman command',
          '',
          'Options:',
          '  --help     Show help  [boolean]',
          '  --version  Show version number  [boolean]',
          '',
          'Not enough non-option arguments: got 0, need at least 1'
        ])

        expect(error2).to.equal(undefined)
        output2.split('\n').should.deep.equal([
          'ndm robin <egg>',
          '',
          'robin command',
          '',
          'Options:',
          '  --help     Show help  [boolean]',
          '  --version  Show version number  [boolean]',
          ''
        ])
      })

      it('preserves top-level config when parse is called multiple times', () => {
        let x = 'wrong'
        let err
        let output
        // set some top-level, reset-able config
        const parser = yargs()
          .demand(1, 'Must call a command')
          .strict()
          .wrap(null)
          .command('one <x>', 'The one and only command')
        // first call parse with command, which calls reset
        parser.parse('one two', (_, argv) => {
          x = argv.x
        })
        // then call parse without command, which should enforce top-level config
        parser.parse('', (_err, argv, _output) => {
          err = _err || {}
          output = _output || ''
        })
        x.should.equal('two')
        err.should.have.property('message').and.equal('Must call a command')
        output.split('\n').should.deep.equal([
          'ndm <command>',
          '',
          'Commands:',
          '  ndm one <x>  The one and only command',
          '',
          'Options:',
          '  --help     Show help  [boolean]',
          '  --version  Show version number  [boolean]',
          '',
          'Must call a command'
        ])
      })
    })
  })

  describe('config', () => {
    it('allows a parsing function to be provided as a second argument', () => {
      const argv = yargs('--config ./test/fixtures/config.json')
        .config('config', path => JSON.parse(fs.readFileSync(path)))
        .global('config', false)
        .argv

      argv.foo.should.equal('baz')
    })

    it('allows key to be specified with option shorthand', () => {
      const argv = yargs('--config ./test/fixtures/config.json')
        .option('config', {
          config: true,
          global: false
        })
        .argv

      argv.foo.should.equal('baz')
    })

    it('can be disabled with option shorthand', () => {
      const argv = yargs('--config ./test/fixtures/config.json')
        .option('config', {
          config: false,
          global: false
        })
        .argv

      argv.config.should.equal('./test/fixtures/config.json')
    })

    it('allows to pass a configuration object', () => {
      const argv = yargs
          .config({foo: 1, bar: 2})
          .argv

      argv.foo.should.equal(1)
      argv.bar.should.equal(2)
    })

    describe('extends', () => {
      it('applies default configurations when given config object', () => {
        const argv = yargs
          .config({
            extends: './test/fixtures/extends/config_1.json',
            a: 1
          })
          .argv

        argv.a.should.equal(1)
        argv.b.should.equal(22)
        argv.z.should.equal(15)
      })

      it('protects against circular extended configurations', () => {
        expect(() => {
          yargs.config({extends: './test/fixtures/extends/circular_1.json'})
        }).to.throw(YError)
      })

      it('handles aboslute paths', () => {
        const absolutePath = path.join(process.cwd(), 'test', 'fixtures', 'extends', 'config_1.json')

        const argv = yargs
          .config({
            a: 2,
            extends: absolutePath
          })
          .argv

        argv.a.should.equal(2)
        argv.b.should.equal(22)
        argv.z.should.equal(15)
      })

      // see: https://www.npmjs.com/package/yargs-test-extends
      it('allows a module to be extended, rather than a JSON file', () => {
        const argv = yargs()
          .config({
            a: 2,
            extends: 'yargs-test-extends'
          })
          .argv

        argv.a.should.equal(2)
        argv.c.should.equal(201)
      })

      it('ignores an extends key that does not look like a path or module', () => {
        const argv = yargs()
          .config({
            a: 2,
            extends: 'batman'
          })
          .argv

        argv.a.should.equal(2)
        argv.extends.should.equal('batman')
      })
    })
  })

  describe('normalize', () => {
    it('normalizes paths passed as arguments', () => {
      const argv = yargs('--path /foo/bar//baz/asdf/quux/..')
        .normalize(['path'])
        .argv

      argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep))
    })

    it('normalizes path when when it is updated', () => {
      const argv = yargs('--path /batman')
        .normalize(['path'])
        .argv

      argv.path = '/foo/bar//baz/asdf/quux/..'
      argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep))
    })

    it('allows key to be specified with option shorthand', () => {
      const argv = yargs('--path /batman')
        .option('path', {
          normalize: true
        })
        .argv

      argv.path = '/foo/bar//baz/asdf/quux/..'
      argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep))
    })

    it('can be disabled with option shorthand', () => {
      const argv = yargs('--path /batman')
        .option('path', {
          normalize: false
        })
        .argv

      argv.path = 'mongodb://url'
      argv.path.should.equal('mongodb://url')
    })
  })

  describe('narg', () => {
    it('accepts a key as the first argument and a count as the second', () => {
      const argv = yargs('--foo a b c')
        .nargs('foo', 2)
        .argv

      argv.foo.should.deep.equal(['a', 'b'])
      argv._.should.deep.equal(['c'])
    })

    it('accepts a hash of keys and counts', () => {
      const argv = yargs('--foo a b c')
        .nargs({
          foo: 2
        })
        .argv

      argv.foo.should.deep.equal(['a', 'b'])
      argv._.should.deep.equal(['c'])
    })

    it('allows key to be specified with option shorthand', () => {
      const argv = yargs('--foo a b c')
        .option('foo', {
          nargs: 2
        })
        .argv

      argv.foo.should.deep.equal(['a', 'b'])
      argv._.should.deep.equal(['c'])
    })
  })

  describe('global', () => {
    it('does not reset a global options when reset is called', () => {
      const y = yargs('--foo a b c')
        .option('foo', {
          nargs: 2
        })
        .option('bar', {
          nargs: 2,
          global: false
        })
        .global('foo')
        .reset()
      const options = y.getOptions()
      options.key.foo.should.equal(true)
      expect(options.key.bar).to.equal(undefined)
    })

    it('does not reset alias of global option', () => {
      const y = yargs('--foo a b c')
        .option('foo', {
          nargs: 2,
          alias: 'awesome-sauce'
        })
        .string('awesome-sauce')
        .demand('awesomeSauce')
        .option('bar', {
          nargs: 2,
          string: true,
          demand: true,
          global: false
        })
        .global('foo')
        .reset({
          foo: ['awesome-sauce', 'awesomeSauce']
        })
      const options = y.getOptions()

      options.key.foo.should.equal(true)
      options.string.should.include('awesome-sauce')
      Object.keys(options.demandedOptions).should.include('awesomeSauce')

      expect(options.key.bar).to.equal(undefined)
      options.string.should.not.include('bar')
      Object.keys(options.demandedOptions).should.not.include('bar')
    })

    it('should set help to global option by default', () => {
      const y = yargs('--foo')
        .help('help')
      const options = y.getOptions()
      options.local.should.not.include('help')
    })

    it('should set version to global option by default', () => {
      const y = yargs('--foo')
        .version()
      const options = y.getOptions()
      options.local.should.not.include('version')
    })

    it('should not reset usage descriptions of global options', () => {
      const y = yargs('--foo')
        .describe('bar', 'my awesome bar option')
        .describe('foo', 'my awesome foo option')
        .global('foo')
        .global('bar', false)
        .reset()
      const descriptions = y.getUsageInstance().getDescriptions()
      Object.keys(descriptions).should.include('foo')
      Object.keys(descriptions).should.not.include('bar')
    })

    it('should not reset implications of global options', () => {
      const y = yargs(['--x=33'])
        .implies({
          x: 'y'
        })
        .implies({
          z: 'w'
        })
        .global(['z'], false)
        .reset()
      const implied = y.getValidationInstance().getImplied()
      Object.keys(implied).should.include('x')
      Object.keys(implied).should.not.include('z')
    })

    it('should expose an options short-hand for declaring global options', () => {
      const y = yargs('--foo a b c')
        .option('foo', {
          nargs: 2
        })
        .option('bar', {
          nargs: 2,
          global: false
        })
        .reset()
      const options = y.getOptions()
      options.key.foo.should.equal(true)
      expect(options.key.bar).to.equal(undefined)
    })
  })

  describe('pkgConf', () => {
    it('uses values from package.json', () => {
      const argv = yargs('--foo a').pkgConf('repository').argv

      argv.foo.should.equal('a')
      argv.type.should.equal('git')
    })

    it('combines yargs defaults with package.json values', () => {
      const argv = yargs('--foo a')
        .default('b', 99)
        .pkgConf('repository')
        .argv

      argv.b.should.equal(99)
      argv.foo.should.equal('a')
      argv.type.should.equal('git')
    })

    it('should use value from package.json, if argv value is using default value', () => {
      const argv = yargs('--foo a')
        .default('b', 99)
        .pkgConf('repository')
        .default('type', 'default')
        .argv

      argv.b.should.equal(99)
      argv.foo.should.equal('a')
      argv.type.should.equal('git')
    })

    it('should apply value from config object to all aliases', () => {
      const argv = yargs('--foo a')
        .pkgConf('repository')
        .alias('type', 't')
        .alias('t', 'u')
        .argv

      argv.foo.should.equal('a')
      argv.type.should.equal('git')
      argv.t.should.equal('git')
      argv.u.should.equal('git')
    })

    it('is cool with a key not existing', () => {
      const argv = yargs('--foo a')
        .default('b', 99)
        .pkgConf('banana')
        .argv

      argv.b.should.equal(99)
      argv.foo.should.equal('a')
      expect(argv.type).to.equal(undefined)
    })

    it('allows an alternative cwd to be specified', () => {
      const argv = yargs('--foo a')
        .pkgConf('yargs', './test/fixtures')
        .argv

      argv.foo.should.equal('a')
      argv.dotNotation.should.equal(false)
    })

    it('doesn\'t mess up other pkg lookups when cwd is specified', () => {
      const r = checkOutput(() => yargs('--version')
          .pkgConf('repository', './test/fixtures')
          .version()
          .argv
        )
      const options = yargs.getOptions()

      // assert pkgConf lookup (test/fixtures/package.json)
      options.configObjects.should.deep.equal([{ type: 'svn' }])
      // assert parseArgs and guessVersion lookup (package.json)
      expect(options.configuration['dot-notation']).to.be.undefined
      r.logs[0].should.not.equal('9.9.9') // breaks when yargs gets to this version
    })

    // see https://github.com/yargs/yargs/issues/485
    it('handles an invalid package.json', () => {
      const argv = yargs('--foo a')
        .pkgConf('yargs', './test/fixtures/broken-json')
        .argv

      argv.foo.should.equal('a')
    })

    it('should apply default configurations from extended packages', () => {
      const argv = yargs().pkgConf('foo', 'test/fixtures/extends/packageA').argv

      argv.a.should.equal(80)
      argv.b.should.equals('riffiwobbles')
    })

    it('should apply extended configurations from cwd when no path is given', () => {
      const argv = yargs('', 'test/fixtures/extends/packageA').pkgConf('foo').argv

      argv.a.should.equal(80)
      argv.b.should.equals('riffiwobbles')
    })
  })

  describe('skipValidation', () => {
    it('skips validation if an option with skipValidation is present', () => {
      const argv = yargs(['--koala', '--skip'])
          .demand(1)
          .fail((msg) => {
            expect.fail()
          })
          .skipValidation(['skip', 'reallySkip'])
          .argv
      argv.koala.should.equal(true)
    })

    it('does not skip validation if no option with skipValidation is present', (done) => {
      const argv = yargs(['--koala'])
          .demand(1)
          .fail(msg => done())
          .skipValidation(['skip', 'reallySkip'])
          .argv
      argv.koala.should.equal(true)
    })

    it('allows key to be specified with option shorthand', () => {
      const argv = yargs(['--koala', '--skip'])
          .demand(1)
          .fail((msg) => {
            expect.fail()
          })
          .option('skip', {
            skipValidation: true
          })
          .argv
      argv.koala.should.equal(true)
    })

    it('allows having an option that skips validation but not skipping validation if that option is not used', () => {
      let skippedValidation = true
      yargs(['--no-skip'])
          .demand(5)
          .option('skip', {
            skipValidation: true
          })
          .fail((msg) => {
            skippedValidation = false
          })
          .argv
      expect(skippedValidation).to.equal(false)
    })
  })

  describe('.help()', () => {
    it('enables `--help` option and `help` command without arguments', () => {
      const option = checkOutput(() => yargs('--help')
          .wrap(null)
          .argv
        )
      const command = checkOutput(() => yargs('help')
          .wrap(null)
          .argv
        )
      const expected = [
        'Options:',
        '  --help     Show help  [boolean]',
        '  --version  Show version number  [boolean]',
        ''
      ]
      option.logs[0].split('\n').should.deep.equal(expected)
      command.logs[0].split('\n').should.deep.equal(expected)
    })

    it('enables `--help` option and `help` command with `true` argument', () => {
      const option = checkOutput(() => yargs('--help')
          .help(true)
          .wrap(null)
          .argv
        )
      const command = checkOutput(() => yargs('help')
          .help(true)
          .wrap(null)
          .argv
        )
      const expected = [
        'Options:',
        '  --version  Show version number  [boolean]',
        '  --help     Show help  [boolean]',
        ''
      ]
      option.logs[0].split('\n').should.deep.equal(expected)
      command.logs[0].split('\n').should.deep.equal(expected)
    })

    it('enables given string as help option and command with string argument', () => {
      const option = checkOutput(() => yargs('--info')
          .help('info')
          .wrap(null)
          .argv
        )
      const command = checkOutput(() => yargs('info')
          .help('info')
          .wrap(null)
          .argv
        )
      const helpOption = checkOutput(() => yargs('--help')
          .help('info')
          .wrap(null)
          .argv
        )
      const expected = [
        'Options:',
        '  --version  Show version number  [boolean]',
        '  --info     Show help  [boolean]',
        ''
      ]
      option.logs[0].split('\n').should.deep.equal(expected)
      command.logs[0].split('\n').should.deep.equal(expected)
      helpOption.result.should.have.property('help').and.be.true
    })

    it('enables given string as help option and command with custom description with two string arguments', () => {
      const option = checkOutput(() => yargs('--info')
          .help('info', 'Display info')
          .wrap(null)
          .argv
        )
      const command = checkOutput(() => yargs('info')
          .help('info', 'Display info')
          .wrap(null)
          .argv
        )
      const expected = [
        'Options:',
        '  --version  Show version number  [boolean]',
        '  --info     Display info  [boolean]',
        ''
      ]
      option.logs[0].split('\n').should.deep.equal(expected)
      command.logs[0].split('\n').should.deep.equal(expected)
    })

    it('enables given string as help option and command with custom description with two string arguments and `true` argument', () => {
      const option = checkOutput(() => yargs('--info')
          .help('info', 'Display info', true)
          .wrap(null)
          .argv
        )
      const command = checkOutput(() => yargs('info')
          .help('info', 'Display info', true)
          .wrap(null)
          .argv
        )
      const expected = [
        'Options:',
        '  --version  Show version number  [boolean]',
        '  --info     Display info  [boolean]',
        ''
      ]
      option.logs[0].split('\n').should.deep.equal(expected)
      command.logs[0].split('\n').should.deep.equal(expected)
    })
  })

  describe('.help() with .alias()', () => {
    it('uses multi-char (but not single-char) help alias as command', () => {
      const info = checkOutput(() => yargs('info')
          .help().alias('h', 'help').alias('h', 'info')
          .wrap(null)
          .argv
        )
      const h = checkOutput(() => yargs('h')
          .help().alias('h', 'help').alias('h', 'info')
          .wrap(null)
          .argv
        )
      info.logs[0].split('\n').should.deep.equal([
        'Options:',
        '  --version           Show version number  [boolean]',
        '  -h, --help, --info  Show help  [boolean]',
        ''
      ])
      h.result.should.have.property('_').and.deep.equal(['h'])
    })
  })

  describe('.coerce()', () => {
    it('supports string and function args (as option key and coerce function)', () => {
      const argv = yargs(['--file', path.join(__dirname, 'fixtures', 'package.json')])
        .coerce('file', arg => JSON.parse(fs.readFileSync(arg, 'utf8')))
        .argv
      expect(argv.file).to.have.property('version').and.equal('9.9.9')
    })

    it('supports object arg (as map of multiple options)', () => {
      const argv = yargs('--expand abc --range 1..3')
        .coerce({
          expand (arg) {
            return arg.split('')
          },
          range (arg) {
            const arr = arg.split('..').map(Number)
            return { begin: arr[0], end: arr[1] }
          }
        })
        .argv
      expect(argv.expand).to.deep.equal(['a', 'b', 'c'])
      expect(argv.range).to.have.property('begin').and.equal(1)
      expect(argv.range).to.have.property('end').and.equal(3)
    })

    it('supports array and function args (as option keys and coerce function)', () => {
      const argv = yargs(['--src', 'in', '--dest', 'out'])
        .coerce(['src', 'dest'], arg => path.resolve(arg))
        .argv
      argv.src.should.match(/in/).and.have.length.above(2)
      argv.dest.should.match(/out/).and.have.length.above(3)
    })

    it('allows an error to be handled by fail() handler', () => {
      let msg
      let err
      let jsonErrMessage
      yargs('--json invalid')
        .coerce('json', (arg) => {
          try {
            JSON.parse(arg)
          } catch (err) {
            jsonErrMessage = err.message
          }
          return JSON.parse(arg)
        })
        .fail((m, e) => {
          msg = m
          err = e
        })
        .argv
      expect(msg).to.equal(jsonErrMessage)
      expect(err).to.exist
    })

    it('supports an option alias', () => {
      const argv = yargs('-d 2016-08-12')
        .coerce('date', Date.parse)
        .alias('date', 'd')
        .argv
      argv.date.should.equal(1470960000000)
    })

    it('supports a global option within command', () => {
      let regex
      yargs('check --regex x')
        .global('regex')
        .coerce('regex', RegExp)
        .command('check', 'Check something', {}, (argv) => {
          regex = argv.regex
        })
        .argv
      expect(regex).to.be.an.instanceof(RegExp)
      regex.toString().should.equal('/x/')
    })

    it('is supported by .option()', () => {
      const argv = yargs('--env SHELL=/bin/bash')
        .option('env', {
          coerce (arg) {
            const arr = arg.split('=')
            return { name: arr[0], value: arr[1] || '' }
          }
        })
        .argv
      expect(argv.env).to.have.property('name').and.equal('SHELL')
      expect(argv.env).to.have.property('value').and.equal('/bin/bash')
    })

    it('supports positional and variadic args for a command', () => {
      let age
      let dates
      yargs('add 30days 2016-06-13 2016-07-18')
        .command('add <age> [dates..]', 'Testing', yargs => yargs
            .coerce('age', arg => parseInt(arg, 10) * 86400000)
            .coerce('dates', arg => arg.map(str => new Date(str))), (argv) => {
              age = argv.age
              dates = argv.dates
            })
        .argv
      expect(age).to.equal(2592000000)
      expect(dates).to.have.lengthOf(2)
      dates[0].toString().should.equal(new Date('2016-06-13').toString())
      dates[1].toString().should.equal(new Date('2016-07-18').toString())
    })

    it('returns camelcase args for a command', () => {
      let age1
      let age2
      let dates
      yargs('add 30days 2016-06-13 2016-07-18')
        .command('add <age-in-days> [dates..]', 'Testing', yargs => yargs
            .coerce('age-in-days', arg => parseInt(arg, 10) * 86400000)
            .coerce('dates', arg => arg.map(str => new Date(str))), (argv) => {
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

    it('allows an error from positional arg to be handled by fail() handler', () => {
      let msg
      let err
      yargs('throw ball')
        .command('throw <msg>', false, yargs => yargs
            .coerce('msg', (arg) => {
              throw new Error(arg)
            })
            .fail((m, e) => {
              msg = m
              err = e
            }))
        .argv
      expect(msg).to.equal('ball')
      expect(err).to.exist
    })
  })

  describe('stop parsing', () => {
    it('populates argv._ with unparsed arguments after "--"', () => {
      const argv = yargs.parse('--foo 33 --bar=99 -- --grep=foobar')
      argv.foo.should.equal(33)
      argv.bar.should.equal(99)
      argv._.length.should.equal(1)
      argv._[0].should.equal('--grep=foobar')
    })
  })

  describe('yargs context', () => {
    beforeEach(() => {
      delete require.cache[require.resolve('../')]
      yargs = require('../')
    })

    it('should begin with initial state', () => {
      const context = yargs.getContext()
      context.resets.should.equal(0)
      context.commands.should.deep.equal([])
    })

    it('should track number of resets', () => {
      const context = yargs.getContext()
      yargs.reset()
      context.resets.should.equal(1)
      yargs.reset()
      yargs.reset()
      context.resets.should.equal(3)
    })

    it('should track commands being executed', () => {
      let context
      yargs('one two')
        .command('one', 'level one', (yargs) => {
          context = yargs.getContext()
          context.commands.should.deep.equal(['one'])
          return yargs.command('two', 'level two', (yargs) => {
            context.commands.should.deep.equal(['one', 'two'])
          }, (argv) => {
            context.commands.should.deep.equal(['one', 'two'])
          })
        }, (argv) => {
          context.commands.should.deep.equal(['one'])
        })
        .argv
      context.commands.should.deep.equal([])
    })
  })

  describe('positional', () => {
    it('defaults array with no arguments to []', () => {
      const args = yargs('cmd')
        .command('cmd [foo..]', 'run the cmd', (yargs) => {
          yargs.positional('foo', {
            describe: 'foo positionals'
          })
        })
        .argv
      args.foo.should.eql([])
    })

    it('populates array with appropriate arguments', () => {
      const args = yargs('cmd /tmp/foo/bar a b')
        .command('cmd <file> [foo..]', 'run the cmd', (yargs) => {
          yargs
            .positional('file', {
              describe: 'the required bit'
            })
            .positional('foo', {
              describe: 'the variadic bit'
            })
        })
        .argv
      args.file.should.equal('/tmp/foo/bar')
      args.foo.should.eql(['a', 'b'])
    })

    it('allows a conflicting argument to be specified', (done) => {
      yargs()
        .command('cmd <hero>', 'a command', (yargs) => {
          yargs.positional('hero', {
            conflicts: 'conflicting'
          })
        }).parse('cmd batman --conflicting', (err) => {
          err.message.should.equal(
            'Arguments hero and conflicting are mutually exclusive'
          )
          return done()
        })
    })

    it('allows a default to be set', () => {
      const argv = yargs('cmd')
        .command('cmd [heroes...]', 'a command', (yargs) => {
          yargs.positional('heroes', {
            default: ['batman', 'Iron Man']
          })
        }).argv
      argv.heroes.should.eql(['batman', 'Iron Man'])
    })

    it('allows an implied argument to be specified', (done) => {
      yargs()
        .command('cmd <hero>', 'a command', (yargs) => {
          yargs.positional('hero', {
            implies: 'universe'
          })
        }).parse('cmd batman', (err) => {
          err.message.should.match(/hero -> universe/)
          return done()
        })
    })

    it('allows an alias to be provided', () => {
      const argv = yargs('cmd')
        .command('cmd [heroes...]', 'a command', (yargs) => {
          yargs.positional('heroes', {
            alias: 'do-gooders',
            default: ['batman', 'robin']
          })
        }).argv
      argv.heroes.should.eql(['batman', 'robin'])
      argv.doGooders.should.eql(['batman', 'robin'])
      argv['do-gooders'].should.eql(['batman', 'robin'])
    })

    it('allows normalize to be specified', () => {
      const argv = yargs('cmd /tmp/awesome/../ /tmp/awesome/b/../')
        .command('cmd <files...>', 'a command', (yargs) => {
          yargs.positional('files', {
            normalize: true
          })
        }).argv
      argv.files.should.eql([
        '/tmp/'.replace(/\//g, path.sep),
        '/tmp/awesome/'.replace(/\//g, path.sep)
      ])
    })

    it('allows a choices array to be specified', (done) => {
      yargs()
        .command('cmd <hero>', 'a command', (yargs) => {
          yargs.positional('hero', {
            choices: ['batman', 'Iron Man', 'robin']
          })
        }).parse('cmd joker', (err) => {
          err.message.should.match(
            /Argument: hero, Given: "joker", Choices: "batman"/
          )
          return done()
        })
    })

    it('allows a coerce method to be provided', () => {
      const argv = yargs('cmd batman')
        .command('cmd <hero>', 'a command', (yargs) => {
          yargs.positional('hero', {
            coerce: function (arg) {
              return arg.toUpperCase()
            },
            alias: 'do-gooder'
          })
        }).argv
      argv.hero.should.equal('BATMAN')
      argv.doGooder.should.equal('BATMAN')
    })

    it('allows a boolean type to be specified', () => {
      const argv = yargs('cmd false')
        .command('cmd [run]', 'a command', (yargs) => {
          yargs.positional('run', {
            type: 'boolean'
          })
        }).argv
      argv.run.should.equal(false)
    })

    it('allows a number type to be specified', () => {
      const argv = yargs('cmd nan')
        .command('cmd [count]', 'a command', (yargs) => {
          yargs.positional('count', {
            type: 'number'
          })
        }).argv
      isNaN(argv.count).should.equal(true)
    })

    it('allows a string type to be specified', () => {
      const argv = yargs('cmd 33')
        .command('cmd [str]', 'a command', (yargs) => {
          yargs.positional('str', {
            type: 'string'
          })
        }).argv
      argv.str.should.equal('33')
    })

    it('allows positional arguments for subcommands to be configured', () => {
      const argv = yargs('cmd subcommand 33')
        .command('cmd', 'a command', (yargs) => {
          yargs.command('subcommand [str]', 'a subcommand', (yargs) => {
            yargs.positional('str', {
              type: 'string'
            })
          })
        }).argv

      argv.str.should.equal('33')
    })

    it("can only be used as part of a command's builder function", () => {
      expect(() => {
        yargs('foo')
          .positional('foo', {
            describe: 'I should not work'
          })
      }).to.throw(/\.positional\(\) can only be called/)
    })
  })
})
