var should = require('chai').should(),
    checkUsage = require('./helpers/utils').checkOutput,
    once = require('once'),
    yargs = require('../');

describe('Completion', function () {
  describe('default completion behavior', function() {
    it('it returns a list of commands as completion suggestions', function() {
      var r = checkUsage(function() {
          return yargs(['--get-yargs-completions'])
              .help('h')
              .command('foo', 'bar')
              .command('apple', 'banana')
              .completion()
              .argv
          ;
      }, ['./completion', '--get-yargs-completions', '']);

      r.logs.should.include('apple');
      r.logs.should.include('foo');
    });

    it("returns arguments as completion suggestion, if next contains '-'", function() {
      var r = checkUsage(function() {
          return yargs(['--get-yargs-completions'])
              .help('h')
              .option('foo', {
                describe: 'foo option'
              })
              .command('bar', 'bar command')
              .completion()
              .argv
          ;
      }, ['./usage', '--get-yargs-completions', '-f']);

      r.logs.should.include('--foo');
      r.logs.should.not.include('bar');
    });
  });

  describe('generateCompletionScript()', function() {
    it('replaces application variable with $0 in script', function() {
      var r = checkUsage(function() {
          return yargs([])
              .help('h')
              .showCompletionScript();
          ;
      }, ['ndm']);

      r.logs[0].should.match(/ndm --get-yargs-completions/);
    });

    it('if $0 has a .js extension, a ./ prefix is added', function() {
      var r = checkUsage(function() {
          return yargs([])
              .help('h')
              .showCompletionScript();
          ;
      }, ['test.js']);

      r.logs[0].should.match(/\.\/test.js --get-yargs-completions/);
    });
  });

  describe('completion()', function() {
    it('shows completion script if command registered with completion(cmd) is called', function() {
      var r = checkUsage(function() {
          return yargs(['completion'])
              .help('h')
              .completion('completion')
              .argv;
      }, ['ndm']);

      r.logs[0].should.match(/ndm --get-yargs-completions/);
    });

    it('allows a custom function to be registered for completion', function() {
      var r = checkUsage(function() {
          return yargs(['--get-yargs-completions'])
              .help('h')
              .completion('completion', function(current, argv) {
                return ['cat', 'bat'];
              })
              .argv;
      });

      r.logs.should.include('cat');
      r.logs.should.include('bat');
    });

    it('passes current arg for completion and the parsed arguments thus far to custom function', function() {
        var r = checkUsage(function() {
          return yargs(['--get-yargs-completions'])
            .help('h')
            .completion('completion', function(current, argv) {
              if (current === 'ma' && argv.cool) return ['success!'];
            })
            .argv;
        }, ['ndm', '--get-yargs-completions', '--cool', 'ma']);

        r.logs.should.include('success!');
    });

    it('if a callback parameter is provided, completions can be asynchronous', function(done) {
        done = once(done); // fix for checkUsage preventing yargs from exiting.

        yargs(['--get-yargs-completions'])
          .help('h')
          .completion('completion', function(current, argv, cb) {
            setTimeout(function() {
              var r = checkUsage(function() {
                cb(['apple', 'banana']);
              });

              r.logs.should.include('apple');
              r.logs.should.include('banana');
              return done();
            }, 100);
          })
          .argv;
    });
  });
});
