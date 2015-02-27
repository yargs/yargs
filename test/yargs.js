var should = require('chai').should(),
    expect = require('chai').expect,
    checkOutput = require('./helpers/utils').checkOutput,
    yargs = require('../'),
    path = require('path');

describe('yargs dsl tests', function () {
    it('should use bin name for $0, eliminating path', function () {
      process.argv[1] = '/usr/local/bin/ndm';
      process.env._ = '/usr/local/bin/ndm';
      process.execPath = '/usr/local/bin/ndm';
      var argv = yargs([]).argv;
      argv['$0'].should.eql('ndm');
    });

    it('accepts an object for aliases', function() {
      var argv = yargs([])
        .alias({
          cool: 'cat'
        })
        .default('cool', 33)
        .argv

      argv.cat.should.eql(33);
    });

    it('accepts an object for implies', function() {
      var r = checkOutput(function () {
        return yargs(['--x=33'])
          .implies({
            x: 'y'
          })
          .argv
      });

      r.errors[1].should.match(/Implications failed/)
    });

    it('accepts an object for describes', function() {
      var r = checkOutput(function () {
        return yargs([])
          .describe({
            x: 'really cool key'
          })
          .demand('x')
          .wrap(null)
          .argv
      });

      r.errors[0].should.match(/really cool key/)
    });

    it('treats usage as alias for options, if object provided as first argument', function() {
      var argv = yargs([])
        .usage({
          a: {
            default: 99
          }
        })
        .argv;

      argv.a.should.eql(99);
    });

    it('a function can be provided, to execute when a parsing failure occurs', function(done) {
      yargs(['--x=33'])
        .implies({
          x: 'y'
        })
        .fail(function(msg) {
          msg.should.match(/Implications failed/);
          return done();
        })
        .argv;
    });

    it('should set alias to string if option is string', function() {
      var argv = yargs(['--cat=99'])
        .options('c', {
          alias: 'cat',
          string: true
        })
        .argv

        argv.cat.should.eql('99');
        argv.c.should.eql('99');
    });

    describe('showHelpOnFail', function() {
        it('should display custom failure message, if string is provided as first argument', function() {
          var r = checkOutput(function () {
            return yargs([])
              .showHelpOnFail('pork chop sandwiches')
              .demand('cat')
              .argv;
          });

          r.errors[3].should.match(/pork chop sandwiches/);
        });

        it('calling with no arguments should default to displaying help', function() {
          var r = checkOutput(function () {
            return yargs([])
              .showHelpOnFail()
              .demand('cat')
              .argv;
          });

          r.errors[1].should.match(/required arguments/);
        });
    });

    describe('exitProcess', function() {
        it('throws an execption when a failure occurs, if exitProcess is set to false', function() {
          checkOutput(function () {
            expect(function() {
              var argv = yargs([])
                .demand('cat')
                .showHelpOnFail(false)
                .exitProcess(false)
                .argv;
            }).to.throw(/Missing required arguments/);
          });
        });

        it('should set exit process to true, if no argument provided', function() {
          var r = checkOutput(function () {
            return yargs([])
              .demand('cat')
              .exitProcess()
              .argv;
          });

          r.exit.should.eql(true);
        });
    });

    describe('reset', function() {
        it('should put yargs back into its initial state', function() {
          // create a command line with all the things.
          // so that we can confirm they're reset.
          var y = yargs(['--help'])
            .help('help')
            .command('foo', 'bar')
            .default('foo', 'bar')
            .describe('foo', 'foo variable')
            .demand('foo')
            .string('foo')
            .alias('foo', 'bar')
            .string('foo')
            .implies('foo', 'snuh')
            .exitProcess(false)  // defaults to true.
            .reset();

          var emptyOptions = {
            array: [],
            boolean: [],
            string: [],
            alias: {},
            default: {},
            key: {},
            narg: {},
            defaultDescription: {},
            requiresArg: [],
            count: [],
            normalize: [],
            config: []
          };

          expect(y.getOptions()).to.deep.equal(emptyOptions);
          expect(y.getUsageInstance().getDescriptions()).to.deep.equal({});
          expect(y.getValidationInstance().getImplied()).to.deep.equal({});
          expect(y.getExitProcess()).to.equal(true);
          expect(y.getDemanded()).to.deep.equal({});
        });
    });
});
