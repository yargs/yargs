'use strict'
/* global describe, it, beforeEach */
const yargs = require('../')
const expect = require('chai').expect
const checkOutput = require('./helpers/utils').checkOutput

require('chai').should()
const noop = () => {}

describe('Command', () => {
  beforeEach(() => {
    yargs.reset()
  })

  describe('positional arguments', () => {
    it('parses command string and populates optional and required positional arguments', () => {
      const y = yargs([])
        .command('foo <bar> [awesome]', 'my awesome command', yargs => yargs)
      const command = y.getCommandInstance()
      const handlers = command.getCommandHandlers()
      handlers.foo.demanded.should.deep.include({
        cmd: ['bar'],
        variadic: false
      })
      handlers.foo.optional.should.deep.include({
        cmd: ['awesome'],
        variadic: false
      })
    })

    it('populates inner argv with positional arguments', (done) => {
      yargs('foo hello world')
        .command('foo <bar> [awesome]', 'my awesome command', noop, (argv) => {
          argv._.should.include('foo')
          argv.bar.should.equal('hello')
          argv.awesome.should.equal('world')
          return done()
        })
        .argv
    })

    it('populates outer argv with positional arguments', () => {
      const argv = yargs('foo hello world')
        .command('foo <bar> [awesome]')
        .argv

      argv._.should.include('foo')
      argv.bar.should.equal('hello')
      argv.awesome.should.equal('world')
    })

    it('populates argv with camel-case variants of arguments when possible', () => {
      const argv = yargs('foo hello world')
        .command('foo <foo-bar> [baz-qux]')
        .argv

      argv._.should.include('foo')
      argv['foo-bar'].should.equal('hello')
      argv.fooBar.should.equal('hello')
      argv.bazQux.should.equal('world')
      argv['baz-qux'].should.equal('world')
    })

    it('populates argv with camel-case variants of variadic args when possible', () => {
      const argv = yargs('foo hello world !')
        .command('foo <foo-bar> [baz-qux..]')
        .argv

      argv._.should.include('foo')
      argv['foo-bar'].should.equal('hello')
      argv.fooBar.should.equal('hello')
      argv.bazQux.should.deep.equal(['world', '!'])
      argv['baz-qux'].should.deep.equal(['world', '!'])
    })

    it('populates subcommand\'s inner argv with positional arguments', () => {
      yargs('foo bar hello world')
        .command('foo', 'my awesome command', yargs => yargs.command(
            'bar <greeting> [recipient]',
            'subcommands are cool',
            noop,
            (argv) => {
              argv._.should.deep.equal(['foo', 'bar'])
              argv.greeting.should.equal('hello')
              argv.recipient.should.equal('world')
            }
          ))
        .argv
    })

    it('ignores positional args for aliases', () => {
      const y = yargs([])
        .command(['foo [awesome]', 'wat <yo>'], 'my awesome command')
      const command = y.getCommandInstance()
      const handlers = command.getCommandHandlers()
      handlers.foo.optional.should.deep.include({
        cmd: ['awesome'],
        variadic: false
      })
      handlers.foo.demanded.should.deep.equal([])
      expect(handlers.wat).to.not.exist
      command.getCommands().should.deep.equal(['foo', 'wat'])
    })

    it('does not overwrite existing values in argv for keys that are not positional', () => {
      const argv = yargs('foo foo.js --reporter=html')
        .command('foo <file>')
        .default('reporter', 'text')
        .argv
      argv.file.should.equal('foo.js')
      argv.reporter.should.equal('html')
    })
  })

  describe('variadic', () => {
    it('allows required arguments to be variadic', () => {
      const argv = yargs('foo /root file1 file2 file3')
        .command('foo <root> <files..>')
        .argv

      argv.root.should.equal('/root')
      argv.files.should.deep.equal(['file1', 'file2', 'file3'])
    })

    it('allows optional arguments to be variadic', () => {
      const argv = yargs('foo /root file1 file2 file3')
        .command('foo <root> [files..]')
        .argv

      argv.root.should.equal('/root')
      argv.files.should.deep.equal(['file1', 'file2', 'file3'])
    })

    it('fails if required arguments are missing', (done) => {
      yargs('foo /root')
        .command('foo <root> <files..>')
        .fail((err) => {
          err.should.match(/Not enough non-option arguments/)
          return done()
        })
        .argv
    })

    it('does not fail if zero optional arguments are provided', () => {
      const argv = yargs('foo /root')
        .command('foo <root> [files...]')
        .argv

      argv.root.should.equal('/root')
      argv.files.should.deep.equal([])
    })

    it('only allows the last argument to be variadic', () => {
      const argv = yargs('foo /root file1 file2')
        .command('foo <root..> <file>')
        .argv

      argv.root.should.equal('/root')
      argv.file.should.equal('file1')
      argv._.should.include('file2')
    })
  })

  describe('missing positional arguments', () => {
    it('fails if a required argument is missing', (done) => {
      const argv = yargs('foo hello')
        .command('foo <bar> <awesome>')
        .fail((err) => {
          err.should.match(/got 1, need at least 2/)
          return done()
        })
        .argv

      argv.bar.should.equal('hello')
    })

    it('does not fail if optional argument is missing', () => {
      const argv = yargs('foo hello')
        .command('foo <bar> [awesome]')
        .argv

      expect(argv.awesome).to.equal(undefined)
      argv.bar.should.equal('hello')
    })
  })

  describe('API', () => {
    it('accepts string, string as first 2 arguments', () => {
      const cmd = 'foo'
      const desc = 'i\'m not feeling very creative at the moment'
      const isDefault = false
      const aliases = []

      const y = yargs([]).command(cmd, desc)
      const commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([cmd, desc, isDefault, aliases])
    })

    it('accepts array, string as first 2 arguments', () => {
      const aliases = ['bar', 'baz']
      const cmd = 'foo <qux>'
      const desc = 'i\'m not feeling very creative at the moment'
      const isDefault = false

      const y = yargs([]).command([cmd].concat(aliases), desc)
      const usageCommands = y.getUsageInstance().getCommands()
      usageCommands[0].should.deep.equal([cmd, desc, isDefault, aliases])
      const cmdCommands = y.getCommandInstance().getCommands()
      cmdCommands.should.deep.equal(['foo', 'bar', 'baz'])
    })

    it('accepts string, boolean as first 2 arguments', () => {
      const cmd = 'foo'
      const desc = false

      const y = yargs([]).command(cmd, desc)
      const commands = y.getUsageInstance().getCommands()
      commands.should.deep.equal([])
    })

    it('accepts array, boolean as first 2 arguments', () => {
      const aliases = ['bar', 'baz']
      const cmd = 'foo <qux>'
      const desc = false

      const y = yargs([]).command([cmd].concat(aliases), desc)
      const usageCommands = y.getUsageInstance().getCommands()
      usageCommands.should.deep.equal([])
      const cmdCommands = y.getCommandInstance().getCommands()
      cmdCommands.should.deep.equal(['foo', 'bar', 'baz'])
    })

    it('accepts function as 3rd argument', () => {
      const cmd = 'foo'
      const desc = 'i\'m not feeling very creative at the moment'
      const builder = yargs => yargs

      const y = yargs([]).command(cmd, desc, builder)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(cmd)
      handlers.foo.builder.should.equal(builder)
    })

    it('accepts options object as 3rd argument', () => {
      const cmd = 'foo'
      const desc = 'i\'m not feeling very creative at the moment'
      const builder = {
        hello: { default: 'world' }
      }

      const y = yargs([]).command(cmd, desc, builder)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(cmd)
      handlers.foo.builder.should.equal(builder)
    })

    it('accepts module (with builder function and handler function) as 3rd argument', () => {
      const cmd = 'foo'
      const desc = 'i\'m not feeling very creative at the moment'
      const module = {
        builder (yargs) { return yargs },
        handler (argv) {}
      }

      const y = yargs([]).command(cmd, desc, module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(cmd)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
    })

    it('accepts module (with builder object and handler function) as 3rd argument', () => {
      const cmd = 'foo'
      const desc = 'i\'m not feeling very creative at the moment'
      const module = {
        builder: {
          hello: { default: 'world' }
        },
        handler (argv) {}
      }

      const y = yargs([]).command(cmd, desc, module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(cmd)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
    })

    it('accepts module (describe key, builder function) as 1st argument', () => {
      const module = {
        command: 'foo',
        describe: 'i\'m not feeling very creative at the moment',
        builder (yargs) { return yargs },
        handler (argv) {}
      }
      const isDefault = false
      const aliases = []

      const y = yargs([]).command(module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      const commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([module.command, module.describe, isDefault, aliases])
    })

    it('accepts module (description key, builder function) as 1st argument', () => {
      const module = {
        command: 'foo',
        description: 'i\'m not feeling very creative at the moment',
        builder (yargs) { return yargs },
        handler (argv) {}
      }
      const isDefault = false
      const aliases = []

      const y = yargs([]).command(module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      const commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([module.command, module.description, isDefault, aliases])
    })

    it('accepts module (desc key, builder function) as 1st argument', () => {
      const module = {
        command: 'foo',
        desc: 'i\'m not feeling very creative at the moment',
        builder (yargs) { return yargs },
        handler (argv) {}
      }
      const isDefault = false
      const aliases = []

      const y = yargs([]).command(module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      const commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([module.command, module.desc, isDefault, aliases])
    })

    it('accepts module (false describe, builder function) as 1st argument', () => {
      const module = {
        command: 'foo',
        describe: false,
        builder (yargs) { return yargs },
        handler (argv) {}
      }

      const y = yargs([]).command(module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      const commands = y.getUsageInstance().getCommands()
      commands.should.deep.equal([])
    })

    it('accepts module (missing describe, builder function) as 1st argument', () => {
      const module = {
        command: 'foo',
        builder (yargs) { return yargs },
        handler (argv) {}
      }

      const y = yargs([]).command(module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      const commands = y.getUsageInstance().getCommands()
      commands.should.deep.equal([])
    })

    it('accepts module (describe key, builder object) as 1st argument', () => {
      const module = {
        command: 'foo',
        describe: 'i\'m not feeling very creative at the moment',
        builder: {
          hello: {
            default: 'world'
          }
        },
        handler (argv) {}
      }
      const isDefault = false
      const aliases = []

      const y = yargs([]).command(module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      const commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([module.command, module.describe, isDefault, aliases])
    })

    it('accepts module (missing handler function) as 1st argument', () => {
      const module = {
        command: 'foo',
        describe: 'i\'m not feeling very creative at the moment',
        builder: {
          hello: {
            default: 'world'
          }
        }
      }
      const isDefault = false
      const aliases = []

      const y = yargs([]).command(module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      expect(typeof handlers.foo.handler).to.equal('function')
      const commands = y.getUsageInstance().getCommands()
      commands[0].should.deep.equal([module.command, module.describe, isDefault, aliases])
    })

    it('accepts module (with command array) as 1st argument', () => {
      const module = {
        command: ['foo <qux>', 'bar', 'baz'],
        describe: 'i\'m not feeling very creative at the moment',
        builder (yargs) { return yargs },
        handler (argv) {}
      }
      const isDefault = false

      const y = yargs([]).command(module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command[0])
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      const usageCommands = y.getUsageInstance().getCommands()
      usageCommands[0].should.deep.equal([module.command[0], module.describe, isDefault, ['bar', 'baz']])
      const cmdCommands = y.getCommandInstance().getCommands()
      cmdCommands.should.deep.equal(['foo', 'bar', 'baz'])
    })

    it('accepts module (with command string and aliases array) as 1st argument', () => {
      const module = {
        command: 'foo <qux>',
        aliases: ['bar', 'baz'],
        describe: 'i\'m not feeling very creative at the moment',
        builder (yargs) { return yargs },
        handler (argv) {}
      }
      const isDefault = false

      const y = yargs([]).command(module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      const usageCommands = y.getUsageInstance().getCommands()
      usageCommands[0].should.deep.equal([module.command, module.describe, isDefault, module.aliases])
      const cmdCommands = y.getCommandInstance().getCommands()
      cmdCommands.should.deep.equal(['foo', 'bar', 'baz'])
    })

    it('accepts module (with command array and aliases array) as 1st argument', () => {
      const module = {
        command: ['foo <qux>', 'bar'],
        aliases: ['baz', 'nat'],
        describe: 'i\'m not feeling very creative at the moment',
        builder (yargs) { return yargs },
        handler (argv) {}
      }
      const isDefault = false

      const y = yargs([]).command(module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command[0])
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      const usageCommands = y.getUsageInstance().getCommands()
      usageCommands[0].should.deep.equal([module.command[0], module.describe, isDefault, ['bar', 'baz', 'nat']])
      const cmdCommands = y.getCommandInstance().getCommands()
      cmdCommands.should.deep.equal(['foo', 'bar', 'baz', 'nat'])
    })

    it('accepts module (with command string and aliases string) as 1st argument', () => {
      const module = {
        command: 'foo <qux>',
        aliases: 'bar',
        describe: 'i\'m not feeling very creative at the moment',
        builder (yargs) { return yargs },
        handler (argv) {}
      }
      const isDefault = false

      const y = yargs([]).command(module)
      const handlers = y.getCommandInstance().getCommandHandlers()
      handlers.foo.original.should.equal(module.command)
      handlers.foo.builder.should.equal(module.builder)
      handlers.foo.handler.should.equal(module.handler)
      const usageCommands = y.getUsageInstance().getCommands()
      usageCommands[0].should.deep.equal([module.command, module.describe, isDefault, ['bar']])
      const cmdCommands = y.getCommandInstance().getCommands()
      cmdCommands.should.deep.equal(['foo', 'bar'])
    })
  })

  describe('commandDir', () => {
    it('supports relative dirs', () => {
      const r = checkOutput(() => yargs('--help').wrap(null)
          .commandDir('fixtures/cmddir')
          .argv)
      r.should.have.property('exit').and.be.true
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'usage [command]',
        'Commands:',
        '  usage dream [command] [opts]  Go to sleep and dream',
        'Options:',
        '  --help     Show help  [boolean]',
        '  --version  Show version number  [boolean]',
        ''
      ])
    })

    it('supports nested subcommands', () => {
      const r = checkOutput(() => yargs('dream --help').wrap(null)
          .commandDir('fixtures/cmddir')
          .argv, [ './command' ])
      r.should.have.property('exit').and.be.true
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs[0].split(/\n+/).should.deep.equal([
        'command dream [command] [opts]',
        'Go to sleep and dream',
        'Commands:',
        '  command dream of-memory <memory>               Dream about a specific memory',
        '  command dream within-a-dream [command] [opts]  Dream within a dream',
        'Options:',
        '  --help     Show help  [boolean]',
        '  --version  Show version number  [boolean]',
        '  --shared   Is the dream shared with others?  [boolean]',
        '  --extract  Attempt extraction?  [boolean]',
        ''
      ])
    })

    it('supports a "recurse" boolean option', () => {
      const r = checkOutput(() => yargs('--help').wrap(null)
          .commandDir('fixtures/cmddir', { recurse: true })
          .argv)
      r.should.have.property('exit').and.be.true
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'usage [command]',
        'Commands:',
        '  usage limbo [opts]                     Get lost in pure subconscious',
        '  usage inception [command] [opts]       Enter another dream, where inception is possible',
        '  usage within-a-dream [command] [opts]  Dream within a dream',
        '  usage dream [command] [opts]           Go to sleep and dream',
        'Options:',
        '  --help     Show help  [boolean]',
        '  --version  Show version number  [boolean]',
        ''
      ])
    })

    it('supports a "visit" function option', () => {
      let commandObject
      let pathToFile
      let filename
      const r = checkOutput(() => yargs('--help').wrap(null)
          .commandDir('fixtures/cmddir', {
            visit (_commandObject, _pathToFile, _filename) {
              commandObject = _commandObject
              pathToFile = _pathToFile
              filename = _filename
              return false // exclude command
            }
          })
          .argv)
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
        '  --help     Show help  [boolean]',
        '  --version  Show version number  [boolean]',
        ''
      ])
    })

    it('detects and ignores cyclic dir references', () => {
      const r = checkOutput(() => yargs('cyclic --help').wrap(null)
          .commandDir('fixtures/cmddir_cyclic')
          .argv, [ './command' ])
      r.should.have.property('exit').and.be.true
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'command cyclic',
        'Attempts to (re)apply its own dir',
        'Options:',
        '  --help     Show help  [boolean]',
        '  --version  Show version number  [boolean]',
        ''
      ])
    })

    it('derives \'command\' string from filename when not exported', () => {
      const r = checkOutput(() => yargs('--help').wrap(null)
          .commandDir('fixtures/cmddir_noname')
          .argv)
      r.should.have.property('exit').and.be.true
      r.should.have.property('errors').with.length(0)
      r.should.have.property('logs')
      r.logs.join('\n').split(/\n+/).should.deep.equal([
        'usage [command]',
        'Commands:',
        '  usage nameless  Command name derived from module filename',
        'Options:',
        '  --help     Show help  [boolean]',
        '  --version  Show version number  [boolean]',
        ''
      ])
    })
  })

  describe('help command', () => {
    it('displays command help appropriately', () => {
      const sub = {
        command: 'sub',
        desc: 'Run the subcommand',
        builder: {},
        handler (argv) {}
      }

      const cmd = {
        command: 'cmd <sub>',
        desc: 'Try a command',
        builder (yargs) {
          return yargs.command(sub)
        },
        handler (argv) {}
      }

      const helpCmd = checkOutput(() => yargs('help cmd')
          .wrap(null)
          .command(cmd)
          .argv, [ './command' ])

      const cmdHelp = checkOutput(() => yargs('cmd help')
          .wrap(null)
          .command(cmd)
          .argv, [ './command' ])

      const helpCmdSub = checkOutput(() => yargs('help cmd sub')
          .wrap(null)
          .command(cmd)
          .argv, [ './command' ])

      const cmdHelpSub = checkOutput(() => yargs('cmd help sub')
          .wrap(null)
          .command(cmd)
          .argv, [ './command' ])

      const cmdSubHelp = checkOutput(() => yargs('cmd sub help')
          .wrap(null)
          .command(cmd)
          .argv, [ './command' ])

      const expectedCmd = [
        'command cmd <sub>',
        'Try a command',
        'Commands:',
        '  command cmd sub  Run the subcommand',
        'Options:',
        '  --help     Show help  [boolean]',
        '  --version  Show version number  [boolean]',
        ''
      ]

      const expectedSub = [
        'command cmd sub',
        'Run the subcommand',
        'Options:',
        '  --help     Show help  [boolean]',
        '  --version  Show version number  [boolean]',
        ''
      ]

      // no help is output if help isn't last
      // positional argument.
      helpCmd.logs.should.eql([])
      helpCmdSub.logs.should.eql([])
      cmdHelpSub.logs.should.eql([])

      // shows help if it is the last positional argument.
      cmdHelp.logs.join('\n').split(/\n+/).should.deep.equal(expectedCmd)
      cmdSubHelp.logs.join('\n').split(/\n+/).should.deep.equal(expectedSub)
    })
  })

  // see: https://github.com/yargs/yargs/pull/553
  it('preserves top-level envPrefix', () => {
    process.env.FUN_DIP_STICK = 'yummy'
    process.env.FUN_DIP_POWDER = 'true'
    yargs('eat')
      .env('FUN_DIP')
      .global('stick') // this does not actually need to be global
      .command('eat', 'Adult supervision recommended', yargs => yargs.boolean('powder').exitProcess(false), (argv) => {
        argv.should.have.property('powder').and.be.true
        argv.should.have.property('stick').and.equal('yummy')
      })
      .exitProcess(false)
      .argv
  })

  // addresses https://github.com/yargs/yargs/issues/514.
  it('respects order of positional arguments when matching commands', () => {
    const output = []
    yargs('bar foo')
      .command('foo', 'foo command', (yargs) => {
        output.push('foo')
      })
      .command('bar', 'bar command', (yargs) => {
        output.push('bar')
      })
      .argv

    output.should.include('bar')
    output.should.not.include('foo')
  })

  // addresses https://github.com/yargs/yargs/issues/558
  it('handles positional arguments if command is invoked using .parse()', () => {
    const y = yargs([])
      .command('foo <second>', 'the foo command', {})
    const argv = y.parse(['foo', 'bar'])
    argv.second.should.equal('bar')
  })

  // addresses https://github.com/yargs/yargs/issues/710
  it('invokes command handler repeatedly if parse() is called multiple times', () => {
    let counter = 0
    const y = yargs([])
      .command('foo', 'the foo command', {}, (argv) => {
        counter++
      })
    y.parse(['foo'])
    y.parse(['foo'])
    counter.should.equal(2)
  })

  // addresses: https://github.com/yargs/yargs/issues/776
  it('allows command handler to be invoked repeatedly when help is enabled', (done) => {
    let counter = 0
    const y = yargs([])
      .command('foo', 'the foo command', {}, (argv) => {
        counter++
      })
    y.parse(['foo'], noop)
    y.parse(['foo'], () => {
      counter.should.equal(2)
      return done()
    })
  })

  // addresses https://github.com/yargs/yargs/issues/522
  it('does not require builder function to return', () => {
    const argv = yargs('yo')
      .command('yo [someone]', 'Send someone a yo', (yargs) => {
        yargs.default('someone', 'Pat')
      }, (argv) => {
        argv.should.have.property('someone').and.equal('Pat')
      })
      .argv
    argv.should.have.property('someone').and.equal('Pat')
  })

  it('allows builder function to parse argv without returning', () => {
    const argv = yargs('yo Jude')
      .command('yo <someone>', 'Send someone a yo', (yargs) => {
        yargs.argv
      }, (argv) => {
        argv.should.have.property('someone').and.equal('Jude')
      })
      .argv
    argv.should.have.property('someone').and.equal('Jude')
  })

  it('allows builder function to return parsed argv', () => {
    const argv = yargs('yo Leslie')
      .command('yo <someone>', 'Send someone a yo', yargs => yargs.argv, (argv) => {
        argv.should.have.property('someone').and.equal('Leslie')
      })
      .argv
    argv.should.have.property('someone').and.equal('Leslie')
  })

  // addresses https://github.com/yargs/yargs/issues/540
  it('ignores extra spaces in command string', () => {
    const y = yargs([])
      .command('foo  [awesome]', 'my awesome command', yargs => yargs)
    const command = y.getCommandInstance()
    const handlers = command.getCommandHandlers()
    handlers.foo.demanded.should.not.include({
      cmd: '',
      variadic: false
    })
    handlers.foo.demanded.should.have.lengthOf(0)
  })

  it('executes a command via alias', () => {
    let commandCalled = false
    const argv = yargs('hi world')
      .command(['hello <someone>', 'hi'], 'Say hello', {}, (argv) => {
        commandCalled = true
        argv.should.have.property('someone').and.equal('world')
      })
      .argv
    argv.should.have.property('someone').and.equal('world')
    commandCalled.should.be.true
  })

  describe('positional aliases', () => {
    it('allows an alias to be defined for a required positional argument', () => {
      const argv = yargs('yo bcoe 113993')
        .command('yo <user | email> [ssn]', 'Send someone a yo')
        .argv
      argv.user.should.equal('bcoe')
      argv.email.should.equal('bcoe')
      argv.ssn.should.equal(113993)
    })

    it('allows an alias to be defined for an optional positional argument', () => {
      let argv
      yargs('yo 113993')
        .command('yo [ssn|sin]', 'Send someone a yo', {}, (_argv) => {
          argv = _argv
        })
        .argv
      argv.ssn.should.equal(113993)
      argv.sin.should.equal(113993)
    })

    it('allows variadic and positional arguments to be combined', () => {
      const parser = yargs
        .command('yo <user|email> [ ssns | sins... ]', 'Send someone a yo')
      const argv = parser.parse('yo bcoe 113993 112888')
      argv.user.should.equal('bcoe')
      argv.email.should.equal('bcoe')
      argv.ssns.should.deep.equal([113993, 112888])
      argv.sins.should.deep.equal([113993, 112888])
    })
  })

  describe('global parsing hints', () => {
    describe('config', () => {
      it('does not load config for command if global is false', (done) => {
        yargs('command --foo ./package.json')
          .command('command', 'a command', {}, (argv) => {
            expect(argv.license).to.equal(undefined)
            return done()
          })
          .config('foo')
          .global('foo', false)
          .argv
      })

      it('loads config for command by default', (done) => {
        yargs('command --foo ./package.json')
          .command('command', 'a command', {}, (argv) => {
            argv.license.should.equal('MIT')
            return done()
          })
          .config('foo')
          .argv
      })
    })

    describe('validation', () => {
      it('resets implies logic for command if global is false', (done) => {
        yargs('command --foo 99')
          .command('command', 'a command', {}, (argv) => {
            argv.foo.should.equal(99)
            return done()
          })
          .implies('foo', 'bar')
          .global('foo', false)
          .argv
      })

      it('applies conflicts logic for command by default', (done) => {
        yargs('command --foo --bar')
          .command('command', 'a command', {}, (argv) => {})
          .fail((msg) => {
            msg.should.match(/mutually exclusive/)
            return done()
          })
          .conflicts('foo', 'bar')
          .argv
      })

      it('resets conflicts logic for command if global is false', (done) => {
        yargs('command --foo --bar')
          .command('command', 'a command', {}, (argv) => {
            argv.foo.should.equal(true)
            argv.bar.should.equal(true)
            return done()
          })
          .conflicts('foo', 'bar')
          .global('foo', false)
          .argv
      })

      it('applies custom checks globally by default', (done) => {
        yargs('command blerg --foo')
          .command('command <snuh>', 'a command')
          .check((argv) => {
            argv.snuh.should.equal('blerg')
            argv.foo.should.equal(true)
            argv._.should.include('command')
            done()
            return true
          })
          .argv
      })

      it('resets custom check if global is false', () => {
        let checkCalled = false
        yargs('command blerg --foo')
          .command('command <snuh>', 'a command')
          .check((argv) => {
            checkCalled = true
            return true
          }, false)
          .argv
        checkCalled.should.equal(false)
      })

      it('applies demandOption globally', (done) => {
        yargs('command blerg --foo')
          .command('command <snuh>', 'a command')
          .fail((msg) => {
            msg.should.match(/Missing required argument: bar/)
            return done()
          })
          .demandOption('bar')
          .argv
      })
    })

    describe('strict', () => {
      it('defaults to false when not called', () => {
        let commandCalled = false
        yargs('hi')
          .command('hi', 'The hi command', (innerYargs) => {
            commandCalled = true
            innerYargs.getStrict().should.be.false
          })
        yargs.getStrict().should.be.false
        yargs.argv // parse and run command
        commandCalled.should.be.true
      })

      it('can be enabled just for a command', () => {
        let commandCalled = false
        yargs('hi')
          .command('hi', 'The hi command', (innerYargs) => {
            commandCalled = true
            innerYargs.strict().getStrict().should.be.true
          })
        yargs.getStrict().should.be.false
        yargs.argv // parse and run command
        commandCalled.should.be.true
      })

      it('applies strict globally by default', () => {
        let commandCalled = false
        yargs('hi')
          .strict()
          .command('hi', 'The hi command', (innerYargs) => {
            commandCalled = true
            innerYargs.getStrict().should.be.true
          })
        yargs.getStrict().should.be.true
        yargs.argv // parse and run command
        commandCalled.should.be.true
      })

      // address regression introduced in #766, thanks @nexdrew!
      it('does not fail strict check due to postional command arguments', (done) => {
        yargs()
          .strict()
          .command('hi <name>', 'The hi command')
          .parse('hi ben', (err, argv, output) => {
            expect(err).to.equal(null)
            return done()
          })
      })

      // address https://github.com/yargs/yargs/issues/795
      it('does not fail strict check due to postional command arguments in nested commands', (done) => {
        yargs()
          .strict()
          .command('hi', 'The hi command', (yargs) => {
            yargs.command('ben <age>', 'ben command', noop, noop)
          })
          .parse('hi ben 99', (err, argv, output) => {
            expect(err).to.equal(null)
            return done()
          })
      })

      it('allows a command to override global`', () => {
        let commandCalled = false
        yargs('hi')
         .strict()
         .command('hi', 'The hi command', (innerYargs) => {
           commandCalled = true
           innerYargs.strict(false).getStrict().should.be.false
         })
        yargs.getStrict().should.be.true
        yargs.argv // parse and run command
        commandCalled.should.be.true
      })

      it('does not fire command if validation fails', (done) => {
        let commandRun = false
        yargs()
          .strict()
          .command('hi <name>', 'The hi command', noop, (argv) => {
            commandRun = true
          })
          .parse('hi ben --hello=world', (err, argv, output) => {
            commandRun.should.equal(false)
            err.message.should.equal('Unknown argument: hello')
            return done()
          })
      })
    })

    describe('types', () => {
      it('applies array type globally', () => {
        const argv = yargs('command --foo 1 2')
          .command('command', 'a command')
          .array('foo')
          .argv
        argv.foo.should.eql([1, 2])
      })

      it('allows global setting to be disabled for array type', () => {
        const argv = yargs('command --foo 1 2')
          .command('command', 'a command')
          .array('foo')
          .global('foo', false)
          .argv
        argv.foo.should.eql(1)
      })

      it('applies choices type globally', (done) => {
        yargs('command --foo 99')
          .command('command', 'a command')
          .choices('foo', [33, 88])
          .fail((msg) => {
            msg.should.match(/Choices: 33, 88/)
            return done()
          })
          .argv
      })
    })

    describe('aliases', () => {
      it('defaults to applying aliases globally', (done) => {
        yargs('command blerg --foo 22')
          .command('command <snuh>', 'a command', {}, (argv) => {
            argv.foo.should.equal(22)
            argv.bar.should.equal(22)
            argv.snuh.should.equal('blerg')
            return done()
          })
          .alias('foo', 'bar')
          .argv
      })

      it('allows global application of alias to be disabled', (done) => {
        yargs('command blerg --foo 22')
          .command('command <snuh>', 'a command', {}, (argv) => {
            argv.foo.should.equal(22)
            expect(argv.bar).to.equal(undefined)
            argv.snuh.should.equal('blerg')
            return done()
          })
          .option('foo', {
            alias: 'bar',
            global: false
          })
          .argv
      })
    })

    describe('coerce', () => {
      it('defaults to applying coerce rules globally', (done) => {
        yargs('command blerg --foo 22')
          .command('command <snuh>', 'a command', {}, (argv) => {
            argv.foo.should.equal(44)
            argv.snuh.should.equal('blerg')
            return done()
          })
          .coerce('foo', arg => arg * 2)
          .argv
      })

      // addresses https://github.com/yargs/yargs/issues/794
      it('should bubble errors thrown by coerce function inside commands', (done) => {
        yargs
          .command('foo', 'the foo command', (yargs) => {
            yargs.coerce('x', (arg) => {
              throw Error('yikes an error')
            })
          })
          .parse('foo -x 99', (err) => {
            err.message.should.match(/yikes an error/)
            return done()
          })
      })
    })

    describe('defaults', () => {
      it('applies defaults globally', (done) => {
        yargs('command --foo 22')
          .command('command [snuh]', 'a command', {}, (argv) => {
            argv.foo.should.equal(22)
            argv.snuh.should.equal(55)
            return done()
          })
          .default('snuh', 55)
          .argv
      })
    })

    describe('describe', () => {
      it('flags an option as global if a description is set', (done) => {
        yargs()
          .command('command [snuh]', 'a command')
          .describe('foo', 'an awesome argument')
          .parse('command --help', (err, argv, output) => {
            if (err) return done(err)
            output.should.not.match(/Commands:/)
            output.should.match(/an awesome argument/)
            return done()
          })
      })
    })

    describe('help', () => {
      it('applies help globally', (done) => {
        yargs()
          .command('command [snuh]', 'a command')
          .describe('foo', 'an awesome argument')
          .help('hellllllp')
          .parse('command --hellllllp', (err, argv, output) => {
            if (err) return done(err)
            output.should.match(/--hellllllp {2}Show help/)
            return done()
          })
      })
    })

    describe('version', () => {
      it('applies version globally', (done) => {
        yargs()
          .command('command [snuh]', 'a command')
          .describe('foo', 'an awesome argument')
          .version('ver', 'show version', '9.9.9')
          .parse('command --ver', (err, argv, output) => {
            if (err) return done(err)
            output.should.equal('9.9.9')
            return done()
          })
      })
    })

    describe('groups', () => {
      it('should apply custom option groups globally', (done) => {
        yargs()
          .command('command [snuh]', 'a command')
          .group('foo', 'Bad Variable Names:')
          .group('snuh', 'Bad Variable Names:')
          .describe('foo', 'foo option')
          .describe('snuh', 'snuh positional')
          .parse('command --help', (err, argv, output) => {
            if (err) return done(err)
            output.should.match(/Bad Variable Names:\W*--foo/)
            return done()
          })
      })
    })
  })

  describe('default commands', () => {
    it('executes default command if no positional arguments given', (done) => {
      yargs('--foo bar')
        .command('*', 'default command', noop, (argv) => {
          argv.foo.should.equal('bar')
          return done()
        })
        .argv
    })

    it('executes default command if undefined positional arguments and only command', (done) => {
      yargs('baz --foo bar')
        .command('*', 'default command', noop, (argv) => {
          argv.foo.should.equal('bar')
          argv._.should.contain('baz')
          return done()
        })
        .argv
    })

    it('executes default command if defined positional arguments and only command', (done) => {
      yargs('baz --foo bar')
        .command('* <target>', 'default command', noop, (argv) => {
          argv.foo.should.equal('bar')
          argv.target.should.equal('baz')
          return done()
        })
        .argv
    })

    it('allows $0 as an alias for a default command', (done) => {
      yargs('9999')
        .command('$0 [port]', 'default command', noop, (argv) => {
          argv.port.should.equal(9999)
          return done()
        })
        .argv
    })

    it('does not execute default command if another command is provided', (done) => {
      yargs('run bcoe --foo bar')
        .command('*', 'default command', noop, (argv) => {})
        .command('run <name>', 'run command', noop, (argv) => {
          argv.name.should.equal('bcoe')
          argv.foo.should.equal('bar')
          return done()
        })
        .argv
    })

    it('allows default command to be set as alias', (done) => {
      yargs('bcoe --foo bar')
        .command(['start <name>', '*'], 'start command', noop, (argv) => {
          argv._.should.eql([])
          argv.name.should.equal('bcoe')
          argv.foo.should.equal('bar')
          return done()
        })
        .argv
    })

    it('allows command to be run when alias is default command', (done) => {
      yargs('start bcoe --foo bar')
        .command(['start <name>', '*'], 'start command', noop, (argv) => {
          argv._.should.eql(['start'])
          argv.name.should.equal('bcoe')
          argv.foo.should.equal('bar')
          return done()
        })
        .argv
    })

    it('the last default command set should take precedence', (done) => {
      yargs('bcoe --foo bar')
        .command(['first', '*'], 'override me', noop, noop)
        .command(['second <name>', '*'], 'start command', noop, (argv) => {
          argv._.should.eql([])
          argv.name.should.equal('bcoe')
          argv.foo.should.equal('bar')
          return done()
        })
        .argv
    })

    describe('strict', () => {
      it('executes default command when strict mode is enabled', (done) => {
        yargs('--foo bar')
          .command('*', 'default command', noop, (argv) => {
            argv.foo.should.equal('bar')
            return done()
          })
          .option('foo', {
            describe: 'a foo command'
          })
          .strict()
          .argv
      })

      it('allows default command aliases, when strict mode is enabled', (done) => {
        yargs('bcoe --foo bar')
          .command(['start <name>', '*'], 'start command', noop, (argv) => {
            argv._.should.eql([])
            argv.name.should.equal('bcoe')
            argv.foo.should.equal('bar')
            return done()
          })
          .strict()
          .option('foo', {
            describe: 'a foo command'
          })
          .argv
      })
    })
  })

  // addresses: https://github.com/yargs/yargs/issues/819
  it('should kick along [demand] configuration to commands', () => {
    let called = false
    const r = checkOutput(() => {
      yargs('foo')
        .command('foo', 'foo command', noop, (argv) => {
          called = true
        })
        .option('bar', {
          describe: 'a foo command',
          demand: true
        })
        .argv
    })
    called.should.equal(false)
    r.errors.should.match(/Missing required argument/)
  })

  it('should support numeric commands', () => {
    const output = []
    yargs('1')
      .command('1', 'numeric command', (yargs) => {
        output.push('1')
      })
      .argv
    output.should.include('1')
  })

  // see: https://github.com/yargs/yargs/issues/853
  it('should not execute command if it is proceeded by another positional argument', () => {
    let commandCalled = false
    yargs()
      .command('foo', 'foo command', noop, () => { commandCalled = true })
      .parse('bar foo', (err, argv) => {
        expect(err).to.equal(null)
        commandCalled.should.equal(false)
        argv._.should.eql(['bar', 'foo'])
      })
  })

  // see: https://github.com/yargs/yargs/issues/861 phew! that's an edge-case.
  it('should allow positional arguments for inner commands in strict mode, when no handler is provided', () => {
    yargs()
      .command('foo', 'outer command', (yargs) => {
        yargs.command('bar [optional]', 'inner command')
      })
      .strict()
      .parse('foo bar 33', (err, argv) => {
        expect(err).to.equal(null)
        argv.optional.should.equal(33)
        argv._.should.eql(['foo', 'bar'])
      })
  })

  describe('usage', () => {
    it('allows you to configure a default command', () => {
      yargs()
        .usage('$0 <port>', 'default command', (yargs) => {
          yargs.positional('port', {
            type: 'string'
          })
        })
        .parse('33', (err, argv) => {
          expect(err).to.equal(null)
          argv.port.should.equal('33')
        })
    })

    it('throws exception if default command does not have leading $0', () => {
      expect(() => {
        yargs()
          .usage('<port>', 'default command', (yargs) => {
            yargs.positional('port', {
              type: 'string'
            })
          })
      }).to.throw(/.*\.usage\(\) description must start with \$0.*/)
    })
  })

  // addresses https://github.com/yargs/yargs/issues/510
  it('fails when the promise returned by the command handler rejects', (done) => {
    const error = new Error()
    yargs('foo')
      .command('foo', 'foo command', noop, (yargs) => Promise.reject(error))
      .fail((msg, err) => {
        expect(msg).to.equal(null)
        expect(err).to.equal(error)
        done()
      })
      .argv
  })

  it('succeeds when the promise returned by the command handler resolves', (done) => {
    const handler = new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(true)
      }, 5)
    })
    const parsed = yargs('foo hello')
      .command('foo <pos>', 'foo command', () => {}, (yargs) => handler)
      .fail((msg, err) => {
        return done(Error('should not have been called'))
      })
      .argv

    handler.then(called => {
      called.should.equal(true)
      parsed.pos.should.equal('hello')
      return done()
    })
  })
})
