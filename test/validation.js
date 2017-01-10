/* global describe, it, beforeEach */

var checkUsage = require('./helpers/utils').checkOutput
var expect = require('chai').expect
var yargs = require('../')

require('chai').should()

describe('validation tests', function () {
  beforeEach(function () {
    yargs.reset()
  })

  describe('implies', function () {
    it("fails if '_' populated, and implied argument not set", function (done) {
      yargs(['cat'])
        .implies({
          1: 'foo' // 1 arg in _ means --foo is required
        })
        .fail(function (msg) {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })

    it("fails if key implies values in '_', but '_' is not populated", function (done) {
      yargs(['--foo'])
        .boolean('foo')
        .implies({
          'foo': 1 // --foo means 1 arg in _ is required
        })
        .fail(function (msg) {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })

    it("fails if --no-foo's implied argument is not set", function (done) {
      yargs([])
        .implies({
          '--no-bar': 'foo' // when --bar is not given, --foo is required
        })
        .fail(function (msg) {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })

    it('fails if a key is set, along with a key that it implies should not be set', function (done) {
      yargs(['--bar', '--foo'])
        .implies({
          'bar': '--no-foo' // --bar means --foo cannot be given
        })
        .fail(function (msg) {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })

    it('fails if implied key (with "no" in the name) is not set', function () {
      var failCalled = false
      yargs('--bar')
        .implies({
          'bar': 'noFoo' // --bar means --noFoo (or --no-foo with boolean-negation disabled) is required
                         // note that this has nothing to do with --foo
        })
        .fail(function (msg) {
          failCalled = true
          msg.should.match(/Implications failed/)
        })
        .argv
      failCalled.should.be.true
    })

    it('doesn\'t fail if implied key (with "no" in the name) is set', function () {
      var failCalled = false
      const argv = yargs('--bar --noFoo')
        .implies({
          'bar': 'noFoo' // --bar means --noFoo (or --no-foo with boolean-negation disabled) is required
                         // note that this has nothing to do with --foo
        })
        .fail(function (msg) {
          failCalled = true
        })
        .argv
      failCalled.should.be.false
      expect(argv.bar).to.be.true
      expect(argv.noFoo).to.be.true
      expect(argv.foo).to.not.exist
    })

    it('fails if implied key (with "no" in the name) is given when it should not', function () {
      var failCalled = false
      yargs('--bar --noFoo')
        .implies({
          'bar': '--no-noFoo' // --bar means --noFoo (or --no-foo with boolean-negation disabled) cannot be given
                              // note that this has nothing to do with --foo
        })
        .fail(function (msg) {
          failCalled = true
          msg.should.match(/Implications failed/)
        })
        .argv
      failCalled.should.be.true
    })

    it('doesn\'t fail if implied key (with "no" in the name) that should not be given is not set', function () {
      var failCalled = false
      const argv = yargs('--bar')
        .implies({
          'bar': '--no-noFoo' // --bar means --noFoo (or --no-foo with boolean-negation disabled) cannot be given
                              // note that this has nothing to do with --foo
        })
        .fail(function (msg) {
          failCalled = true
        })
        .argv
      failCalled.should.be.false
      expect(argv.bar).to.be.true
      expect(argv.noFoo).to.not.exist
      expect(argv.foo).to.not.exist
    })
  })

  describe('conflicts', function () {
    it('fails if both arguments are supplied', function (done) {
      yargs(['-f', '-b'])
          .conflicts('f', 'b')
          .fail(function (msg) {
            msg.should.equal('Arguments f and b are mutually exclusive')
            return done()
          })
          .argv
    })

    it('should not fail if no conflicting arguments are provided', function () {
      yargs(['-b', '-c'])
        .conflicts('f', 'b')
        .fail(function (msg) {
          expect.fail()
        })
        .argv
    })

    it('allows an object to be provided defining conflicting option pairs', function (done) {
      yargs(['-t', '-s'])
        .conflicts({
          'c': 'a',
          's': 't'
        })
        .fail(function (msg) {
          msg.should.equal('Arguments s and t are mutually exclusive')
          return done()
        })
        .argv
    })

    it('takes into account aliases when applying conflicts logic', function (done) {
      yargs(['-t', '-c'])
        .conflicts({
          'c': 'a',
          's': 't'
        })
        .alias('c', 's')
        .fail(function (msg) {
          msg.should.equal('Arguments s and t are mutually exclusive')
          return done()
        })
        .argv
    })
  })

  describe('demand', function () {
    it('fails with standard error message if msg is not defined', function (done) {
      yargs([])
        .demand(1)
        .fail(function (msg) {
          msg.should.equal('Not enough non-option arguments: got 0, need at least 1')
          return done()
        })
        .argv
    })

    it('fails in strict mode with invalid command', function (done) {
      yargs(['koala'])
        .command('wombat', 'wombat burrows')
        .command('kangaroo', 'kangaroo handlers')
        .demand(1)
        .strict()
        .fail(function (msg) {
          msg.should.equal('Unknown argument: koala')
          return done()
        })
        .argv
    })

    it('does not fail in strict mode when no commands configured', function () {
      var argv = yargs('koala')
        .demand(1)
        .strict()
        .fail(function (msg) {
          expect.fail()
        })
        .argv
      argv._[0].should.equal('koala')
    })

    it('fails when a required argument is missing', function (done) {
      yargs('-w 10 marsupial')
        .demand(1, ['w', 'b'])
        .fail(function (msg) {
          msg.should.equal('Missing required argument: b')
          return done()
        })
        .argv
    })

    it('fails when required arguments are present, but a command is missing', function (done) {
      yargs('-w 10 -m wombat')
        .demand(1, ['w', 'm'])
        .fail(function (msg) {
          msg.should.equal('Not enough non-option arguments: got 0, need at least 1')
          return done()
        })
        .argv
    })

    it('fails without a message if msg is null', function (done) {
      yargs([])
        .demand(1, null)
        .fail(function (msg) {
          expect(msg).to.equal(null)
          return done()
        })
        .argv
    })

    // address regression in: https://github.com/yargs/yargs/pull/740
    it('custom failure message should be printed for both min and max constraints', function (done) {
      yargs(['foo'])
        .demand(0, 0, 'hey! give me a custom exit message')
        .fail(function (msg) {
          expect(msg).to.equal('hey! give me a custom exit message')
          return done()
        })
        .argv
    })

    it('interprets min relative to command', function () {
      var failureMsg
      yargs('lint')
        .command('lint', 'Lint a file', function (yargs) {
          yargs.demand(1).fail(function (msg) {
            failureMsg = msg
          })
        })
        .argv
      expect(failureMsg).to.equal('Not enough non-option arguments: got 0, need at least 1')
    })

    it('interprets max relative to command', function () {
      var failureMsg
      yargs('lint one.js two.js')
        .command('lint', 'Lint a file', function (yargs) {
          yargs.demand(0, 1).fail(function (msg) {
            failureMsg = msg
          })
        })
        .argv
      expect(failureMsg).to.equal('Too many non-option arguments: got 2, maximum of 1')
    })
  })

  describe('choices', function () {
    it('fails with one invalid value', function (done) {
      yargs(['--state', 'denial'])
        .choices('state', ['happy', 'sad', 'hungry'])
        .fail(function (msg) {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: state, Given: "denial", Choices: "happy", "sad", "hungry"'
          ])
          return done()
        })
        .argv
    })

    it('fails with one valid and one invalid value', function (done) {
      yargs(['--characters', 'susie', '--characters', 'linus'])
        .choices('characters', ['calvin', 'hobbes', 'susie', 'moe'])
        .fail(function (msg) {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: characters, Given: "linus", Choices: "calvin", "hobbes", "susie", "moe"'
          ])
          return done()
        })
        .argv
    })

    it('fails with multiple invalid values for same argument', function (done) {
      yargs(['--category', 'comedy', '--category', 'drama'])
        .choices('category', ['animal', 'vegetable', 'mineral'])
        .fail(function (msg) {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: category, Given: "comedy", "drama", Choices: "animal", "vegetable", "mineral"'
          ])
          return done()
        })
        .argv
    })

    it('fails with case-insensitive value', function (done) {
      yargs(['--env', 'DEV'])
        .choices('env', ['dev', 'prd'])
        .fail(function (msg) {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: env, Given: "DEV", Choices: "dev", "prd"'
          ])
          return done()
        })
        .argv
    })

    it('fails with multiple invalid arguments', function (done) {
      yargs(['--system', 'osx', '--arch', '64'])
        .choices('system', ['linux', 'mac', 'windows'])
        .choices('arch', ['x86', 'x64', 'arm'])
        .fail(function (msg) {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: system, Given: "osx", Choices: "linux", "mac", "windows"',
            '  Argument: arch, Given: 64, Choices: "x86", "x64", "arm"'
          ])
          return done()
        })
        .argv
    })
  })

  describe('config', function () {
    it('should raise an appropriate error if JSON file is not found', function (done) {
      yargs(['--settings', 'fake.json', '--foo', 'bar'])
        .alias('z', 'zoom')
        .config('settings')
        .fail(function (msg) {
          msg.should.eql('Invalid JSON config file: fake.json')
          return done()
        })
        .argv
    })

    // see: https://github.com/yargs/yargs/issues/172
    it('should not raise an exception if config file is set as default argument value', function () {
      var fail = false
      yargs([])
        .option('config', {
          default: 'foo.json'
        })
        .config('config')
        .fail(function () {
          fail = true
        })
        .argv

      fail.should.equal(false)
    })

    it('should be displayed in the help message', function () {
      var r = checkUsage(function () {
        return yargs(['--help'])
          .config('settings')
          .help('help')
          .wrap(null)
          .argv
      })
      r.should.have.property('logs').with.length(1)
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --settings  Path to JSON config file',
        '  --help      Show help  [boolean]',
        ''
      ])
    })

    it('should be displayed in the help message with its default name', function () {
      var checkUsage = require('./helpers/utils').checkOutput
      var r = checkUsage(function () {
        return yargs(['--help'])
            .config()
            .help('help')
            .wrap(null)
            .argv
      })
      r.should.have.property('logs').with.length(1)
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --config  Path to JSON config file',
        '  --help    Show help  [boolean]',
        ''
      ])
    })

    it('should allow help message to be overridden', function () {
      var checkUsage = require('./helpers/utils').checkOutput
      var r = checkUsage(function () {
        return yargs(['--help'])
          .config('settings', 'pork chop sandwiches')
          .help('help')
          .wrap(null)
          .argv
      })
      r.should.have.property('logs').with.length(1)
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --settings  pork chop sandwiches',
        '  --help      Show help  [boolean]',
        ''
      ])
    })

    it('outputs an error returned by the parsing function', function () {
      var checkUsage = require('./helpers/utils').checkOutput
      var r = checkUsage(function () {
        return yargs(['--settings=./package.json'])
          .config('settings', 'path to config file', function (configPath) {
            return Error('someone set us up the bomb')
          })
          .help('help')
          .wrap(null)
          .argv
      })

      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --settings  path to config file',
        '  --help      Show help  [boolean]',
        'someone set us up the bomb'
      ])
    })

    it('outputs an error if thrown by the parsing function', function () {
      var checkUsage = require('./helpers/utils').checkOutput
      var r = checkUsage(function () {
        return yargs(['--settings=./package.json'])
          .config('settings', 'path to config file', function (configPath) {
            throw Error('someone set us up the bomb')
          })
          .help('help')
          .wrap(null)
          .argv
      })

      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --settings  path to config file',
        '  --help      Show help  [boolean]',
        'someone set us up the bomb'
      ])
    })
  })

  describe('defaults', function () {
    // See https://github.com/chevex/yargs/issues/31
    it('should not fail when demanded options with defaults are missing', function () {
      yargs()
        .fail(function (msg) {
          throw new Error(msg)
        })
        .option('some-option', {
          describe: 'some option',
          demand: true,
          default: 88
        })
        .strict()
        .parse([])
    })
  })

  describe('strict mode', function () {
    it('does not fail when command with subcommands called', function () {
      yargs('one')
        .command('one', 'level one', function (yargs) {
          return yargs
            .command('twoA', 'level two A')
            .command('twoB', 'level two B')
            .strict()
            .fail(function (msg) {
              expect.fail()
            })
        }, function (argv) {
          argv._[0].should.equal('one')
        })
        .argv
    })
  })

  describe('demandOption', function () {
    it('allows an array of options to be demanded', function (done) {
      yargs('-a 10 marsupial')
        .demandOption(['a', 'b'])
        .fail(function (msg) {
          msg.should.equal('Missing required argument: b')
          return done()
        })
        .argv
    })

    it('allows demandOption in option shorthand', function (done) {
      yargs('-a 10 marsupial')
        .option('c', {
          demandOption: true
        })
        .fail(function (msg) {
          msg.should.equal('Missing required argument: c')
          return done()
        })
        .argv
    })
  })

  describe('demandCommand', function () {
    it('should return a custom failure message when too many non-hyphenated arguments are found after a demand count', function () {
      var r = checkUsage(function () {
        return yargs(['src', 'dest'])
          .usage('Usage: $0 [x] [y] [z] {OPTIONS} <src> <dest> [extra_files...]')
          .demandCommand(0, 1, 'src and dest files are both required', 'too many arguments are provided')
          .wrap(null)
          .argv
      })
      r.should.have.property('result')
      r.should.have.property('logs').with.length(0)
      r.should.have.property('exit').and.be.ok
      r.result.should.have.property('_').and.deep.equal(['src', 'dest'])
      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Usage: ./usage [x] [y] [z] {OPTIONS} <src> <dest> [extra_files...]',
        'too many arguments are provided'
      ])
    })

    // see: https://github.com/yargs/yargs/pull/438
    it('allows a custom min message to be provided', function (done) {
      yargs('-a 10 marsupial')
        .demandCommand(2, 'totes got $0 totes expected $1')
        .fail(function (msg) {
          msg.should.equal('totes got 1 totes expected 2')
          return done()
        })
        .argv
    })

    // see: https://github.com/yargs/yargs/pull/438
    it('allows a custom min and max message to be provided', function (done) {
      yargs('-a 10 marsupial mammal bro')
        .demandCommand(1, 2, 'totes too few, got $0 totes expected $1', 'totes too many, got $0 totes expected $1')
        .fail(function (msg) {
          msg.should.equal('totes too many, got 3 totes expected 2')
          return done()
        })
        .argv
    })
  })
})
