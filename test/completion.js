var should = require('chai').should(),
    checkUsage = require('./helpers/utils').checkOutput,
    yargs = require('../');

describe('Completion', function () {
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

  describe('generate completion script', function() {
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
});
