/* global describe, it, before, after */

var spawn = require('win-spawn')
var which = require('which')
var rimraf = require('rimraf')
var cpr = require('cpr')
var fs = require('fs')

require('chai').should()

describe('integration tests', function () {
  it('should run as a shell script with no arguments', function (done) {
    testCmd('./bin.js', [], done)
  })

  it('should run as a shell script with arguments', function (done) {
    testCmd('./bin.js', [ 'a', 'b', 'c' ], done)
  })

  it('should run as a node script with no arguments', function (done) {
    testCmd('node bin.js', [], done)
  })

  it('should run as a node script with arguments', function (done) {
    testCmd('node bin.js', [ 'x', 'y', 'z' ], done)
  })

  describe('path returned by "which"', function () {
    it('should match the actual path to the script file', function (done) {
      which('node', function (err, path) {
        if (err) return done(err)
        testCmd(path.replace('Program Files', 'Progra~1') + ' bin.js', [], done)
      })
    })

    it('should match the actual path to the script file, with arguments', function (done) {
      which('node', function (err, path) {
        if (err) return done(err)
        testCmd(path.replace('Program Files', 'Progra~1') + ' bin.js', [ 'q', 'r' ], done)
      })
    })
  })

  // see #177
  it('allows --help to be completed without returning help message', function (done) {
    testCmd('./bin.js', [ '--get-yargs-completions', '--help' ], function (buf) {
      buf.should.not.match(/generate bash completion script/)
      buf.should.match(/--help/)
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
          testCmd('./normal-bin.js', [ '--version' ], function (buf) {
            buf.should.match(/9\.9\.9/)
            return done()
          })
        })

        it('defaults to appropriate version # when yargs is symlinked', function (done) {
          testCmd('./symlink-bin.js', [ '--version' ], function (buf) {
            buf.should.match(/9\.9\.9/)
            return done()
          })
        })
      })

      describe('parser settings', function (done) {
        it('reads parser config settings when yargs is installed normally', function (done) {
          testCmd('./normal-bin.js', [ '--foo.bar' ], function (buf) {
            buf.should.match(/foo\.bar/)
            return done()
          })
        })

        it('reads parser config settings when yargs is installed as a symlink', function (done) {
          testCmd('./symlink-bin.js', [ '--foo.bar' ], function (buf) {
            buf.should.match(/foo\.bar/)
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

function testCmd (cmd, args, done) {
  var oldDir = process.cwd()
  process.chdir(__dirname + '/fixtures')

  var cmds = cmd.split(' ')

  var bin = spawn(cmds[0], cmds.slice(1).concat(args.map(String)))
  process.chdir(oldDir)

  bin.stderr.on('data', done)

  bin.stdout.on('data', function (buf) {
    // hack to allow us to assert against completion suggestions.
    if (~args.indexOf('--get-yargs-completions') ||
      ~args.indexOf('--version') ||
      ~args.indexOf('--foo.bar')) return done(buf.toString())

    var _ = JSON.parse(buf.toString())
    _.map(String).should.deep.equal(args.map(String))
    done()
  })
}
