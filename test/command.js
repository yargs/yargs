/* global describe, it, beforeEach */
var yargs = require('../')
var expect = require('chai').expect
var checkOutput = require('./helpers/utils').checkOutput

require('chai').should()

describe('Command', function () {
  beforeEach(function () {
    yargs.reset()
  })

  describe('positional arguments', function () {
    it('parses command string and populates optional and required positional arguments', function () {
      var y = yargs([])
        .command('foo <bar> [awesome]', 'my awesome command', function (yargs) {
          return yargs
        })
      var command = y.getCommandInstance()
      var handlers = command.getCommandHandlers()
      handlers.foo.demanded.should.include({
        cmd: 'bar',
        variadic: false
      })
      handlers.foo.optional.should.include({
        cmd: 'awesome',
        variadic: false
      })
    })

    it('populates inner argv with positional arguments', function (done) {
      yargs('foo hello world')
        .command('foo <bar> [awesome]', 'my awesome command', function () {}, function (argv) {
          argv._.should.include('foo')
          argv.bar.should.equal('hello')
          argv.awesome.should.equal('world')
          return done()
        })
        .argv
    })

    it('populates outer argv with positional arguments', function () {
      var argv = yargs('foo hello world')
        .command('foo <bar> [awesome]')
        .argv

      argv._.should.include('foo')
      argv.bar.should.equal('hello')
      argv.awesome.should.equal('world')
    })

    it('populates subcommand\'s inner argv with positional arguments', function () {
      yargs('foo bar hello world')
        .command('foo', 'my awesome command', function (yargs) {
          return yargs.command(
            'bar <greeting> [recipient]',
            'subcommands are cool',
            function () {},
            function (argv) {
              argv._.should.deep.equal(['foo', 'bar'])
              argv.greeting.should.equal('hello')
              argv.recipient.should.equal('world')
            }
          )
        })
        .argv
    })
  })

  describe('variadic', function () {
    it('allows required arguments to be variadic', function () {
      var argv = yargs('foo /root file1 file2 file3')
        .command('foo <root> <files..>')
        .argv

      argv.root.should.equal('/root')
      argv.files.should.deep.equal(['file1', 'file2', 'file3'])
    })

    it('allows optional arguments to be variadic', function () {
      var argv = yargs('foo /root file1 file2 file3')
        .command('foo <root> [files..]')
        .argv

      argv.root.should.equal('/root')
      argv.files.should.deep.equal(['file1', 'file2', 'file3'])
    })

    it('fails if required arguments are missing', function (done) {
      yargs('foo /root')
        .command('foo <root> <files..>')
        .fail(function (err) {
          err.should.match(/Not enough non-option arguments/)
          return done()
        })
        .argv
    })

    it('does not fail if zero optional arguments are provided', function () {
      var argv = yargs('foo /root')
        .command('foo <root> [files...]')
        .argv

      argv.root.should.equal('/root')
      argv.files.should.deep.equal([])
    })

    it('only allows the last argument to be variadic', function () {
      var argv = yargs('foo /root file1 file2')
        .command('foo <root..> <file>')
        .argv

      argv.root.should.equal('/root')
      argv.file.should.equal('file1')
      argv._.should.include('file2')
    })
  })

  describe('missing positional arguments', function () {
    it('fails if a required argument is missing', function (done) {
      var argv = yargs('foo hello')
        .command('foo <bar> <awesome>')
        .fail(function (err) {
          err.should.match(/got 1, need at least 2/)
          return done()
        })
        .argv

      argv.bar.should.equal('hello')
    })

    it('does not fail if optional argument is missing', function () {
      var argv = yargs('foo hello')
        .command('foo <bar> [awesome]')
        .argv

      expect(argv.awesome).to.equal(undefined)
      argv.bar.should.equal('hello')
    })
  })

  describe('API', function () {
    it('accepts string, string as first 2 arguments', function () {
      var cmd = 'foo'
      var desc = 'i\'m not feeling very creative at the moment'

      var y = yargs([]).command(cmd, desc)
      var commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([cmd, desc])
    })

    it('accepts string, boolean as first 2 arguments', function () {
      var cmd = 'foo'
      var desc = false

      var y = yargs([]).command(cmd, desc)
      var commands = y.getUsageInstance().getCommands()
      commands.should.deep.equal([])
    })

    it('accepts function as 3rd argument', function () {
      var cmd = 'foo'
      var desc = 'i\'m not feeling very creative at the moment'
      var builder = function (yargs) { return yargs }

      var y = yargs([]).command(cmd, desc, builder)
      var handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(cmd)
      handlers.foo.builder.should.equal(builder)
    })

    it('accepts options object as 3rd argument', function () {
      var cmd = 'foo'
      var desc = 'i\'m not feeling very creative at the moment'
      var builder = {
        hello: { default: 'world' }
      }

      var y = yargs([]).command(cmd, desc, builder)
      var handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(cmd)
      handlers.foo.builder.should.equal(builder)
    })

    it('accepts module (with builder function and handler function) as 3rd argument', function () {
      var cmd = 'foo'
      var desc = 'i\'m not feeling very creative at the moment'
      var module = {
        builder: function (yargs) { return yargs },
        handler: function (argv) {}
      }

      var y = yargs([]).command(cmd, desc, module)
      var handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(cmd)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
    })

    it('accepts module (with builder object and handler function) as 3rd argument', function () {
      var cmd = 'foo'
      var desc = 'i\'m not feeling very creative at the moment'
      var module = {
        builder: {
          hello: { default: 'world' }
        },
        handler: function (argv) {}
      }

      var y = yargs([]).command(cmd, desc, module)
      var handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(cmd)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
    })

    it('accepts module (describe key, builder function) as 1st argument', function () {
      var module = {
        command: 'foo',
        describe: 'i\'m not feeling very creative at the moment',
        builder: function (yargs) { return yargs },
        handler: function (argv) {}
      }

      var y = yargs([]).command(module)
      var handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      var commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([module.command, module.describe])
    })

    it('accepts module (description key, builder function) as 1st argument', function () {
      var module = {
        command: 'foo',
        description: 'i\'m not feeling very creative at the moment',
        builder: function (yargs) { return yargs },
        handler: function (argv) {}
      }

      var y = yargs([]).command(module)
      var handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      var commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([module.command, module.description])
    })

    it('accepts module (desc key, builder function) as 1st argument', function () {
      var module = {
        command: 'foo',
        desc: 'i\'m not feeling very creative at the moment',
        builder: function (yargs) { return yargs },
        handler: function (argv) {}
      }

      var y = yargs([]).command(module)
      var handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      var commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([module.command, module.desc])
    })

    it('accepts module (false describe, builder function) as 1st argument', function () {
      var module = {
        command: 'foo',
        describe: false,
        builder: function (yargs) { return yargs },
        handler: function (argv) {}
      }

      var y = yargs([]).command(module)
      var handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      var commands = y.getUsageInstance().getCommands()
      commands.should.deep.equal([])
    })

    it('accepts module (missing describe, builder function) as 1st argument', function () {
      var module = {
        command: 'foo',
        builder: function (yargs) { return yargs },
        handler: function (argv) {}
      }

      var y = yargs([]).command(module)
      var handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      var commands = y.getUsageInstance().getCommands()
      commands.should.deep.equal([])
    })

    it('accepts module (describe key, builder object) as 1st argument', function () {
      var module = {
        command: 'foo',
        describe: 'i\'m not feeling very creative at the moment',
        builder: {
          hello: {
            default: 'world'
          }
        },
        handler: function (argv) {}
      }

      var y = yargs([]).command(module)
      var handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      var commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([module.command, module.describe])
    })

    it('accepts module (missing handler function) as 1st argument', function () {
      var module = {
        command: 'foo',
        describe: 'i\'m not feeling very creative at the moment',
        builder: {
          hello: {
            default: 'world'
          }
        }
      }

      var y = yargs([]).command(module)
      var handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      expect(handlers.foo.handler).to.equal(undefined)
      var commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([module.command, module.describe])
    })
  })

  describe('commandDir', function () {
    it('supports relative dirs', function () {
      var r = checkOutput(function () {
        return yargs('--help').help().wrap(null)
          // assumes cwd is node_modules/mocha/bin
          .commandDir('../../../test/fixtures/cmddir')
          .argv
      })
      r.should.have.property('exit').and.be.true
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Commands:',
        '  dream [command] [opts]  Go to sleep and dream',
        'Options:',
        '  --help  Show help  [boolean]',
        ''
      ])
    })

    it('supports nested subcommands', function () {
      var r = checkOutput(function () {
        return yargs('dream --help').help().wrap(null)
          // assumes cwd is node_modules/mocha/bin
          .commandDir('../../../test/fixtures/cmddir')
          .argv
      }, [ './command' ])
      r.should.have.property('exit').and.be.true
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs[0].split(/\n+/).should.deep.equal([
        './command dream [command] [opts]',
        'Commands:',
        '  of-memory <memory>               Dream about a specific memory',
        '  within-a-dream [command] [opts]  Dream within a dream',
        'Options:',
        '  --help     Show help  [boolean]',
        '  --shared   Is the dream shared with others?  [boolean]',
        '  --extract  Attempt extraction?  [boolean]',
        ''
      ])
    })

    it('supports a "recurse" boolean option', function () {
      var r = checkOutput(function () {
        return yargs('--help').help().wrap(null)
          // assumes cwd is node_modules/mocha/bin
          .commandDir('../../../test/fixtures/cmddir', { recurse: true })
          .argv
      })
      r.should.have.property('exit').and.be.true
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Commands:',
        '  limbo [opts]                     Get lost in pure subconscious',
        '  inception [command] [opts]       Enter another dream, where inception is possible',
        '  within-a-dream [command] [opts]  Dream within a dream',
        '  dream [command] [opts]           Go to sleep and dream',
        'Options:',
        '  --help  Show help  [boolean]',
        ''
      ])
    })

    it('supports a "visit" function option', function () {
      var commandObject
      var pathToFile
      var filename
      var r = checkOutput(function () {
        return yargs('--help').help().wrap(null)
          // assumes cwd is node_modules/mocha/bin
          .commandDir('../../../test/fixtures/cmddir', {
            visit: function (_commandObject, _pathToFile, _filename) {
              commandObject = _commandObject
              pathToFile = _pathToFile
              filename = _filename
              return false // exclude command
            }
          })
          .argv
      })
      commandObject.should.have.property('command').and.equal('dream [command] [opts]')
      commandObject.should.have.property('desc').and.equal('Go to sleep and dream')
      commandObject.should.have.property('builder')
      commandObject.should.have.property('handler')
      pathToFile.should.contain(require('path').join('test', 'fixtures', 'cmddir', 'dream.js'))
      filename.should.equal('dream.js')
      r.should.have.property('exit').and.be.true
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Options:',
        '  --help  Show help  [boolean]',
        ''
      ])
    })

    it('detects and ignores cyclic dir references', function () {
      var r = checkOutput(function () {
        return yargs('cyclic --help').help().wrap(null)
          // assumes cwd is node_modules/mocha/bin
          .commandDir('../../../test/fixtures/cmddir_cyclic')
          .argv
      }, [ './command' ])
      r.should.have.property('exit').and.be.true
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        './command cyclic',
        'Options:',
        '  --help  Show help  [boolean]',
        ''
      ])
    })

    it('derives \'command\' string from filename when not exported', function () {
      var r = checkOutput(function () {
        return yargs('--help').help().wrap(null)
          // assumes cwd is node_modules/mocha/bin
          .commandDir('../../../test/fixtures/cmddir_noname')
          .argv
      })
      r.should.have.property('exit').and.be.true
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'Commands:',
        '  nameless  Command name derived from module filename',
        'Options:',
        '  --help  Show help  [boolean]',
        ''
      ])
    })
  })

  // addresses https://github.com/yargs/yargs/issues/514.
  it('respects order of positional arguments when matching commands', function () {
    var output = []
    yargs('bar foo')
      .command('foo', 'foo command', function (yargs) {
        output.push('foo')
      })
      .command('bar', 'bar command', function (yargs) {
        output.push('bar')
      })
      .argv

    output.should.include('bar')
    output.should.not.include('foo')
  })
})
