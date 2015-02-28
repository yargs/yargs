var should = require('chai').should(),
    expect = require('chai').expect,
    yargs = require('../'),
    path = require('path');

describe('parser tests', function () {

    it('should pass when specifying a "short boolean"', function () {
        var parse = yargs.parse([ '-b' ]);
        parse.should.have.property('b').to.be.ok.and.be.a('boolean');
        parse.should.have.property('_').with.length(0);
    });

    it('should pass when specifying a "long boolean"', function () {
        var parse = yargs.parse(['--bool']);
        parse.should.have.property('bool', true);
        parse.should.have.property('_').with.length(0);
    });

    it('should place bare options in the _ array', function () {
        var parse = yargs.parse(['foo', 'bar', 'baz']);
        parse.should.have.property('_').and.deep.equal(['foo','bar','baz']);
    });

    it('should expand grouped short options to a hash with a key for each', function () {
        var parse = yargs.parse(['-cats']);
        parse.should.have.property('c', true);
        parse.should.have.property('a', true);
        parse.should.have.property('t', true);
        parse.should.have.property('s', true);
        parse.should.have.property('_').with.length(0);
    });

    it('should set the value of the final option in a group to the next supplied value', function () {
        var parse = yargs.parse(['-cats', 'meow']);
        parse.should.have.property('c', true);
        parse.should.have.property('a', true);
        parse.should.have.property('t', true);
        parse.should.have.property('s', 'meow');
        parse.should.have.property('_').with.length(0);
    });

    it('should set the value of a single short option to the next supplied value', function () {
        var parse = yargs.parse(['-h', 'localhost']);
        parse.should.have.property('h', 'localhost');
        parse.should.have.property('_').with.length(0);
    });

    it('should set the value of multiple single short options to the next supplied values relative to each', function () {
        var parse = yargs.parse(['-h', 'localhost', '-p', '555']);
        parse.should.have.property('h', 'localhost');
        parse.should.have.property('p', 555);
        parse.should.have.property('_').with.length(0);
    });

    it('should set the value of a single long option to the next supplied value', function () {
        var parse = yargs.parse(['--pow', 'xixxle']);
        parse.should.have.property('pow', 'xixxle');
        parse.should.have.property('_').with.length(0);
    });

    it('should set the value of a single long option if an = was used', function () {
        var parse = yargs.parse(['--pow=xixxle']);
        parse.should.have.property('pow', 'xixxle');
        parse.should.have.property('_').with.length(0);
    });

    it('should set the value of multiple long options to the next supplied values relative to each', function () {
        var parse = yargs.parse(['--host', 'localhost', '--port', '555']);
        parse.should.have.property('host', 'localhost');
        parse.should.have.property('port', 555);
        parse.should.have.property('_').with.length(0);
    });

    it('should set the value of multiple long options if = signs were used', function () {
        var parse = yargs.parse(['--host=localhost', '--port=555']);
        parse.should.have.property('host', 'localhost');
        parse.should.have.property('port', 555);
        parse.should.have.property('_').with.length(0);
    });

    it('should still set values appropriately if a mix of short, long, and grouped short options are specified', function () {
        var parse = yargs.parse(['-h', 'localhost', '-fp', '555', 'script.js']);
        parse.should.have.property('f', true);
        parse.should.have.property('p', 555);
        parse.should.have.property('h', 'localhost');
        parse.should.have.property('_').and.deep.equal(['script.js']);
    });

    it('should still set values appropriately if a mix of short and long options are specified', function () {
        var parse = yargs.parse(['-h', 'localhost', '--port', '555']);
        parse.should.have.property('h', 'localhost');
        parse.should.have.property('port', 555);
        parse.should.have.property('_').with.length(0);
    });

    it('should explicitly set a boolean option to false if preceeded by "--no-"', function () {
        var parse = yargs.parse(['--no-moo']);
        parse.should.have.property('moo', false);
        parse.should.have.property('_').with.length(0);
    });

    it('should group values into an array if the same option is specified multiple times', function () {
        var parse = yargs.parse(['-v', 'a', '-v', 'b', '-v', 'c' ]);
        parse.should.have.property('v').and.deep.equal(['a','b','c']);
        parse.should.have.property('_').with.length(0);
    });

    it('should still set values appropriately if we supply a comprehensive list of various types of options', function () {
        var parse = yargs.parse([
            '--name=meowmers', 'bare', '-cats', 'woo',
            '-h', 'awesome', '--multi=quux',
            '--key', 'value',
            '-b', '--bool', '--no-meep', '--multi=baz',
            '--', '--not-a-flag', 'eek'
        ]);
        parse.should.have.property('c', true);
        parse.should.have.property('a', true);
        parse.should.have.property('t', true);
        parse.should.have.property('s', 'woo');
        parse.should.have.property('h', 'awesome');
        parse.should.have.property('b', true);
        parse.should.have.property('bool', true);
        parse.should.have.property('key', 'value');
        parse.should.have.property('multi').and.deep.equal(['quux', 'baz']);
        parse.should.have.property('meep', false);
        parse.should.have.property('name', 'meowmers');
        parse.should.have.property('_').and.deep.equal(['bare', '--not-a-flag', 'eek']);
    });

    it('should parse numbers appropriately', function () {
        var argv = yargs.parse([
            '-x', '1234',
            '-y', '5.67',
            '-z', '1e7',
            '-w', '10f',
            '--hex', '0xdeadbeef',
            '789',
        ]);
        argv.should.have.property('x', 1234).and.be.a('number');
        argv.should.have.property('y', 5.67).and.be.a('number');
        argv.should.have.property('z', 1e7).and.be.a('number');
        argv.should.have.property('w', '10f').and.be.a('string');
        argv.should.have.property('hex', 0xdeadbeef).and.be.a('number');
        argv.should.have.property('_').and.deep.equal([789]);
        argv._[0].should.be.a('number');
    });

    it('should not set the next value as the value of a short option if that option is explicitly defined as a boolean', function () {
        var parse = yargs([ '-t', 'moo' ]).boolean(['t']).argv;
        parse.should.have.property('t', true).and.be.a('boolean');
        parse.should.have.property('_').and.deep.equal(['moo']);
    });

    it('should set boolean options values if the next value is "true" or "false"', function () {
        var parse = yargs(['--verbose', 'false', 'moo', '-t', 'true'])
            .boolean(['t', 'verbose']).default('verbose', true).argv;
        parse.should.have.property('verbose', false).and.be.a('boolean');
        parse.should.have.property('t', true).and.be.a('boolean');
        parse.should.have.property('_').and.deep.equal(['moo']);
    });

    it('should allow defining options as boolean in groups', function () {
        var parse = yargs([ '-x', '-z', 'one', 'two', 'three' ])
            .boolean(['x','y','z']).argv;
        parse.should.have.property('x', true).and.be.a('boolean');
        parse.should.have.property('y', false).and.be.a('boolean');
        parse.should.have.property('z', true).and.be.a('boolean');
        parse.should.have.property('_').and.deep.equal(['one','two','three']);
    });

    it('should preserve newlines in option values' , function () {
        var args = yargs.parse(['-s', "X\nX"]);
        args.should.have.property('_').with.length(0);
        args.should.have.property('s', 'X\nX');
        // reproduce in bash:
        // VALUE="new
        // line"
        // node program.js --s="$VALUE"
        args = yargs.parse(["--s=X\nX"]);
        args.should.have.property('_').with.length(0);
        args.should.have.property('s', 'X\nX');
    });

    it('should not convert numbers to type number if explicitly defined as strings' , function () {
        var s = yargs([ '-s', '0001234' ]).string('s').argv.s;
        s.should.be.a('string').and.equal('0001234');
        var x = yargs([ '-x', '56' ]).string('x').argv.x;
        x.should.be.a('string').and.equal('56');
    });

    // Fixes: https://github.com/chevex/yargs/issues/68
    it('should parse flag arguments with no right-hand-value as strings, if defined as strings' , function () {
        var s = yargs([ '-s' ]).string('s').argv.s;
        s.should.be.a('string').and.equal('');

        s = yargs([ '-sf' ]).string('s').argv.s;
        s.should.be.a('string').and.equal('');

        s = yargs([ '--string' ]).string('string').argv.string;
        s.should.be.a('string').and.equal('');
    });

    it('should leave all non-hyphenated values as strings if _ is defined as a string', function () {
        var s = yargs([ '  ', '  ' ]).string('_').argv._;
        s.should.have.length(2);
        s[0].should.be.a('string').and.equal('  ');
        s[1].should.be.a('string').and.equal('  ');
    });

    it('should normalize redundant paths', function () {
        var a = yargs([ '-s', '/tmp/../' ]).alias('s', 'save').normalize('s').argv;
        a.should.have.property('s', '/');
        a.should.have.property('save', '/');
    });

    it('should normalize redundant paths when a value is later assigned', function () {
        var a = yargs(['-s']).normalize('s').argv;
        a.should.have.property('s', true);
        a.s = '/path/to/new/dir/../../';
        a.s.should.equal('/path/to/');
    });

    it('should assign data after forward slash to the option before the slash', function () {
        var parse = yargs.parse(['-I/foo/bar/baz']);
        parse.should.have.property('_').with.length(0);
        parse.should.have.property('I', '/foo/bar/baz');
        parse = yargs.parse(['-xyz/foo/bar/baz']);
        parse.should.have.property('x', true);
        parse.should.have.property('y', true);
        parse.should.have.property('z', '/foo/bar/baz');
        parse.should.have.property('_').with.length(0);
    });

    it('should set alias value to the same value as the full option', function () {
        var argv = yargs([ '-f', '11', '--zoom', '55' ])
            .alias('z', 'zoom')
            .argv;
        argv.should.have.property('zoom', 55);
        argv.should.have.property('z', 55);
        argv.should.have.property('f', 11);
    });

    describe('config', function() {
        var jsonPath = path.resolve(__dirname, './fixtures/config.json');

        // See: https://github.com/chevex/yargs/issues/12
        it('should load options and values from default config if specified', function () {
            var argv = yargs([ '--foo', 'bar' ])
                .alias('z', 'zoom')
                .config('settings')
                .default('settings', jsonPath)
                .argv;

            argv.should.have.property('herp', 'derp');
            argv.should.have.property('zoom', 55);
            argv.should.have.property('foo').and.deep.equal('bar');
        });

        it('should use value from config file, if argv value is using default value', function () {
            var argv = yargs([])
                .alias('z', 'zoom')
                .config('settings')
                .default('settings', jsonPath)
                .default('foo', 'banana')
                .argv;

            argv.should.have.property('herp', 'derp');
            argv.should.have.property('zoom', 55);
            argv.should.have.property('foo').and.deep.equal('baz');
        });

        it('should use cli value, if cli value is set and both cli and default value match', function () {
            var argv = yargs(['--foo', 'banana'])
                .alias('z', 'zoom')
                .config('settings')
                .default('settings', jsonPath)
                .default('foo', 'banana')
                .argv;

            argv.should.have.property('herp', 'derp');
            argv.should.have.property('zoom', 55);
            argv.should.have.property('foo').and.deep.equal('banana');
        });

        it('should load options and values from a file when config is used', function () {
            var argv = yargs([ '--settings', jsonPath, '--foo', 'bar' ])
                .alias('z', 'zoom')
                .config('settings')
                .argv;

            argv.should.have.property('herp', 'derp');
            argv.should.have.property('zoom', 55);
            argv.should.have.property('foo').and.deep.equal('bar');
        });

        it('should raise an appropriate error if JSON file is not found', function(done) {
          var argv = yargs([ '--settings', 'fake.json', '--foo', 'bar' ])
            .alias('z', 'zoom')
            .config('settings')
            .fail(function(msg) {
              msg.should.eql('invalid json config file: fake.json');
              return done();
            })
            .argv;
        });
    });

    it('should allow multiple aliases to be specified', function () {
        var argv = yargs([ '-f', '11', '--zoom', '55' ])
            .alias('z', [ 'zm', 'zoom' ])
            .argv;
        argv.should.have.property('zoom', 55);
        argv.should.have.property('z', 55);
        argv.should.have.property('zm', 55);
        argv.should.have.property('f', 11);
    });

    describe('dot notation', function() {
        it('should allow object graph traversal via dot notation', function () {
            var argv = yargs([
                '--foo.bar', '3', '--foo.baz', '4',
                '--foo.quux.quibble', '5', '--foo.quux.o_O',
                '--beep.boop'
            ]).argv;
            argv.should.have.property('foo').and.deep.equal({
                bar: 3,
                baz: 4,
                quux: {
                    quibble: 5,
                    o_O: true
                }
            });
            argv.should.have.property('beep').and.deep.equal({ boop: true });
        });

        it('should apply defaults to dot notation arguments', function () {
            var argv = yargs([])
              .default('foo.bar', 99)
              .argv;
            argv.foo.bar.should.eql(99);
        });

        it('should respect .string() for dot notation arguments', function () {
            var argv = yargs(['--foo.bar', '99', '--bar.foo=99'])
              .string('foo.bar')
              .argv;
            argv.foo.bar.should.eql('99');
            argv.bar.foo.should.eql(99);
        });

        it('should populate aliases when dot notation is used', function () {
            var argv = yargs(['--foo.bar', '99'])
              .alias('foo', 'f')
              .argv;
            argv.f.bar.should.eql(99);
        });

        it('should populate aliases when nested dot notation is used', function () {
            var argv = yargs(['--foo.bar.snuh', '99', '--foo.apple', '33', '--foo.bar.cool', '11'])
              .alias('foo', 'f')
              .argv;
            argv.f.bar.snuh.should.eql(99);
            argv.foo.bar.snuh.should.eql(99);

            argv.f.apple.should.eql(33);
            argv.foo.apple.should.eql(33);

            argv.f.bar.cool.should.eql(11);
            argv.foo.bar.cool.should.eql(11);
        });

        it("should allow flags to use dot notation, when seperated by '='", function () {
          var argv = yargs(['-f.foo=99'])
            .argv;
          argv.f.foo.should.eql(99);
        });

        it("should allow flags to use dot notation, when seperated by ' '", function () {
          var argv = yargs(['-f.foo', '99'])
            .argv;
          argv.f.foo.should.eql(99);
        });

        it("should allow flags to use dot notation when no right-hand-side is given", function () {
          var argv = yargs(['-f.foo', '99', '-f.bar'])
            .argv;

          argv.f.foo.should.eql(99);
          argv.f.bar.should.eql(true);
        });
    })

    it('should allow booleans and aliases to be defined with chainable api', function () {
        var aliased = [ '-h', 'derp' ],
            regular = [ '--herp',  'derp' ],
            opts = {
                herp: { alias: 'h', boolean: true }
            },
            aliasedArgv = yargs(aliased).boolean('herp').alias('h', 'herp').argv,
            propertyArgv = yargs(regular).boolean('herp').alias('h', 'herp').argv;
        aliasedArgv.should.have.property('herp', true);
        aliasedArgv.should.have.property('h', true);
        aliasedArgv.should.have.property('_').and.deep.equal(['derp']);
        propertyArgv.should.have.property('herp', true);
        propertyArgv.should.have.property('h', true);
        propertyArgv.should.have.property('_').and.deep.equal(['derp']);
    });

    it('should allow booleans and aliases to be defined with options hash', function () {
        var aliased = [ '-h', 'derp' ],
            regular = [ '--herp', 'derp' ],
            opts = {
                herp: { alias: 'h', boolean: true }
            },
            aliasedArgv = yargs(aliased).options(opts).argv,
            propertyArgv = yargs(regular).options(opts).argv;
        aliasedArgv.should.have.property('herp', true);
        aliasedArgv.should.have.property('h', true);
        aliasedArgv.should.have.property('_').and.deep.equal(['derp']);
        propertyArgv.should.have.property('herp', true);
        propertyArgv.should.have.property('h', true);
        propertyArgv.should.have.property('_').and.deep.equal(['derp']);
    });

    it('should set boolean and alias using explicit true', function () {
        var aliased = [ '-h', 'true' ],
            regular = [ '--herp',  'true' ],
            opts = {
                herp: { alias: 'h', boolean: true }
            },
            aliasedArgv = yargs(aliased).boolean('h').alias('h', 'herp').argv,
            propertyArgv = yargs(regular).boolean('h').alias('h', 'herp').argv;
        aliasedArgv.should.have.property('herp', true);
        aliasedArgv.should.have.property('h', true);
        aliasedArgv.should.have.property('_').with.length(0);
    });

    // regression, see https://github.com/substack/node-optimist/issues/71
    it('should set boolean and --x=true', function() {
        var parsed = yargs(['--boool', '--other=true']).boolean('boool').argv;
        parsed.should.have.property('boool', true);
        parsed.should.have.property('other', 'true');
        parsed = yargs(['--boool', '--other=false']).boolean('boool').argv;
        parsed.should.have.property('boool', true);
        parsed.should.have.property('other', 'false');
    });

    // regression, see https://github.com/chevex/yargs/issues/63
    it('should not add the same key to argv multiple times, when creating camel-case aliases', function() {
      var yargs = require('../')(['--health-check=banana', '--second-key', 'apple', '-t=blarg'])
          .options('h', {
            alias: 'health-check',
            description: 'health check',
            default: 'apple'
          })
          .options('second-key', {
            alias: 's',
            description: 'second key',
            default: 'banana'
          })
          .options('third-key', {
            alias: 't',
            description: 'third key',
            default: 'third'
          })

      // before this fix, yargs failed parsing
      // one but not all forms of an arg.
      yargs.argv.secondKey.should.eql('apple');
      yargs.argv.s.should.eql('apple');
      yargs.argv['second-key'].should.eql('apple');

      yargs.argv.healthCheck.should.eql('banana');
      yargs.argv.h.should.eql('banana');
      yargs.argv['health-check'].should.eql('banana');

      yargs.argv.thirdKey.should.eql('blarg');
      yargs.argv.t.should.eql('blarg');
      yargs.argv['third-key'].should.eql('blarg');
    });

    // regression, see https://github.com/chevex/yargs/issues/66
    it('should set boolean options values if next value is "true" or "false" with = as separator', function() {
      var argv = require('../')(['--bool=false'])
          .options({'b': {
            alias: 'bool',
            boolean: true,
            default: true
          }})
          .argv;

      argv.bool.should.eql(false);
    });

    describe('short options', function () {
        it ('should set n to the numeric value 123', function () {
            var argv = yargs.parse([ '-n123' ]);
            should.exist(argv);
            argv.should.have.property('n', 123);
        });

        it ('should set option "1" to true, option "2" to true, and option "3" to numeric value 456', function () {
            var argv = yargs.parse([ '-123', '456' ]);
            should.exist(argv);
            argv.should.have.property('1', true);
            argv.should.have.property('2', true);
            argv.should.have.property('3', 456);
        });
    });

    describe('whitespace', function () {
        it('should be whitespace', function () {
            var argv = yargs.parse([ '-x', '\t' ]);
            should.exist(argv);
            argv.should.have.property('x', '\t');
        });
    });

    describe('boolean modifier function', function () {
        it('should prevent yargs from sucking in the next option as the value of the first option', function () {
            // Arrange & Act
            var result = yargs().boolean('b').parse([ '-b', '123' ]);
            // Assert
            result.should.have.property('b').that.is.a('boolean').and.is.true;
            result.should.have.property('_').and.deep.equal([123]);
        });
    });

    describe('defaults', function () {
        function checkNoArgs(argv, hasAlias) {
            it('should set defaults if no args', function() {
                var result = argv.parse([ ]);
                result.should.have.property('flag', true);
                if (hasAlias) {
                    result.should.have.property('f', true);
                }
            });
        }

        function checkExtraArg(argv, hasAlias) {
            it('should set defaults if one extra arg', function() {
                var result = argv.parse([ 'extra' ]);
                result.should.have.property('flag', true);
                result.should.have.property('_').and.deep.equal(['extra']);
                if (hasAlias) {
                    result.should.have.property('f', true);
                }
            });
        }

        function checkStringArg(argv, hasAlias) {
            it('should set defaults even if arg looks like a string', function() {
                var result = argv.parse([ '--flag', 'extra' ]);
                result.should.have.property('flag', true);
                result.should.have.property('_').and.deep.equal(['extra']);
                if (hasAlias) {
                    result.should.have.property('f', true);
                }
            });
        }

        describe('for options with aliases', function () {
            var args = yargs().options({
                flag : {
                    alias   : 'f',
                    default : true
                }
            });

            checkNoArgs(args, true);
            checkExtraArg(args, true);
        });

        describe('for typed options without aliases', function () {
            var args = yargs().options({
                flag : {
                    type    : 'boolean',
                    default : true
                }
            });

            checkNoArgs(args);
            checkExtraArg(args);
            checkStringArg(args);
        });

        describe('for typed options with aliases', function () {
            var args = yargs().options({
                flag : {
                    alias   : 'f',
                    type    : 'boolean',
                    default : true
                }
            });

            checkNoArgs(args, true);
            checkExtraArg(args, true);
            checkStringArg(args, true);
        });

        describe('for boolean options', function() {
            [true, false, undefined].forEach(function(def) {
                describe('with explicit ' + def + ' default', function() {
                    var argv = yargs().options({
                          flag: {
                              type    : 'boolean',
                              default : def
                          }
                      }),
                      argv2 = yargs()
                        .boolean(['flag'])
                        .default('flag', def);

                    it('should set true if --flag in arg', function() {
                        argv.parse(['--flag']).flag.should.be.true;
                        argv2.parse(['--flag']).flag.should.be.true;
                    });

                    it('should set false if --no-flag in arg', function() {
                        argv.parse(['--no-flag']).flag.should.be.false;
                        argv2.parse(['--no-flag']).flag.should.be.false;
                    });

                    it('should set ' + def + ' if no flag in arg', function() {
                        should.equal(argv.parse([ ]).flag, def);
                        should.equal(argv2.parse([ ]).flag, def);
                    });
                });
            });

            describe('with implied false default', function() {
                var argv = yargs().options({
                    flag: {type    : 'boolean'}
                  }),
                  argv2 = yargs().boolean(['flag']);

                it('should set true if --flag in arg', function() {
                    argv.parse(['--flag']).flag.should.be.true;
                    argv2.parse(['--flag']).flag.should.be.true;
                });

                it('should set false if --no-flag in arg', function() {
                    argv.parse(['--no-flag']).flag.should.be.false;
                    argv2.parse(['--no-flag']).flag.should.be.false;
                });

                it('should set false if no flag in arg', function() {
                    argv.parse([ ]).flag.should.be.false;
                    argv2.parse([ ]).flag.should.be.false;
                });
            });
        });

        it('should define option as boolean and set default to true', function () {
            var argv = yargs.options({
                sometrue: {
                    boolean: true,
                    default: true
                }
            }).argv;
            argv.should.have.property('sometrue', true);
        });

        it('should define option as boolean and set default to false', function () {
            var argv = yargs.options({
                somefalse: {
                    boolean: true,
                    default: false
                }
            }).argv;
            argv.should.have.property('somefalse', false);
        });

        it('should set boolean options to false by default', function () {
            var parse = yargs(['moo'])
                .boolean(['t', 'verbose'])
                .default('verbose', false)
                .default('t', false).argv;
            parse.should.have.property('verbose', false).and.be.a('boolean');
            parse.should.have.property('t', false).and.be.a('boolean');
            parse.should.have.property('_').and.deep.equal(['moo']);
        });

        it('should allow function to be provided as default value', function() {
            var argv = yargs([])
                .default('file', function() {
                  return 'foo.txt';
                })
                .argv;

            argv.file.should.equal('foo.txt');
        });
    });

    describe('camelCase', function () {

        function runTests (yargs, strict) {

            if (!strict) {
                // Skip this test in strict mode because this option is not specified
                it('should provide options with dashes as camelCase properties', function () {
                    var result = yargs()
                        .parse([ '--some-option' ]);

                    result.should.have.property('some-option').that.is.a('boolean').and.is.true;
                    result.should.have.property('someOption' ).that.is.a('boolean').and.is.true;
                });
            }

            it('should provide count options with dashes as camelCase properties', function () {
                var result = yargs()
                    .option('some-option', {
                        describe : 'some option',
                        type     : 'count'
                    })
                    .parse([ '--some-option', '--some-option', '--some-option' ]);

                result.should.have.property('some-option', 3);
                result.should.have.property('someOption' , 3);
            });

            it('should provide options with dashes and aliases as camelCase properties', function () {
                var result = yargs()
                    .option('some-option', {
                        alias    : 'o',
                        describe : 'some option'
                    })
                    .parse([ '--some-option' ]);

                result.should.have.property('some-option').that.is.a('boolean').and.is.true;
                result.should.have.property('someOption' ).that.is.a('boolean').and.is.true;
            });

            it('should provide defaults of options with dashes as camelCase properties', function() {
                var result = yargs()
                    .option('some-option', {
                        describe : 'some option',
                        default  : 'asdf'
                    })
                    .parse([ ]);

                result.should.have.property('some-option', 'asdf');
                result.should.have.property('someOption' , 'asdf');
            });

            it('should provide aliases of options with dashes as camelCase properties', function() {
                var result = yargs()
                    .option('some-option', {
                        alias    : 'o',
                        describe : 'some option',
                        default  : 'asdf'
                    })
                    .parse([ ]);

                result.should.have.property('o', 'asdf');
                result.should.have.property('some-option', 'asdf');
                result.should.have.property('someOption' , 'asdf');
            });

            it('should provide aliases of options with dashes as camelCase properties', function() {
                var result = yargs()
                    .option('o', {
                        alias    : 'some-option',
                        describe : 'some option',
                        default  : 'asdf'
                    })
                    .parse([ ]);

                result.should.have.property('o', 'asdf');
                result.should.have.property('some-option', 'asdf');
                result.should.have.property('someOption' , 'asdf');
            });

            it('should provide aliases with dashes as camelCase properties', function() {
                var result = yargs()
                    .option('o', {
                        alias    : 'some-option',
                        describe : 'some option'
                    })
                    .parse([ '--some-option', 'val' ]);

                result.should.have.property('o'          ).that.is.a('string').and.equals('val');
                result.should.have.property('some-option').that.is.a('string').and.equals('val');
                result.should.have.property('someOption' ).that.is.a('string').and.equals('val');
            });

        }

        describe('dashes and camelCase', function () {
            runTests(function() {
                return yargs();
            });
        });

        describe('dashes and camelCase (strict)', function () {
            runTests(function() {
                // Special handling for failure messages, because normally a
                // failure calls process.exit(1);
                return yargs().strict().fail(function(msg) {
                    throw new Error(msg);
                });
            }, true);

            // See https://github.com/chevex/yargs/issues/31
            it('should not fail when options with defaults are missing', function () {
                var result = yargs()
                    .fail(function(msg) {
                        throw new Error(msg);
                    })
                    .option('some-option', {
                        describe : 'some option',
                        default  : 80
                    })
                    .strict()
                    .parse([ ]);
            });
        });
    });

    describe('-', function () {
        it('should set - as value of n', function () {
            var argv = yargs.parse(['-n', '-']);
            argv.should.have.property('n', '-');
            argv.should.have.property('_').with.length(0);
        });

        it('should set - as a non-hyphenated value', function () {
            var argv = yargs.parse(['-']);
            argv.should.have.property('_').and.deep.equal(['-']);
        });

        it('should set - as a value of f', function () {
            var argv = yargs.parse(['-f-']);
            argv.should.have.property('f', '-');
            argv.should.have.property('_').with.length(0);
        });

        it('should set b to true and set - as a non-hyphenated value when b is set as a boolean', function () {
            var argv = yargs(['-b', '-']).boolean('b').argv;
            argv.should.have.property('b', true);
            argv.should.have.property('_').and.deep.equal(['-']);
        });

        it('should set - as the value of s when s is set as a string', function () {
            var argv = yargs([ '-s', '-' ]).string('s').argv;
            argv.should.have.property('s', '-');
            argv.should.have.property('_').with.length(0);
        });
    });

    describe('count', function () {
        it('should count the number of times a boolean is present', function () {
            var parsed;

            parsed = yargs(['-x']).count('verbose').argv;
            parsed.verbose.should.equal(0);

            parsed = yargs(['--verbose']).count('verbose').argv;
            parsed.verbose.should.equal(1);

            parsed = yargs(['--verbose', '--verbose']).count('verbose').argv;
            parsed.verbose.should.equal(2);

            parsed = yargs(['-vvv']).alias('v', 'verbose').count('verbose').argv;
            parsed.verbose.should.equal(3);

            parsed = yargs(['--verbose', '--verbose', '-v', '--verbose']).count('verbose').alias('v', 'verbose').argv;
            parsed.verbose.should.equal(4);

            parsed = yargs(['--verbose', '--verbose', '-v', '-vv']).count('verbose').alias('v', 'verbose').argv;
            parsed.verbose.should.equal(5);
        });
    });

    describe('array', function() {
        it('should default argument to empty array if no value given', function () {
            var result = yargs().array('b').parse([ '-b' ]);
            Array.isArray(result.b).should.equal(true);
        });

        it('should place value of argument in array, when one argument provided', function() {
            var result = yargs().array('b').parse(['-b', '33']);
            Array.isArray(result.b).should.equal(true);
            result.b[0].should.equal(33);
        });

        it('should add multiple argument values to the array', function() {
            var result = yargs().array('b').parse(['-b', '33', '-b', 'hello']);
            Array.isArray(result.b).should.equal(true);
            result.b.should.include(33);
            result.b.should.include('hello');
        });

        it('should allow array: true, to be set inside an option block', function() {
            var result = yargs().option('b', {array: true}).parse(['-b', '33']);
            Array.isArray(result.b).should.equal(true);
            result.b.should.include(33);
        });

        // issue #103
        it('should default camel-case alias to array type', function () {
            var result = yargs().option('ca-path', {
              array: true
            }).parse([ '--ca-path', 'http://www.example.com' ]);

            Array.isArray(result['ca-path']).should.equal(true);
            Array.isArray(result.caPath).should.equal(true);
        });

        it('should default alias to array type', function () {
            var result = yargs().option('ca-path', {
              array: true,
              alias: 'c'
            }).parse([ '--ca-path', 'http://www.example.com' ]);

            Array.isArray(result['ca-path']).should.equal(true);
            Array.isArray(result.caPath).should.equal(true);
            Array.isArray(result.c).should.equal(true);
        });
    });

    describe('nargs', function() {
        it('should allow the number of arguments following a key to be specified', function() {
            var result = yargs().nargs('foo', 2)
              .parse([ '--foo', 'apple', 'bar' ]);

            Array.isArray(result.foo).should.equal(true);
            result.foo[0].should.equal('apple');
            result.foo[1].should.equal('bar');
        });

        it('should raise an exception if there are not enough arguments following key', function() {
            expect(function() {
              var result = yargs().nargs('foo', 2).
                parse([ '--foo', 'apple']);
            }).to.throw('not enough arguments following: foo');
        });

        it('nargs is applied to aliases', function() {
            var result = yargs().nargs('foo', 2)
              .alias('foo', 'bar')
              .parse([ '--bar', 'apple', 'bar' ]);

            Array.isArray(result.foo).should.equal(true);
            result.foo[0].should.equal('apple');
            result.foo[1].should.equal('bar');
        });

        it("should apply nargs to flag arguments", function() {
            var result = yargs()
              .option('f', {
                nargs: 2
              }).parse([ '-f', 'apple', 'bar', 'blerg' ]);

            result.f[0].should.equal('apple');
            result.f[1].should.equal('bar');
            result._[0].should.equal('blerg');
        });

        it("allows multiple nargs to be set at the same time", function() {
            var result = yargs().nargs({
                'foo': 2,
                'bar': 1
              })
              .parse([ '--foo', 'apple', 'bar', '--bar', 'banana', '-f' ]);

            Array.isArray(result.foo).should.equal(true);
            result.foo[0].should.equal('apple');
            result.foo[1].should.equal('bar');
            result.bar.should.equal('banana');
            result.f.should.equal(true);
        });
    });
});
