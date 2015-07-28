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
    it('throws an execption when a failure occurs, if exitProcess is set to false', function () {
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
        .strict()
        .exitProcess(false)  // defaults to true.
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
        config: []
      }

      expect(y.getOptions()).to.deep.equal(emptyOptions)
      expect(y.getUsageInstance().getDescriptions()).to.deep.equal({})
      expect(y.getValidationInstance().getImplied()).to.deep.equal({})
      expect(y.getExitProcess()).to.equal(true)
      expect(y.getStrict()).to.equal(false)
      expect(y.getDemanded()).to.deep.equal({})
      expect(y.getCommandHandlers()).to.deep.equal({})
    })
  })

  describe('command', function () {
    it('allows a function to be associated with a command', function (done) {
      yargs(['blerg'])
        .command('blerg', 'handle blerg things', function () {
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
      yargs.terminalWidth().should.be.gt(0)
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
})
