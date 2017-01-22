/* global describe, it, beforeEach */
var checkUsage = require('./helpers/utils').checkOutput
var yargs = require('../')

/* polyfill Promise for older Node.js */
require('es6-promise').polyfill()

require('chai').should()

describe('Completion', function () {
  beforeEach(function () {
    yargs.reset()
  })

  describe('default completion behavior', function () {
    it('it returns a list of commands as completion suggestions', function () {
      var r = checkUsage(function () {
        return yargs(['./completion', '--get-yargs-completions', ''])
          .command('foo', 'bar')
          .command('apple', 'banana')
          .completion()
          .argv
      })

      r.logs.should.include('apple')
      r.logs.should.include('foo')
    })

    it('avoids repeating already included commands', function () {
      var r = checkUsage(function () {
        return yargs(['./completion', '--get-yargs-completions', 'apple'])
          .command('foo', 'bar')
          .command('apple', 'banana')
          .argv
      })

      // should not suggest foo for completion unless foo is subcommand of apple
      r.logs.should.not.include('apple')
    })

    it('avoids repeating already included options', function () {
      var r = checkUsage(function () {
        return yargs(['./completion', '--get-yargs-completions', './completion', '--foo', '--'])
          .options({
            foo: {describe: 'foo option'},
            bar: {describe: 'bar option'}
          })
          .completion()
          .argv
      })

      r.logs.should.include('--bar')
      r.logs.should.not.include('--foo')
    })

    it('avoids repeating options whose aliases are already included', function () {
      var r = checkUsage(function () {
        return yargs(['./completion', '--get-yargs-completions', './completion', '--f', '--'])
            .options({
              foo: {describe: 'foo option', alias: 'f'},
              bar: {describe: 'bar option'}
            })
            .completion()
            .argv
      })

      r.logs.should.include('--bar')
      r.logs.should.not.include('--foo')
    })

    it('completes options for a command', function () {
      var r = checkUsage(function () {
        return yargs(['./completion', '--get-yargs-completions', 'foo', '--b'])
          .command('foo', 'foo command', function (subYargs) {
            return subYargs.options({
              bar: {
                describe: 'bar option'
              }
            })
            .help('help')
          })
          .completion()
          .argv
      })

      r.logs.should.have.length(2)
      r.logs.should.include('--bar')
      r.logs.should.include('--help')
    })

    it('completes options for the correct command', function () {
      var r = checkUsage(function () {
        return yargs(['./completion', '--get-yargs-completions', 'cmd2', '--o'])
          .command('cmd1', 'first command', function (subYargs) {
            subYargs.options({
              opt1: {
                describe: 'first option'
              }
            })
          })
          .command('cmd2', 'second command', function (subYargs) {
            subYargs.options({
              opt2: {
                describe: 'second option'
              }
            })
          })
          .completion()
          .argv
      })

      r.logs.should.have.length(1)
      r.logs.should.include('--opt2')
    })

    it('does not complete hidden commands', function () {
      var r = checkUsage(function () {
        return yargs(['./completion', '--get-yargs-completions', 'cmd'])
          .command('cmd1', 'first command')
          .command('cmd2', false)
          .completion('completion', false)
          .argv
      })

      r.logs.should.have.length(1)
      r.logs.should.include('cmd1')
    })

    it('works if command has no options', function () {
      var r = checkUsage(function () {
        return yargs(['./completion', '--get-yargs-completions', 'foo', '--b'])
          .command('foo', 'foo command', function (subYargs) {
            subYargs.completion().argv
          })
          .completion()
          .argv
      })

      r.logs.should.have.length(0)
    })

    it("returns arguments as completion suggestion, if next contains '-'", function () {
      var r = checkUsage(function () {
        return yargs(['./usage', '--get-yargs-completions', '-f'])
        .option('foo', {
          describe: 'foo option'
        })
        .command('bar', 'bar command')
        .completion()
        .argv
      })

      r.logs.should.include('--foo')
      r.logs.should.not.include('bar')
    })
  })

  describe('generateCompletionScript()', function () {
    it('replaces application variable with $0 in script', function () {
      var r = checkUsage(function () {
        return yargs([])
          .showCompletionScript()
      }, ['ndm'])

      r.logs[0].should.match(/ndm --get-yargs-completions/)
    })

    it('if $0 has a .js extension, a ./ prefix is added', function () {
      var r = checkUsage(function () {
        return yargs([])
          .showCompletionScript()
      }, ['test.js'])

      r.logs[0].should.match(/\.\/test.js --get-yargs-completions/)
    })
  })

  describe('completion()', function () {
    it('shows completion script if command registered with completion(cmd) is called', function () {
      var r = checkUsage(function () {
        return yargs(['completion'])
          .completion('completion')
          .argv
      }, ['ndm'])

      r.logs[0].should.match(/ndm --get-yargs-completions/)
    })

    it('allows a custom function to be registered for completion', function () {
      var r = checkUsage(function () {
        return yargs(['--get-yargs-completions'])
        .help('h')
        .completion('completion', function (current, argv) {
          return ['cat', 'bat']
        })
        .argv
      })

      r.logs.should.include('cat')
      r.logs.should.include('bat')
    })

    it('passes current arg for completion and the parsed arguments thus far to custom function', function () {
      var r = checkUsage(function () {
        return yargs(['ndm', '--get-yargs-completions', '--cool', 'ma'])
        .completion('completion', function (current, argv) {
          if (current === 'ma' && argv.cool) return ['success!']
        })
        .argv
      })

      r.logs.should.include('success!')
    })

    it('if a promise is returned, completions can be asynchronous', function (done) {
      checkUsage(function (cb) {
        yargs(['--get-yargs-completions'])
        .completion('completion', function (current, argv) {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve(['apple', 'banana'])
            }, 10)
          })
        })
        .argv
      }, null, function (err, r) {
        if (err) throw err
        r.logs.should.include('apple')
        r.logs.should.include('banana')
        return done()
      })
    })

    it('if a promise is returned, errors are handled', function (done) {
      checkUsage(function () {
        yargs(['--get-yargs-completions'])
        .completion('completion', function (current, argv) {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              reject(new Error('Test'))
            }, 10)
          })
        })
        .argv
      }, null, function (err) {
        err.message.should.equal('Test')
        return done()
      })
    })

    it('if a callback parameter is provided, completions can be asynchronous', function (done) {
      checkUsage(function () {
        yargs(['--get-yargs-completions'])
        .completion('completion', function (current, argv, cb) {
          setTimeout(function () {
            cb(['apple', 'banana'])
          }, 10)
        })
        .argv
      }, null, function (err, r) {
        if (err) throw err
        r.logs.should.include('apple')
        r.logs.should.include('banana')
        return done()
      })
    })
  })

  describe('getCompletion()', function () {
    it('returns default completion to callback', function () {
      var r = checkUsage(function () {
        yargs()
          .command('foo', 'bar')
          .command('apple', 'banana')
          .completion()
          .getCompletion([''], function (completions) {
            ;(completions || []).forEach(function (completion) {
              console.log(completion)
            })
          })
      })

      r.logs.should.include('apple')
      r.logs.should.include('foo')
    })
  })

  // fixes for #177.
  it('does not apply validation when --get-yargs-completions is passed in', function () {
    var r = checkUsage(function () {
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
})
