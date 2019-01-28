'use strict'
/* global describe, it, before, after */

const spawn = require('cross-spawn')
const path = require('path')
const which = require('which')
const rimraf = require('rimraf')
const cpr = require('cpr')
const fs = require('fs')

require('chai').should()

describe('integration tests', () => {
  it('should run as a shell script with no arguments', (done) => {
    testArgs('./bin.js', [], done)
  })

  it('should run as a shell script with arguments', (done) => {
    testArgs('./bin.js', [ 'a', 'b', 'c' ], done)
  })

  it('should run as a node script with no arguments', (done) => {
    testArgs('node bin.js', [], done)
  })

  it('should run as a node script with arguments', (done) => {
    testArgs('node bin.js', [ 'x', 'y', 'z' ], done)
  })

  describe('path returned by "which"', () => {
    it('should match the actual path to the script file', (done) => {
      which('node', (err, resolvedPath) => {
        if (err) return done(err)
        testArgs(`${resolvedPath.replace('Program Files (x86)', 'Progra~2')
          .replace('Program Files', 'Progra~1')} bin.js`, [], done)
      })
    })

    it('should match the actual path to the script file, with arguments', (done) => {
      which('node', (err, resolvedPath) => {
        if (err) return done(err)
        testArgs(`${resolvedPath.replace('Program Files (x86)', 'Progra~2')
          .replace('Program Files', 'Progra~1')} bin.js`, [ 'q', 'r' ], done)
      })
    })
  })

  // see #177
  it('allows --help to be completed without returning help message', (done) => {
    testCmd('./bin.js', [ '--get-yargs-completions', '--h' ], (code, stdout) => {
      if (code) {
        done(new Error(`cmd exited with code ${code}`))
        return
      }

      stdout.should.not.match(/generate bash completion script/)
      stdout.should.match(/--help/)
      return done()
    })
  })

  // see #497
  it('flushes all output when --help is executed', function (done) {
    if (process.platform === 'win32' && process.version.match(/^v0.10/)) {
      // Doesn’t work in CI for some reason.
      return this.skip()
    }

    testCmd('./issue-497.js', [ '--help' ], (code, stdout) => {
      if (code) {
        done(new Error(`cmd exited with code ${code}`))
        return
      }

      stdout.should.match(/--o999/)
      stdout.should.not.match(/never get here/)
      return done()
    })
  })

  it('correctly fills positional command args with preceding option', (done) => {
    testCmd('./opt-assignment-and-positional-command-arg.js', ['--foo', 'fOo', 'bar', 'bAz'], (code, stdout) => {
      if (code) {
        done(new Error(`cmd exited with code ${code}`))
        return
      }

      const argv = JSON.parse(stdout)
      argv._.should.deep.equal(['bar'])
      argv.foo.should.equal('fOo')
      argv.baz.should.equal('bAz')
      return done()
    })
  })

  it('correctly fills positional command args with = assignment in preceding option', (done) => {
    testCmd('./opt-assignment-and-positional-command-arg.js', ['--foo=fOo', 'bar', 'bAz'], (code, stdout) => {
      if (code) {
        done(new Error(`cmd exited with code ${code}`))
        return
      }

      const argv = JSON.parse(stdout)
      argv._.should.deep.equal(['bar'])
      argv.foo.should.equal('fOo')
      argv.baz.should.equal('bAz')
      return done()
    })
  })

  if (process.platform !== 'win32') {
    describe('load root package.json', () => {
      before(function (done) {
        this.timeout(10000)
        // create a symlinked, and a physical copy of yargs in
        // our fixtures directory, so that we can test that the
        // nearest package.json is appropriately loaded.
        cpr('./', './test/fixtures/yargs', {
          filter: /node_modules|example|test|package\.json/
        }, () => {
          fs.symlinkSync(process.cwd(), './test/fixtures/yargs-symlink')
          return done()
        })
      })

      describe('version #', () => {
        it('defaults to appropriate version # when yargs is installed normally', (done) => {
          testCmd('./normal-bin.js', [ '--version' ], (code, stdout) => {
            if (code) {
              return done(new Error(`cmd exited with code ${code}`))
            }

            stdout.should.match(/9\.9\.9/)
            return done()
          })
        })

        it('defaults to appropriate version # when yargs is symlinked', (done) => {
          testCmd('./symlink-bin.js', [ '--version' ], (code, stdout) => {
            if (code) {
              return done(new Error(`cmd exited with code ${code}`))
            }

            stdout.should.match(/9\.9\.9/)
            return done()
          })
        })
      })

      describe('parser settings', () => {
        it('reads parser config settings when yargs is installed normally', (done) => {
          testCmd('./normal-bin.js', [ '--foo.bar' ], (code, stdout) => {
            if (code) {
              return done(new Error(`cmd exited with code ${code}`))
            }

            stdout.should.match(/foo\.bar/)
            return done()
          })
        })

        it('reads parser config settings when yargs is installed as a symlink', (done) => {
          testCmd('./symlink-bin.js', [ '--foo.bar' ], (code, stdout) => {
            if (code) {
              return done(new Error(`cmd exited with code ${code}`))
            }

            stdout.should.match(/foo\.bar/)
            return done()
          })
        })

        it('reads parser config settings when somebody obscures require.main', (done) => {
          testCmd('./no-require-main.js', [ '--foo.bar' ], (code, stdout) => {
            if (code) {
              return done(new Error(`cmd exited with code ${code}`))
            }

            stdout.should.match(/foo\.bar/)
            return done()
          })
        })

        it('reads parser config settings when entry file has no extension', (done) => {
          testCmd('./no-extension', [ '--foo.bar' ], (code, stdout) => {
            if (code) {
              return done(new Error(`cmd exited with code ${code}`))
            }

            stdout.should.match(/foo\.bar/)
            return done()
          })
        })

        it('is overridden by yargs.parserConfiguration', (done) => {
          testCmd('./configured-bin.js', [ '--foo.bar', '--no-baz' ], (code, stdout) => {
            if (code) {
              return done(new Error(`cmd exited with code ${code}`))
            }

            stdout.should.not.match(/foo\.bar/)
            stdout.should.match(/noBaz/)
            return done()
          })
        })
      })

      after(() => {
        rimraf.sync('./test/fixtures/yargs')
        fs.unlinkSync('./test/fixtures/yargs-symlink')
      })
    })
  }
})

function testCmd (cmd, args, cb) {
  const cmds = cmd.split(' ')

  const bin = spawn(cmds[0], cmds.slice(1).concat(args.map(String)), {
    cwd: path.join(__dirname, '/fixtures')
  })

  let stdout = ''
  bin.stdout.setEncoding('utf8')
  bin.stdout.on('data', (str) => { stdout += str })

  let stderr = ''
  bin.stderr.setEncoding('utf8')
  bin.stderr.on('data', (str) => { stderr += str })

  bin.on('close', (code) => {
    cb(code, stdout, stderr)
  })
}

function testArgs (cmd, args, done) {
  testCmd(cmd, args, (code, stdout, stderr) => {
    if (code) {
      done(new Error(`cmd ${cmd} ${args} exited with code ${code}\n${stdout}\n${stderr}`))
      return
    }

    const _ = JSON.parse(stdout)
    _.map(String).should.deep.equal(args.map(String))
    done()
  })
}
