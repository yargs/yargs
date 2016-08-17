/* global describe, it, before, after */

var spawn = require('cross-spawn')
var path = require('path')
var which = require('which')
var rimraf = require('rimraf')
var cpr = require('cpr')
var fs = require('fs')

require('chai').should()

describe('integration tests', function () {
  it('should run as a shell script with no arguments', function (done) {
    testArgs('./bin.js', [], done)
  })

  it('should run as a shell script with arguments', function (done) {
    testArgs('./bin.js', [ 'a', 'b', 'c' ], done)
  })

  it('should run as a node script with no arguments', function (done) {
    testArgs('node bin.js', [], done)
  })

  it('should run as a node script with arguments', function (done) {
    testArgs('node bin.js', [ 'x', 'y', 'z' ], done)
  })

  describe('path returned by "which"', function () {
    it('should match the actual path to the script file', function (done) {
      which('node', function (err, path) {
        if (err) return done(err)
        testArgs(path.replace('Program Files (x86)', 'Progra~2')
                     .replace('Program Files', 'Progra~1') + ' bin.js', [], done)
      })
    })

    it('should match the actual path to the script file, with arguments', function (done) {
      which('node', function (err, path) {
        if (err) return done(err)
        testArgs(path.replace('Program Files (x86)', 'Progra~2')
                     .replace('Program Files', 'Progra~1') + ' bin.js', [ 'q', 'r' ], done)
      })
    })
  })

  // see #177
  it('allows --help to be completed without returning help message', function (done) {
    testCmd('./bin.js', [ '--get-yargs-completions', '--h' ], function (code, stdout) {
      if (code) {
        done(new Error('cmd exited with code ' + code))
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

    testCmd('./issue-497.js', [ '--help' ], function (code, stdout) {
      if (code) {
        done(new Error('cmd exited with code ' + code))
        return
      }

      stdout.should.match(/--o999/)
      stdout.should.not.match(/never get here/)
      return done()
    })
  })

  it('correctly fills positional command args with preceding option', function (done) {
    testCmd('./opt-assignment-and-positional-command-arg.js', ['--foo', 'fOo', 'bar', 'bAz'], function (code, stdout) {
      if (code) {
        done(new Error('cmd exited with code ' + code))
        return
      }

      var argv = JSON.parse(stdout)
      argv._.should.deep.equal(['bar'])
      argv.foo.should.equal('fOo')
      argv.baz.should.equal('bAz')
      return done()
    })
  })

  it('correctly fills positional command args with = assignment in preceding option', function (done) {
    testCmd('./opt-assignment-and-positional-command-arg.js', ['--foo=fOo', 'bar', 'bAz'], function (code, stdout) {
      if (code) {
        done(new Error('cmd exited with code ' + code))
        return
      }

      var argv = JSON.parse(stdout)
      argv._.should.deep.equal(['bar'])
      argv.foo.should.equal('fOo')
      argv.baz.should.equal('bAz')
      return done()
    })
  })

  if (process.platform !== 'win32') {
    describe('load root package.json', function () {
      before(function (done) {
        this.timeout(10000)
        // create a symlinked, and a physical copy of yargs in
        // our fixtures directory, so that we can test that the
        // nearest package.json is appropriately loaded.
        cpr('./', './test/fixtures/yargs', {
          filter: /node_modules|example|test|package\.json/
        }, function () {
          fs.symlinkSync(process.cwd(), './test/fixtures/yargs-symlink')
          return done()
        })
      })

      describe('version #', function () {
        it('defaults to appropriate version # when yargs is installed normally', function (done) {
          testCmd('./normal-bin.js', [ '--version' ], function (code, stdout) {
            if (code) {
              return done(new Error('cmd exited with code ' + code))
            }

            stdout.should.match(/9\.9\.9/)
            return done()
          })
        })

        it('defaults to appropriate version # when yargs is symlinked', function (done) {
          testCmd('./symlink-bin.js', [ '--version' ], function (code, stdout) {
            if (code) {
              return done(new Error('cmd exited with code ' + code))
            }

            stdout.should.match(/9\.9\.9/)
            return done()
          })
        })
      })

      describe('parser settings', function (done) {
        it('reads parser config settings when yargs is installed normally', function (done) {
          testCmd('./normal-bin.js', [ '--foo.bar' ], function (code, stdout) {
            if (code) {
              return done(new Error('cmd exited with code ' + code))
            }

            stdout.should.match(/foo\.bar/)
            return done()
          })
        })

        it('reads parser config settings when yargs is installed as a symlink', function (done) {
          testCmd('./symlink-bin.js', [ '--foo.bar' ], function (code, stdout) {
            if (code) {
              return done(new Error('cmd exited with code ' + code))
            }

            stdout.should.match(/foo\.bar/)
            return done()
          })
        })
      })

      after(function () {
        rimraf.sync('./test/fixtures/yargs')
        fs.unlinkSync('./test/fixtures/yargs-symlink')
      })
    })
  }
})

function testCmd (cmd, args, cb) {
  var oldDir = process.cwd()
  process.chdir(path.join(__dirname, '/fixtures'))

  var cmds = cmd.split(' ')

  var bin = spawn(cmds[0], cmds.slice(1).concat(args.map(String)))
  process.chdir(oldDir)

  var stdout = ''
  bin.stdout.setEncoding('utf8')
  bin.stdout.on('data', function (str) { stdout += str })

  var stderr = ''
  bin.stderr.setEncoding('utf8')
  bin.stderr.on('data', function (str) { stderr += str })

  bin.on('close', function (code) {
    cb(code, stdout, stderr)
  })
}

function testArgs (cmd, args, done) {
  testCmd(cmd, args, function (code, stdout, stderr) {
    if (code) {
      done(new Error('cmd ' + cmd + ' ' + args + ' exited with code ' + code +
          '\n' + stdout + '\n' + stderr))
      return
    }

    var _ = JSON.parse(stdout)
    _.map(String).should.deep.equal(args.map(String))
    done()
  })
}
