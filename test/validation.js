'use strict'
/* global describe, it, beforeEach */

const checkUsage = require('./helpers/utils').checkOutput
const expect = require('chai').expect
const yargs = require('../')

require('chai').should()

describe('validation tests', () => {
  beforeEach(() => {
    yargs.reset()
  })

  describe('implies', () => {
    it("fails if '_' populated, and implied argument not set", (done) => {
      yargs(['cat'])
        .implies({
          1: 'foo' // 1 arg in _ means --foo is required
        })
        .fail((msg) => {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })

    it("fails if key implies values in '_', but '_' is not populated", (done) => {
      yargs(['--foo'])
        .boolean('foo')
        .implies({
          'foo': 1 // --foo means 1 arg in _ is required
        })
        .fail((msg) => {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })

    it('fails if either implied argument is not set and displays only failed', (done) => {
      yargs(['-f', '-b'])
          .implies('f', ['b', 'c'])
          .fail((msg1) => {
            yargs(['-f', '-c'])
                .implies('f', ['b', 'c'])
                .fail((msg2) => {
                  msg1.should.match(/f -> c/)
                  msg1.should.not.match(/f -> b/)
                  msg2.should.match(/f -> b/)
                  msg2.should.not.match(/f -> c/)
                  return done()
                })
                .argv
          })
          .argv
    })

    it("fails if --no-foo's implied argument is not set", (done) => {
      yargs([])
        .implies({
          '--no-bar': 'foo' // when --bar is not given, --foo is required
        })
        .fail((msg) => {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })

    it('fails if a key is set, along with a key that it implies should not be set', (done) => {
      yargs(['--bar', '--foo'])
        .implies({
          'bar': '--no-foo' // --bar means --foo cannot be given
        })
        .fail((msg) => {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })

    it('fails if implied key (with "no" in the name) is not set', () => {
      let failCalled = false
      yargs('--bar')
        .implies({
          'bar': 'noFoo' // --bar means --noFoo (or --no-foo with boolean-negation disabled) is required
                         // note that this has nothing to do with --foo
        })
        .fail((msg) => {
          failCalled = true
          msg.should.match(/Implications failed/)
        })
        .argv
      failCalled.should.be.true
    })

    it('doesn\'t fail if implied key (with "no" in the name) is set', () => {
      let failCalled = false
      const argv = yargs('--bar --noFoo')
        .implies({
          'bar': 'noFoo' // --bar means --noFoo (or --no-foo with boolean-negation disabled) is required
                         // note that this has nothing to do with --foo
        })
        .fail((msg) => {
          failCalled = true
        })
        .argv
      failCalled.should.be.false
      expect(argv.bar).to.be.true
      expect(argv.noFoo).to.be.true
      expect(argv.foo).to.not.exist
    })

    it('fails if implied key (with "no" in the name) is given when it should not', () => {
      let failCalled = false
      yargs('--bar --noFoo')
        .implies({
          'bar': '--no-noFoo' // --bar means --noFoo (or --no-foo with boolean-negation disabled) cannot be given
                              // note that this has nothing to do with --foo
        })
        .fail((msg) => {
          failCalled = true
          msg.should.match(/Implications failed/)
        })
        .argv
      failCalled.should.be.true
    })

    it('doesn\'t fail if implied key (with "no" in the name) that should not be given is not set', () => {
      let failCalled = false
      const argv = yargs('--bar')
        .implies({
          'bar': '--no-noFoo' // --bar means --noFoo (or --no-foo with boolean-negation disabled) cannot be given
                              // note that this has nothing to do with --foo
        })
        .fail((msg) => {
          failCalled = true
        })
        .argv
      failCalled.should.be.false
      expect(argv.bar).to.be.true
      expect(argv.noFoo).to.not.exist
      expect(argv.foo).to.not.exist
    })

    it('allows key to be specified with option shorthand', (done) => {
      yargs('--bar')
        .option('bar', {
          implies: 'foo'
        })
        .fail((msg) => {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })
  })

  describe('conflicts', () => {
    it('fails if both arguments are supplied', (done) => {
      yargs(['-f', '-b'])
          .conflicts('f', 'b')
          .fail((msg) => {
            msg.should.equal('Arguments f and b are mutually exclusive')
            return done()
          })
          .argv
    })

    it('fails if argument is supplied along with either conflicting argument', (done) => {
      yargs(['-f', '-b'])
          .conflicts('f', ['b', 'c'])
          .fail((msg1) => {
            yargs(['-f', '-c'])
                .conflicts('f', ['b', 'c'])
                .fail((msg2) => {
                  msg1.should.equal('Arguments f and b are mutually exclusive')
                  msg2.should.equal('Arguments f and c are mutually exclusive')
                  return done()
                })
                .argv
          })
          .argv
    })

    it('should not fail if no conflicting arguments are provided', () => {
      yargs(['-b', '-c'])
        .conflicts('f', ['b', 'c'])
        .fail((msg) => {
          expect.fail()
        })
        .argv
    })

    it('should not fail if argument with conflict is provided, but not the argument it conflicts with', () => {
      yargs(['command', '-f', '-c'])
        .command('command')
        .option('f', {
          describe: 'a foo'
        })
        .option('b', {
          describe: 'a bar'
        })
        .conflicts('f', 'b')
        .fail((msg) => {
          expect.fail()
        })
        .argv
    })

    it('should not fail if conflicting argument is provided, without argument with conflict', () => {
      yargs(['command', '-b', '-c'])
          .command('command')
          .option('f', {
            describe: 'a foo'
          })
          .option('b', {
            describe: 'a bar'
          })
          .conflicts('f', 'b')
          .fail((msg) => {
            expect.fail()
          })
          .argv
    })

    it('allows an object to be provided defining conflicting option pairs', (done) => {
      yargs(['-t', '-s'])
        .conflicts({
          'c': 'a',
          's': 't'
        })
        .fail((msg) => {
          msg.should.equal('Arguments s and t are mutually exclusive')
          return done()
        })
        .argv
    })

    it('takes into account aliases when applying conflicts logic', (done) => {
      yargs(['-t', '-c'])
        .conflicts({
          'c': 'a',
          's': 't'
        })
        .alias('c', 's')
        .fail((msg) => {
          msg.should.equal('Arguments s and t are mutually exclusive')
          return done()
        })
        .argv
    })

    it('allows key to be specified with option shorthand', (done) => {
      yargs(['-f', '-b'])
          .option('f', {
            conflicts: 'b'
          })
          .fail((msg) => {
            msg.should.equal('Arguments f and b are mutually exclusive')
            return done()
          })
          .argv
    })

    it('should fail if alias of conflicting argument is provided', (done) => {
      yargs(['-f', '--batman=99'])
        .conflicts('f', 'b')
        .alias('b', 'batman')
        .fail((msg) => {
          msg.should.equal('Arguments f and b are mutually exclusive')
          return done()
        })
        .argv
    })

    it('should fail if alias of argument with conflict is provided', (done) => {
      yargs(['--foo', '-b'])
        .conflicts('f', 'b')
        .alias('foo', 'f')
        .fail((msg) => {
          msg.should.equal('Arguments f and b are mutually exclusive')
          return done()
        })
        .argv
    })
  })

  describe('demand', () => {
    it('fails with standard error message if msg is not defined', (done) => {
      yargs([])
        .demand(1)
        .fail((msg) => {
          msg.should.equal('Not enough non-option arguments: got 0, need at least 1')
          return done()
        })
        .argv
    })

    it('fails in strict mode with invalid command', (done) => {
      yargs(['koala'])
        .command('wombat', 'wombat burrows')
        .command('kangaroo', 'kangaroo handlers')
        .demand(1)
        .strict()
        .fail((msg) => {
          msg.should.equal('Unknown argument: koala')
          return done()
        })
        .argv
    })

    it('does not fail in strict mode when no commands configured', () => {
      const argv = yargs('koala')
        .demand(1)
        .strict()
        .fail((msg) => {
          expect.fail()
        })
        .argv
      argv._[0].should.equal('koala')
    })

    // addresses: https://github.com/yargs/yargs/issues/791
    it('should recognize context variables in strict mode', (done) => {
      yargs()
        .command('foo <y>')
        .strict()
        .parse('foo 99', {x: 33}, (err, argv, output) => {
          expect(err).to.equal(null)
          expect(output).to.equal('')
          argv.y.should.equal(99)
          argv.x.should.equal(33)
          argv._.should.include('foo')
          return done()
        })
    })

    // addresses: https://github.com/yargs/yargs/issues/791
    it('should recognize context variables in strict mode, when running sub-commands', (done) => {
      yargs()
        .command('request', 'request command', (yargs) => {
          yargs
            .command('get', 'sub-command')
            .option('y', {
              describe: 'y inner option'
            })
        })
        .strict()
        .parse('request get --y=22', {x: 33}, (err, argv, output) => {
          expect(err).to.equal(null)
          expect(output).to.equal('')
          argv.y.should.equal(22)
          argv.x.should.equal(33)
          argv._.should.include('request')
          argv._.should.include('get')
          return done()
        })
    })

    it('fails when a required argument is missing', (done) => {
      yargs('-w 10 marsupial')
        .demand(1, ['w', 'b'])
        .fail((msg) => {
          msg.should.equal('Missing required argument: b')
          return done()
        })
        .argv
    })

    it('fails when a required argument of type number is missing', (done) => {
      yargs('-w')
        .option('w', {type: 'number', requiresArg: true})
        .fail((msg) => {
          msg.should.equal('Missing argument value: w')
          return done()
        })
        .argv
    })

    it('fails when a required argument of type string is missing', (done) => {
      yargs('-w')
        .option('w', {type: 'string', requiresArg: true})
        .fail((msg) => {
          msg.should.equal('Missing argument value: w')
          return done()
        })
        .argv
    })

    it('fails when a required argument of type boolean is missing', (done) => {
      yargs('-w')
        .option('w', {type: 'boolean', requiresArg: true})
        .fail((msg) => {
          msg.should.equal('Missing argument value: w')
          return done()
        })
        .argv
    })

    it('fails when a required argument of type array is missing', (done) => {
      yargs('-w')
        .option('w', {type: 'array', requiresArg: true})
        .fail((msg) => {
          msg.should.equal('Missing argument value: w')
          return done()
        })
        .argv
    })

    it('fails when required arguments are present, but a command is missing', (done) => {
      yargs('-w 10 -m wombat')
        .demand(1, ['w', 'm'])
        .fail((msg) => {
          msg.should.equal('Not enough non-option arguments: got 0, need at least 1')
          return done()
        })
        .argv
    })

    it('fails without a message if msg is null', (done) => {
      yargs([])
        .demand(1, null)
        .fail((msg) => {
          expect(msg).to.equal(null)
          return done()
        })
        .argv
    })

    // address regression in: https://github.com/yargs/yargs/pull/740
    it('custom failure message should be printed for both min and max constraints', (done) => {
      yargs(['foo'])
        .demand(0, 0, 'hey! give me a custom exit message')
        .fail((msg) => {
          expect(msg).to.equal('hey! give me a custom exit message')
          return done()
        })
        .argv
    })

    it('interprets min relative to command', () => {
      let failureMsg
      yargs('lint')
        .command('lint', 'Lint a file', (yargs) => {
          yargs.demand(1).fail((msg) => {
            failureMsg = msg
          })
        })
        .argv
      expect(failureMsg).to.equal('Not enough non-option arguments: got 0, need at least 1')
    })

    it('interprets max relative to command', () => {
      let failureMsg
      yargs('lint one.js two.js')
        .command('lint', 'Lint a file', (yargs) => {
          yargs.demand(0, 1).fail((msg) => {
            failureMsg = msg
          })
        })
        .argv
      expect(failureMsg).to.equal('Too many non-option arguments: got 2, maximum of 1')
    })
  })

  describe('choices', () => {
    it('fails with one invalid value', (done) => {
      yargs(['--state', 'denial'])
        .choices('state', ['happy', 'sad', 'hungry'])
        .fail((msg) => {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: state, Given: "denial", Choices: "happy", "sad", "hungry"'
          ])
          return done()
        })
        .argv
    })

    it('fails with one valid and one invalid value', (done) => {
      yargs(['--characters', 'susie', '--characters', 'linus'])
        .choices('characters', ['calvin', 'hobbes', 'susie', 'moe'])
        .fail((msg) => {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: characters, Given: "linus", Choices: "calvin", "hobbes", "susie", "moe"'
          ])
          return done()
        })
        .argv
    })

    it('fails with multiple invalid values for same argument', (done) => {
      yargs(['--category', 'comedy', '--category', 'drama'])
        .choices('category', ['animal', 'vegetable', 'mineral'])
        .fail((msg) => {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: category, Given: "comedy", "drama", Choices: "animal", "vegetable", "mineral"'
          ])
          return done()
        })
        .argv
    })

    it('fails with case-insensitive value', (done) => {
      yargs(['--env', 'DEV'])
        .choices('env', ['dev', 'prd'])
        .fail((msg) => {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: env, Given: "DEV", Choices: "dev", "prd"'
          ])
          return done()
        })
        .argv
    })

    it('fails with multiple invalid arguments', (done) => {
      yargs(['--system', 'osx', '--arch', '64'])
        .choices('system', ['linux', 'mac', 'windows'])
        .choices('arch', ['x86', 'x64', 'arm'])
        .fail((msg) => {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: system, Given: "osx", Choices: "linux", "mac", "windows"',
            '  Argument: arch, Given: 64, Choices: "x86", "x64", "arm"'
          ])
          return done()
        })
        .argv
    })

    // addresses: https://github.com/yargs/yargs/issues/849
    it('succeeds when demandOption is true and valid choice is provided', (done) => {
      yargs('one -a 10 marsupial')
        .command('one', 'level one', (yargs) => {
          yargs
            .options({
              'a': {
                demandOption: true,
                choices: [10, 20]
              }
            })
        }, (argv) => {
          argv._[0].should.equal('one')
          argv.a.should.equal(10)
          return done()
        })
        .fail((msg) => {
          expect.fail()
        })
        .argv
    })

    // addresses: https://github.com/yargs/yargs/issues/849
    it('fails when demandOption is true and choice is not provided', (done) => {
      yargs('one -a 10 marsupial')
        .command('one', 'level one', (yargs) => {
          yargs
            .options({
              'c': {
                choices: ['1', '2']
              }
            })
            .demandOption('c')
        }, (argv) => {
          expect.fail()
        })
        .fail((msg) => {
          msg.should.equal('Missing required argument: c')
          return done()
        })
        .argv
    })

    // addresses: https://github.com/yargs/yargs/issues/849
    it('succeeds when demandOption is false and no choice is provided', () => {
      yargs('one')
        .command('one', 'level one', (yargs) => {
          yargs
            .options({
              'a': {
                demandOption: false,
                choices: [10, 20]
              }
            })
        }, (argv) => {
          argv._[0].should.equal('one')
        })
        .fail((msg) => {
          expect.fail()
        })
        .argv
    })

    // addresses: https://github.com/yargs/yargs/issues/849
    it('succeeds when demandOption is not provided and no choice is provided', () => {
      yargs('one')
        .command('one', 'level one', (yargs) => {
          yargs
            .options({
              'a': {
                choices: [10, 20]
              }
            })
        }, (argv) => {
          argv._[0].should.equal('one')
        })
        .fail((msg) => {
          expect.fail()
        })
        .argv
    })
  })

  describe('config', () => {
    it('should raise an appropriate error if JSON file is not found', (done) => {
      yargs(['--settings', 'fake.json', '--foo', 'bar'])
        .alias('z', 'zoom')
        .config('settings')
        .fail((msg) => {
          msg.should.eql('Invalid JSON config file: fake.json')
          return done()
        })
        .argv
    })

    // see: https://github.com/yargs/yargs/issues/172
    it('should not raise an exception if config file is set as default argument value', () => {
      let fail = false
      yargs([])
        .option('config', {
          default: 'foo.json'
        })
        .config('config')
        .fail(() => {
          fail = true
        })
        .argv

      fail.should.equal(false)
    })

    it('should be displayed in the help message', () => {
      const r = checkUsage(() => yargs(['--help'])
          .config('settings')
          .help('help')
          .version(false)
          .wrap(null)
          .argv
        )
      r.should.have.property('logs').with.length(1)
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --settings  Path to JSON config file',
        '  --help      Show help  [boolean]',
        ''
      ])
    })

    it('should be displayed in the help message with its default name', () => {
      const checkUsage = require('./helpers/utils').checkOutput
      const r = checkUsage(() => yargs(['--help'])
            .config()
            .help('help')
            .version(false)
            .wrap(null)
            .argv
          )
      r.should.have.property('logs').with.length(1)
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --config  Path to JSON config file',
        '  --help    Show help  [boolean]',
        ''
      ])
    })

    it('should allow help message to be overridden', () => {
      const checkUsage = require('./helpers/utils').checkOutput
      const r = checkUsage(() => yargs(['--help'])
          .config('settings', 'pork chop sandwiches')
          .help('help')
          .version(false)
          .wrap(null)
          .argv
        )
      r.should.have.property('logs').with.length(1)
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --settings  pork chop sandwiches',
        '  --help      Show help  [boolean]',
        ''
      ])
    })

    it('outputs an error returned by the parsing function', () => {
      const checkUsage = require('./helpers/utils').checkOutput
      const r = checkUsage(() => yargs(['--settings=./package.json'])
          .config('settings', 'path to config file', configPath => Error('someone set us up the bomb'))
          .help('help')
          .wrap(null)
          .argv
        )

      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --version   Show version number  [boolean]',
        '  --settings  path to config file',
        '  --help      Show help  [boolean]',
        'someone set us up the bomb'
      ])
    })

    it('outputs an error if thrown by the parsing function', () => {
      const checkUsage = require('./helpers/utils').checkOutput
      const r = checkUsage(() => yargs(['--settings=./package.json'])
          .config('settings', 'path to config file', (configPath) => {
            throw Error('someone set us up the bomb')
          })
          .wrap(null)
          .argv
        )

      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --help      Show help  [boolean]',
        '  --version   Show version number  [boolean]',
        '  --settings  path to config file',
        'someone set us up the bomb'
      ])
    })
  })

  describe('defaults', () => {
    // See https://github.com/chevex/yargs/issues/31
    it('should not fail when demanded options with defaults are missing', () => {
      yargs()
        .fail((msg) => {
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

  describe('strict mode', () => {
    it('does not fail when command with subcommands called', () => {
      yargs('one')
        .command('one', 'level one', yargs => yargs
            .command('twoA', 'level two A')
            .command('twoB', 'level two B')
            .strict()
            .fail((msg) => {
              expect.fail()
            }), (argv) => {
              argv._[0].should.equal('one')
            })
        .argv
    })

    it('does not fail for hidden options', () => {
      const args = yargs('--foo hey')
        .strict()
        .option('foo', {boolean: true, describe: false})
        .fail((msg) => {
          expect.fail()
        })
        .argv
      args.foo.should.equal(true)
    })

    it('does not fail if an alias is provided, rather than option itself', () => {
      const args = yargs('--cat hey')
        .strict()
        .option('foo', {boolean: true, describe: false})
        .alias('foo', 'bar')
        .alias('bar', 'cat')
        .fail((msg) => {
          expect.fail()
        })
        .argv
      args.cat.should.equal(true)
      args.foo.should.equal(true)
      args.bar.should.equal(true)
    })
  })

  describe('demandOption', () => {
    it('allows an array of options to be demanded', (done) => {
      yargs('-a 10 marsupial')
        .demandOption(['a', 'b'])
        .fail((msg) => {
          msg.should.equal('Missing required argument: b')
          return done()
        })
        .argv
    })

    it('allows demandOption in option shorthand', (done) => {
      yargs('-a 10 marsupial')
        .option('c', {
          demandOption: true
        })
        .fail((msg) => {
          msg.should.equal('Missing required argument: c')
          return done()
        })
        .argv
    })
  })

  describe('demandCommand', () => {
    it('should return a custom failure message when too many non-hyphenated arguments are found after a demand count', () => {
      const r = checkUsage(() => yargs(['src', 'dest'])
          .usage('Usage: $0 [x] [y] [z] {OPTIONS} <src> <dest> [extra_files...]')
          .demandCommand(0, 1, 'src and dest files are both required', 'too many arguments are provided')
          .wrap(null)
          .help(false)
          .version(false)
          .argv
        )
      r.should.have.property('result')
      r.should.have.property('logs').with.length(0)
      r.should.have.property('exit').and.be.ok
      r.result.should.have.property('_').and.deep.equal(['src', 'dest'])
      r.errors.join('\n').split(/\n+/).should.deep.equal([
        'Usage: usage [x] [y] [z] {OPTIONS} <src> <dest> [extra_files...]',
        'too many arguments are provided'
      ])
    })

    // see: https://github.com/yargs/yargs/pull/438
    it('allows a custom min message to be provided', (done) => {
      yargs('-a 10 marsupial')
        .demandCommand(2, 'totes got $0 totes expected $1')
        .fail((msg) => {
          msg.should.equal('totes got 1 totes expected 2')
          return done()
        })
        .argv
    })

    // see: https://github.com/yargs/yargs/pull/438
    it('allows a custom min and max message to be provided', (done) => {
      yargs('-a 10 marsupial mammal bro')
        .demandCommand(1, 2, 'totes too few, got $0 totes expected $1', 'totes too many, got $0 totes expected $1')
        .fail((msg) => {
          msg.should.equal('totes too many, got 3 totes expected 2')
          return done()
        })
        .argv
    })

    it('defaults to demanding 1 command', (done) => {
      yargs('-a 10')
        .demandCommand()
        .fail((msg) => {
          msg.should.equal('Not enough non-option arguments: got 0, need at least 1')
          return done()
        })
        .argv
    })
  })
})
