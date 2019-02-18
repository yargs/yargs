'use strict'
/* global describe, it, beforeEach, after */
const checkUsage = require('./helpers/utils').checkOutput
const yargs = require('../')

/* polyfill Promise for older Node.js */
require('es6-promise').polyfill()

require('chai').should()

describe('Completion', () => {
  beforeEach(() => {
    yargs.reset()
  })

  after(() => {
    yargs.reset()
  })

  describe('default completion behavior', () => {
    it('avoids repeating already included commands', () => {
      process.env.SHELL = '/bin/bash'
      const r = checkUsage(() => yargs(['./completion', '--get-yargs-completions', 'apple'])
        .command('foo', 'bar')
        .command('apple', 'banana')
        .argv
      )

      // should not suggest foo for completion unless foo is subcommand of apple
      r.logs.should.not.include('apple')
    })

    it('avoids repeating already included options', () => {
      const r = checkUsage(() => yargs(['./completion', '--get-yargs-completions', './completion', '--foo', '--'])
        .options({
          foo: { describe: 'foo option' },
          bar: { describe: 'bar option' }
        })
        .completion()
        .argv
      )

      r.logs.should.include('--bar')
      r.logs.should.not.include('--foo')
    })

    it('avoids repeating options whose aliases are already included', () => {
      const r = checkUsage(() => yargs(['./completion', '--get-yargs-completions', './completion', '--f', '--'])
        .options({
          foo: { describe: 'foo option', alias: 'f' },
          bar: { describe: 'bar option' }
        })
        .completion()
        .argv
      )

      r.logs.should.include('--bar')
      r.logs.should.not.include('--foo')
    })

    it('completes options for the correct command', () => {
      process.env.SHELL = '/bin/bash'
      const r = checkUsage(() => yargs(['./completion', '--get-yargs-completions', 'cmd2', '--o'])
        .help(false)
        .version(false)
        .command('cmd1', 'first command', (subYargs) => {
          subYargs.options({
            opt1: {
              describe: 'first option'
            }
          })
        })
        .command('cmd2', 'second command', (subYargs) => {
          subYargs.options({
            opt2: {
              describe: 'second option'
            }
          })
        })
        .completion()
        .argv
      )

      r.logs.should.have.length(1)
      r.logs.should.include('--opt2')
    })

    it('does not complete hidden commands', () => {
      process.env.SHELL = '/bin/bash'
      const r = checkUsage(() => yargs(['./completion', '--get-yargs-completions', 'cmd'])
        .command('cmd1', 'first command')
        .command('cmd2', false)
        .completion('completion', false)
        .argv
      )

      r.logs.should.have.length(1)
      r.logs.should.include('cmd1')
    })

    it('does not include possitional arguments', function () {
      process.env.SHELL = '/bin/bash'
      var r = checkUsage(function () {
        return yargs(['./completion', '--get-yargs-completions', 'cmd'])
          .command('cmd1 [arg]', 'first command')
          .command('cmd2 <arg>', 'second command')
          .completion('completion', false)
          .argv
      })

      r.logs.should.have.length(2)
      r.logs.should.include('cmd1')
      r.logs.should.include('cmd2')
    })

    it('works if command has no options', () => {
      process.env.SHELL = '/bin/bash'
      const r = checkUsage(() => yargs(['./completion', '--get-yargs-completions', 'foo', '--b'])
        .help(false)
        .version(false)
        .command('foo', 'foo command', (subYargs) => {
          return subYargs.completion().parse()
        })
        .completion()
        .argv
      )

      r.logs.should.have.length(0)
    })

    it("returns arguments as completion suggestion, if next contains '-'", () => {
      process.env.SHELL = '/bin/basg'
      const r = checkUsage(() => yargs(['./usage', '--get-yargs-completions', '-f'])
        .option('foo', {
          describe: 'foo option'
        })
        .command('bar', 'bar command')
        .completion()
        .argv
      )

      r.logs.should.include('--foo')
      r.logs.should.not.include('bar')
    })
  })

  describe('generateCompletionScript()', () => {
    it('replaces completion command variable with custom completion command in script', () => {
      const r = checkUsage(() => yargs([]).completion('flintlock')
        .showCompletionScript(), ['ndm'])

      r.logs[0].should.match(/ndm flintlock >>/)
    })

    it('if $0 has a .js extension, a ./ prefix is added', () => {
      const r = checkUsage(() => yargs([])
        .showCompletionScript(), ['test.js'])

      r.logs[0].should.match(/\.\/test.js --get-yargs-completions/)
    })
  })

  describe('completion()', () => {
    it('shows completion script if command registered with completion(cmd) is called', () => {
      const r = checkUsage(() => yargs(['completion'])
        .completion('completion')
        .argv, ['ndm'])

      r.logs[0].should.match(/ndm --get-yargs-completions/)
    })

    it('allows a custom function to be registered for completion', () => {
      const r = checkUsage(() => yargs(['--get-yargs-completions'])
        .help('h')
        .completion('completion', (current, argv) => ['cat', 'bat'])
        .argv
      )

      r.logs.should.include('cat')
      r.logs.should.include('bat')
    })

    it('passes current arg for completion and the parsed arguments thus far to custom function', () => {
      const r = checkUsage(() => yargs(['ndm', '--get-yargs-completions', '--cool', 'ma'])
        .completion('completion', (current, argv) => {
          if (current === 'ma' && argv.cool) return ['success!']
        })
        .argv
      )

      r.logs.should.include('success!')
    })

    it('if a promise is returned, completions can be asynchronous', (done) => {
      checkUsage((cb) => {
        yargs(['--get-yargs-completions'])
          .completion('completion', (current, argv) => new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(['apple', 'banana'])
            }, 10)
          }))
          .parse()
      }, null, (err, r) => {
        if (err) throw err
        r.logs.should.include('apple')
        r.logs.should.include('banana')
        return done()
      })
    })

    it('if a promise is returned, errors are handled', (done) => {
      checkUsage(() => {
        yargs(['--get-yargs-completions'])
          .completion('completion', (current, argv) => new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(new Error('Test'))
            }, 10)
          }))
          .parse()
      }, null, (err) => {
        err.message.should.equal('Test')
        return done()
      })
    })

    it('if a callback parameter is provided, completions can be asynchronous', (done) => {
      checkUsage(() => {
        yargs(['--get-yargs-completions'])
          .completion('completion', (current, argv, completion) => {
            setTimeout(() => {
              completion(['apple', 'banana'])
            }, 10)
          })
          .parse()
      }, null, (err, r) => {
        if (err) throw err
        r.logs.should.include('apple')
        r.logs.should.include('banana')
        return done()
      })
    })
  })

  describe('bash', () => {
    it('returns a list of commands as completion suggestions', () => {
      process.env.SHELL = '/bin/bash'
      const r = checkUsage(() => yargs(['./completion', '--get-yargs-completions', ''])
        .command('foo', 'bar')
        .command('apple', 'banana')
        .completion()
        .argv
      )

      r.logs.should.include('apple')
      r.logs.should.include('foo')
    })

    it('avoids interruption from command recommendations', () => {
      process.env.SHELL = '/bin/bash'
      const r = checkUsage(() =>
        yargs(['./completion', '--get-yargs-completions', './completion', 'a'])
          .command('apple', 'fruit')
          .command('aardvark', 'animal')
          .recommendCommands()
          .completion()
          .argv
      )

      r.errors.should.deep.equal([])
      r.logs.should.include('apple')
      r.logs.should.include('aardvark')
    })

    it('avoids interruption from default command', () => {
      process.env.SHELL = '/bin/bash'
      const r = checkUsage(() =>
        yargs(['./usage', '--get-yargs-completions', './usage', ''])
          .usage('$0 [thing]', 'skipped', subYargs => {
            subYargs.command('aardwolf', 'is a thing according to google')
          })
          .command('aardvark', 'animal')
          .completion()
          .argv
      )

      r.errors.should.deep.equal([])
      r.logs.should.not.include('aardwolf')
      r.logs.should.include('aardvark')
    })

    it('completes options for a command', () => {
      process.env.SHELL = '/bin/bash'
      const r = checkUsage(() => yargs(['./completion', '--get-yargs-completions', 'foo', '--b'])
        .command('foo', 'foo command', subYargs => subYargs.options({
          bar: {
            describe: 'bar option'
          }
        })
          .help(true)
          .version(false))
        .completion()
        .argv
      )

      r.logs.should.have.length(2)
      r.logs.should.include('--bar')
      r.logs.should.include('--help')
    })

    describe('generateCompletionScript()', () => {
      it('replaces application variable with $0 in script', () => {
        process.env.SHELL = '/bin/bash'
        const r = checkUsage(() => yargs([])
          .showCompletionScript(), ['ndm'])

        r.logs[0].should.match(/bashrc/)
        r.logs[0].should.match(/ndm --get-yargs-completions/)
      })
    })

    // fixes for #177.
    it('does not apply validation when --get-yargs-completions is passed in', () => {
      process.env.SHELL = '/bin/bash'
      const r = checkUsage(() => {
        try {
          return yargs(['./completion', '--get-yargs-completions', '--'])
            .option('foo', {})
            .completion()
            .strict()
            .argv
        } catch (e) {
          console.log(e.message)
        }
      })

      r.errors.length.should.equal(0)
      r.logs.should.include('--foo')
    })

    describe('getCompletion()', () => {
      it('returns default completion to callback', () => {
        process.env.SHELL = '/bin/bash'
        const r = checkUsage(() => {
          yargs()
            .command('foo', 'bar')
            .command('apple', 'banana')
            .completion()
            .getCompletion([''], (completions) => {
              ;(completions || []).forEach((completion) => {
                console.log(completion)
              })
            })
        })

        r.logs.should.include('apple')
        r.logs.should.include('foo')
      })
    })
  })

  describe('zsh', () => {
    it('returns a list of commands as completion suggestions', () => {
      process.env.SHELL = '/bin/zsh'
      const r = checkUsage(() => yargs(['./completion', '--get-yargs-completions', ''])
        .command('foo', 'bar')
        .command('apple', 'banana')
        .completion()
        .argv
      )

      r.logs.should.include('apple:banana')
      r.logs.should.include('foo:bar')
    })

    it('avoids interruption from command recommendations', () => {
      process.env.SHELL = '/bin/zsh'
      const r = checkUsage(() =>
        yargs(['./completion', '--get-yargs-completions', './completion', 'a'])
          .command('apple', 'fruit')
          .command('aardvark', 'animal')
          .recommendCommands()
          .completion()
          .argv
      )

      r.errors.should.deep.equal([])
      r.logs.should.include('apple:fruit')
      r.logs.should.include('aardvark:animal')
    })

    it('avoids interruption from default command', () => {
      process.env.SHELL = '/bin/zsh'
      const r = checkUsage(() =>
        yargs(['./usage', '--get-yargs-completions', './usage', ''])
          .usage('$0 [thing]', 'skipped', subYargs => {
            subYargs.command('aardwolf', 'is a thing according to google')
          })
          .command('aardvark', 'animal')
          .completion()
          .argv
      )

      r.errors.should.deep.equal([])
      r.logs.should.not.include('aardwolf')
      r.logs.should.include('aardvark:animal')
    })

    it('completes options for a command', () => {
      process.env.SHELL = '/bin/zsh'
      const r = checkUsage(() => yargs(['./completion', '--get-yargs-completions', 'foo', '--b'])
        .command('foo', 'foo command', subYargs => subYargs.options({
          bar: {
            describe: 'bar option'
          }
        })
          .help(true)
          .version(false))
        .completion()
        .argv
      )

      r.logs.should.have.length(2)
      r.logs.should.include('--bar:bar option')
      r.logs.should.include('--help:Show help')
    })

    it('replaces application variable with $0 in script', () => {
      process.env.SHELL = '/bin/zsh'
      const r = checkUsage(() => yargs([])
        .showCompletionScript(), ['ndm'])

      r.logs[0].should.match(/zshrc/)
      r.logs[0].should.match(/ndm --get-yargs-completions/)
    })

    describe('getCompletion()', () => {
      it('returns default completion to callback', () => {
        process.env.SHELL = '/bin/zsh'
        const r = checkUsage(() => {
          yargs()
            .command('foo', 'bar')
            .command('apple', 'banana')
            .completion()
            .getCompletion([''], (completions) => {
              ;(completions || []).forEach((completion) => {
                console.log(completion)
              })
            })
        })

        r.logs.should.include('apple:banana')
        r.logs.should.include('foo:bar')
      })
    })

    it('does not apply validation when --get-yargs-completions is passed in', () => {
      process.env.SHELL = '/bin/zsh'
      const r = checkUsage(() => {
        try {
          return yargs(['./completion', '--get-yargs-completions', '--'])
            .option('foo', { 'describe': 'bar' })
            .completion()
            .strict()
            .argv
        } catch (e) {
          console.log(e.message)
        }
      })

      r.errors.length.should.equal(0)
      r.logs.should.include('--foo:bar')
    })

    it('bails out early when full command matches', () => {
      process.env.SHELL = '/bin/zsh'
      const r = checkUsage(() => {
        try {
          return yargs(['./completion', '--get-yargs-completions', 'dream'])
            .commandDir('./fixtures/cmddir', { 'recurse': true })
            .demand(1)
            .strict()
            .completion()
            .argv
        } catch (e) {
          console.log(e.message)
        }
      })
      r.errors.length.should.equal(0)
      r.logs.should.include('of-memory:Dream about a specific memory')
    })
  })
})
