'use strict';
/* global context, describe, it, beforeEach, afterEach */
/* eslint-disable no-unused-vars */

const assert = require('assert');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const checkOutput = require('./helpers/utils.cjs').checkOutput;
const english = require('../locales/en.json');
let yargs;
require('chai').should();

const noop = () => {};
async function wait() {
  return new Promise(resolve => {
    setTimeout(resolve, 10);
  });
}
const implicationsFailedPattern = new RegExp(english['Implications failed:']);

function clearRequireCache() {
  delete require.cache[require.resolve('../index.cjs')];
  delete require.cache[require.resolve('../build/index.cjs')];
}
function isPromise(maybePromise) {
  return typeof maybePromise.then === 'function';
}

describe('yargs dsl tests', () => {
  const oldProcess = {versions: {}};

  beforeEach(() => {
    process.execPath = 'node';
    process._ = 'node';
    process.argv[1] = 'node';

    oldProcess.argv = process.argv;
    oldProcess.defaultApp = process.defaultApp;
    oldProcess.versions.electron = process.versions.electron;
    yargs = require('../index.cjs');
  });

  afterEach(() => {
    process.argv = oldProcess.argv;
    process.defaultApp = oldProcess.defaultApp;
    process.versions.electron = oldProcess.versions.electron;
    clearRequireCache();
  });

  it('should use bin name for $0, eliminating path', () => {
    process.argv[1] = '/usr/local/bin/ndm';
    process.env._ = '/usr/local/bin/ndm';
    process.execPath = '/usr/local/bin/ndm';
    const argv = yargs([]).parse();
    argv.$0.should.equal('ndm');
    yargs.$0.should.equal('ndm');
  });

  it('should not remove the 1st argument of bundled electron apps', () => {
    clearRequireCache();
    process.argv = ['/usr/local/bin/app', '-f', 'toto', 'tutu'];
    process.versions.electron = '10.0.0-nightly.20200211';
    yargs = require('../index.cjs');
    const argv = yargs.parse();
    argv.should.have.property('f');
    argv.f.should.equal('toto');
    argv._.should.deep.equal(['tutu']);
  });

  it('should remove the 1st argument of unbundled electron apps', () => {
    clearRequireCache();
    process.argv = ['/usr/local/bin/electron', 'app.js', '-f', 'toto', 'tutu'];
    process.versions.electron = '10.0.0-nightly.20200211';
    // Same syntax as in electron
    Object.defineProperty(process, 'defaultApp', {
      configurable: false,
      enumerable: true,
      value: true,
    });
    yargs = require('../index.cjs');
    const argv = yargs.parse();
    argv.should.have.property('f');
    argv.f.should.equal('toto');
    argv._.should.deep.equal(['tutu']);
  });

  it('accepts an object for aliases', () => {
    const argv = yargs([])
      .alias({
        cool: 'cat',
      })
      .default('cool', 33)
      .parse();

    argv.cat.should.eql(33);
  });

  it('does not populate argv with placeholder keys for unset options', () => {
    const argv = yargs([]).option('cool', {}).parse();

    Object.keys(argv).should.not.include('cool');
  });

  it('accepts an object for implies', () => {
    const r = checkOutput(() =>
      yargs(['--x=33'])
        .implies({
          x: 'y',
        })
        .parse()
    );
    r.errors[2].should.match(implicationsFailedPattern);
  });

  it('accepts an object for describes', () => {
    const r = checkOutput(() =>
      yargs([])
        .describe({
          x: 'really cool key',
        })
        .demand('x')
        .wrap(null)
        .parse()
    );

    r.errors[0].should.match(/really cool key/);
    r.result.should.not.have.property('[object Object]');
  });

  it('a function can be provided, to execute when a parsing failure occurs', done => {
    yargs(['--x=33'])
      .implies({
        x: 'y',
      })
      .fail(msg => {
        msg.should.match(implicationsFailedPattern);
        return done();
      })
      .parse();
  });

  it('should set alias to string if option is string', () => {
    const argv = yargs(['--cat=99'])
      .options('c', {
        alias: 'cat',
        string: true,
      })
      .parse();

    argv.cat.should.eql('99');
    argv.c.should.eql('99');
  });

  it('should allow a valid choice', () => {
    const argv = yargs(['--looks=good'])
      .option('looks', {
        choices: ['good', 'bad'],
      })
      .parse();

    argv.looks.should.eql('good');
  });

  it('should ignore a missing array choice with an empty default', () => {
    const argv = yargs(['--looks', '--looks', 'good'])
      .option('looks', {
        type: 'array',
        default: [],
        choices: ['good', 'bad'],
      })
      .parse();

    argv.looks.should.deep.eql(['good']);
  });

  it('should allow defaultDescription to be set with .option()', () => {
    const optDefaultDescriptions = yargs([])
      .option('port', {
        defaultDescription: '80 for HTTP and 443 for HTTPS',
      })
      .getOptions().defaultDescription;

    optDefaultDescriptions.should.deep.equal({
      port: '80 for HTTP and 443 for HTTPS',
    });
  });

  it('should not require config object for an option', () => {
    const r = checkOutput(() => yargs([]).option('x').parse());

    expect(r.errors).to.deep.equal([]);
  });

  describe('hide', () => {
    it('should add the key to hiddenOptions', () => {
      const options = yargs('').hide('someKey').getOptions();
      options.should.have.property('hiddenOptions');
      options.hiddenOptions.should.include('someKey');
    });
  });

  describe('showHidden', () => {
    it('should have a default show-hidden private option pre-configured', () => {
      const options = yargs('').getOptions();
      options.should.have.property('showHiddenOpt');
      options.showHiddenOpt.should.eql('show-hidden');
    });
    it('should not have show-hidden as an actual option described by default', () => {
      const options = yargs('').getOptions();
      options.key.should.not.have.property('show-hidden');
    });
    it('should set show-hidden option', () => {
      const options = yargs('').showHidden().getOptions();
      options.key.should.have.property('show-hidden');
    });
    it('should set custom-show-hidden option', () => {
      const options = yargs('').showHidden('custom-show-hidden').getOptions();
      options.key.should.have.property('custom-show-hidden');
      options.should.have.property('showHiddenOpt');
      options.showHiddenOpt.should.eql('custom-show-hidden');
    });
  });

  describe('showHelpOnFail', () => {
    it('should display custom failure message, if string is provided as first argument', () => {
      const r = checkOutput(() =>
        yargs([]).showHelpOnFail('pork chop sandwiches').demand('cat').parse()
      );

      r.errors[4].should.match(/pork chop sandwiches/);
    });

    it('calling with no arguments should default to displaying help', () => {
      const r = checkOutput(() =>
        yargs([]).showHelpOnFail().demand('cat').parse()
      );

      r.errors[2].should.match(/required argument/);
    });
  });

  describe('exitProcess', () => {
    describe('when exitProcess is set to false and a failure occurs', () => {
      it('should throw an exception', () => {
        checkOutput(() => {
          expect(() => {
            yargs([])
              .demand('cat')
              .showHelpOnFail(false)
              .exitProcess(false)
              .parse();
          }).to.throw(/Missing required argument/);
        });
      });
      it('should output the errors to stderr once', () => {
        const r = checkOutput(() => {
          try {
            yargs([])
              .demand('cat')
              .showHelpOnFail(false)
              .exitProcess(false)
              .parse();
          } catch (err) {
            // ignore the error, we only test the output here
          }
        });
        expect(r.logs).to.deep.equal([]);
        expect(r.errors).to.deep.equal(['Missing required argument: cat']);
      });
    });
    it('should set exit process to true, if no argument provided', () => {
      const r = checkOutput(() =>
        yargs([]).demand('cat').exitProcess().parse()
      );

      r.exit.should.eql(true);
    });
  });

  describe('reset', () => {
    it('should put yargs back into its initial state', () => {
      // create a command line with all the things.
      // so that we can confirm they're reset.
      const y = yargs(['--help'])
        .command('foo', 'bar', noop)
        .default('foo', 'bar')
        .describe('foo', 'foo variable')
        .demandCommand(1)
        .demandOption('foo')
        .string('foo')
        .alias('foo', 'bar')
        .string('foo')
        .choices('foo', ['bar', 'baz'])
        .coerce('foo', foo => `${foo}bar`)
        .implies('foo', 'snuh')
        .conflicts('qux', 'xyzzy')
        .group('foo', 'Group:')
        .exitProcess(false) // defaults to true.
        .global('foo', false)
        .global('qux', false)
        .env('YARGS')
        .getInternalMethods()
        .reset();

      const emptyOptions = {
        array: [],
        boolean: ['help', 'version'],
        string: [],
        alias: {},
        default: {},
        key: {help: true, version: true},
        narg: {},
        defaultDescription: {},
        choices: {},
        skipValidation: [],
        count: [],
        normalize: [],
        number: [],
        config: {},
        configObjects: [],
        envPrefix: 'YARGS', // preserved as global
        hiddenOptions: [],
        demandedCommands: {},
        demandedOptions: {},
        deprecatedOptions: {},
        local: ['_', 'foo', 'qux'],
      };

      expect(y.getOptions()).to.deep.equal(emptyOptions);
      expect(
        y.getInternalMethods().getUsageInstance().getDescriptions()
      ).to.deep.equal({
        help: '__yargsString__:Show help',
        version: '__yargsString__:Show version number',
      });
      expect(
        y.getInternalMethods().getValidationInstance().getImplied()
      ).to.deep.equal({});
      expect(
        y.getInternalMethods().getValidationInstance().getConflicting()
      ).to.deep.equal({});
      expect(
        y.getInternalMethods().getCommandInstance().getCommandHandlers()
      ).to.deep.equal({});
      expect(y.getExitProcess()).to.equal(false);
      expect(y.getDemandedOptions()).to.deep.equal({});
      expect(y.getDemandedCommands()).to.deep.equal({});
      expect(y.getGroups()).to.deep.equal({});
    });

    it('does not invoke parse with an error if reset has been called and option is not global', done => {
      const y = yargs().demand('cake').global('cake', false);

      y.parse('hello', err => {
        err.message.should.match(/Missing required argument/);
      });
      y.getInternalMethods().reset();
      y.parse('cake', err => {
        expect(err).to.equal(null);
        return done();
      });
    });
  });

  describe('command', () => {
    it('executes command handler with parsed argv', done => {
      yargs(['blerg'])
        .command('blerg', 'handle blerg things', noop, argv => {
          // we should get the argv from the prior yargs.
          argv._[0].should.equal('blerg');
          return done();
        })
        .exitProcess(false) // defaults to true.
        .parse();
    });
    it('runs all middleware before reaching the handler', done => {
      yargs(['foo'])
        .command(
          'foo',
          'handle foo things',
          () => {},
          argv => {
            // we should get the argv filled with data from the middleware
            argv._[0].should.equal('foo');
            argv.hello.should.equal('world');
            return done();
          },
          [
            function (argv) {
              return {hello: 'world'};
            },
          ]
        )
        .exitProcess(false) // defaults to true.
        .parse();
    });
    it('recommends a similar command if no command handler is found', () => {
      const r = checkOutput(() => {
        yargs(['boat']).command('goat').recommendCommands().parse();
      });

      r.errors[2].should.match(/Did you mean goat/);
    });

    it('does not recommend a similiar command if no similar command exists', () => {
      const r = checkOutput(() => {
        yargs(['foo']).command('nothingSimilar').recommendCommands().parse();
      });

      r.logs.length.should.equal(0);
    });

    it('recommends the longest match first', () => {
      const r = checkOutput(() => {
        yargs(['boat'])
          .command('bot')
          .command('goat')
          .recommendCommands()
          .parse();
      });

      r.errors[2].should.match(/Did you mean goat/);
    });

    it('counts tranposition as one mistake', () => {
      const r = checkOutput(() => {
        yargs(['baot'])
          .command('boat')
          .command('bot')
          .recommendCommands()
          .parse();
      });

      r.errors[2].should.match(/Did you mean boat/);
    });

    // see: https://github.com/yargs/yargs/issues/822
    it('does not print command recommendation if help message will be shown', done => {
      const parser = yargs().command('goat').help().recommendCommands();

      parser.parse('boat help', {}, (err, _argv, output) => {
        if (err) return done(err);
        output.split('Commands:').length.should.equal(2);
        return done();
      });
    });

    it("skips executing root-level command if builder's help is executed", () => {
      const r = checkOutput(() => {
        yargs(['blerg', '-h'])
          .command(
            'blerg',
            'handle blerg things',
            yargs => yargs.command('snuh', 'snuh command').help('h').wrap(null),
            () => {
              throw Error('should not happen');
            }
          )
          .help('h')
          .parse();
      });

      r.logs[0]
        .split('\n')
        .should.deep.equal([
          'usage blerg',
          '',
          'handle blerg things',
          '',
          'Commands:',
          '  usage blerg snuh  snuh command',
          '',
          'Options:',
          '      --version  Show version number  [boolean]',
          '  -h             Show help  [boolean]',
        ]);
    });

    it('executes top-level help if no handled command is provided', () => {
      const r = checkOutput(() => {
        yargs(['snuh', '-h'])
          .command('blerg', 'handle blerg things', yargs =>
            yargs.command('snuh', 'snuh command').help('h').parse()
          )
          .help('h')
          .wrap(null)
          .parse();
      });

      r.logs[0]
        .split('\n')
        .should.deep.equal([
          'usage [command]',
          '',
          'Commands:',
          '  usage blerg  handle blerg things',
          '',
          'Options:',
          '      --version  Show version number  [boolean]',
          '  -h             Show help  [boolean]',
        ]);
    });

    it("accepts an object for describing a command's options", () => {
      const r = checkOutput(() => {
        yargs(['blerg', '-h'])
          .command('blerg <foo>', 'handle blerg things', {
            foo: {
              default: 99,
            },
            bar: {
              default: 'hello world',
            },
          })
          .help('h')
          .wrap(null)
          .parse();
      });

      const usageString = r.logs[0];
      usageString.should.match(/usage blerg <foo>/);
      usageString.should.match(/--foo.*default: 99/);
      usageString.should.match(/--bar.*default: "hello world"/);
    });

    it("accepts a module with a 'builder' and 'handler' key", () => {
      const argv = yargs(['blerg', 'bar'])
        .command(
          'blerg <foo>',
          'handle blerg things',
          require('./fixtures/command')
        )
        .parse();

      argv.banana.should.equal('cool');
      argv.batman.should.equal('sad');
      argv.foo.should.equal('bar');

      global.commandHandlerCalledWith.banana.should.equal('cool');
      global.commandHandlerCalledWith.batman.should.equal('sad');
      global.commandHandlerCalledWith.foo.should.equal('bar');
      delete global.commandHandlerCalledWith;
    });

    it("accepts a module with a keys 'command', 'describe', 'builder', and 'handler'", () => {
      const argv = yargs(['blerg', 'bar'])
        .command(require('./fixtures/command-module'))
        .parse();

      argv.banana.should.equal('cool');
      argv.batman.should.equal('sad');
      argv.foo.should.equal('bar');

      global.commandHandlerCalledWith.banana.should.equal('cool');
      global.commandHandlerCalledWith.batman.should.equal('sad');
      global.commandHandlerCalledWith.foo.should.equal('bar');
      delete global.commandHandlerCalledWith;
    });

    it("derives 'command' string from filename when missing", () => {
      const argv = yargs('nameless --foo bar')
        .command(require('./fixtures/cmddir_noname/nameless'))
        .parse();

      argv.banana.should.equal('cool');
      argv.batman.should.equal('sad');
      argv.foo.should.equal('bar');

      global.commandHandlerCalledWith.banana.should.equal('cool');
      global.commandHandlerCalledWith.batman.should.equal('sad');
      global.commandHandlerCalledWith.foo.should.equal('bar');
      delete global.commandHandlerCalledWith;
    });

    it("throws error for non-module command object missing 'command' string", () => {
      expect(() => {
        yargs.command({
          desc: 'A command with no name',
          builder(yargs) {
            return yargs;
          },
          handler(argv) {},
        });
      }).to.throw(
        /No command name given for module: {(\n )? desc: 'A command with no name',\n {2}builder: \[Function(: builder)?],\n {2}handler: \[Function(: handler)?](\n| )}/
      );
    });
  });

  describe('terminalWidth', () => {
    it('returns the maximum width of the terminal', () => {
      if (process.stdout.isTTY) {
        yargs.terminalWidth().should.be.gte(0);
      } else {
        expect(yargs.terminalWidth()).to.equal(null);
      }
    });
  });

  describe('number', () => {
    it('accepts number arguments when a number type is specified', () => {
      const argv = yargs('-w banana').number('w').parse();

      expect(typeof argv.w).to.equal('number');
    });

    it('should expose an options short-hand for numbers', () => {
      const argv = yargs('-w banana')
        .option('w', {
          number: true,
        })
        .alias('w', 'x')
        .parse();

      expect(typeof argv.w).to.equal('number');
      expect(typeof argv.x).to.equal('number');
    });
  });

  describe('choices', () => {
    it('accepts an object', () => {
      const optChoices = yargs([])
        .choices({
          color: ['red', 'green', 'blue'],
          stars: [1, 2, 3, 4, 5],
        })
        .choices({
          size: ['xl', 'l', 'm', 's', 'xs'],
        })
        .getOptions().choices;

      optChoices.should.deep.equal({
        color: ['red', 'green', 'blue'],
        stars: [1, 2, 3, 4, 5],
        size: ['xl', 'l', 'm', 's', 'xs'],
      });
    });

    it('accepts a string and array', () => {
      const optChoices = yargs([])
        .choices('meat', ['beef', 'chicken', 'pork', 'bison'])
        .choices('temp', ['rare', 'med-rare', 'med', 'med-well', 'well'])
        .getOptions().choices;

      optChoices.should.deep.equal({
        meat: ['beef', 'chicken', 'pork', 'bison'],
        temp: ['rare', 'med-rare', 'med', 'med-well', 'well'],
      });
    });

    it('accepts a string and single value', () => {
      const optChoices = yargs([])
        .choices('gender', 'male')
        .choices('gender', 'female')
        .getOptions().choices;

      optChoices.should.deep.equal({
        gender: ['male', 'female'],
      });
    });
  });

  describe('locale', () => {
    function loadLocale(locale) {
      clearRequireCache();
      yargs = require('../index.cjs');
      process.env.LC_ALL = locale;
    }

    it('uses english as a default locale', () => {
      ['LANGUAGE', 'LC_ALL', 'LANG', 'LC_MESSAGES'].forEach(e => {
        delete process.env[e];
      });
      yargs.locale().should.equal('en_US');
    });

    it("detects the operating system's locale", () => {
      loadLocale('es_ES.UTF-8');
      yargs.locale().should.equal('es_ES');
      loadLocale('en_US.UTF-8');
    });

    it("should not detect the OS locale if detectLocale is 'false'", () => {
      loadLocale('es_ES.UTF-8');

      const r = checkOutput(() => {
        yargs(['snuh', '-h'])
          .command('blerg', 'blerg command')
          .help('h')
          .wrap(null)
          .detectLocale(false)
          .parse();
      });

      yargs.locale().should.equal('en');
      yargs.getDetectLocale().should.equal(false);
      r.logs.join(' ').should.match(/Commands:/);

      loadLocale('en_US.UTF-8');
    });

    it("allows a locale other than the default 'en' to be specified", () => {
      const r = checkOutput(() => {
        yargs(['snuh', '-h'])
          .command('blerg', 'blerg command')
          .help('h')
          .wrap(null)
          .locale('pirate')
          .parse();
      });

      r.logs.join(' ').should.match(/Choose yer command:/);
    });

    it('handles a missing locale', () => {
      loadLocale('zz_ZZ.UTF-8');

      const r = checkOutput(() => {
        yargs(['snuh', '-h'])
          .command('blerg', 'blerg command')
          .help('h')
          .wrap(null)
          .parse();
      });

      yargs.locale().should.equal('zz_ZZ');
      loadLocale('en_US.UTF-8');
      r.logs.join(' ').should.match(/Commands:/);
    });

    it('properly translates a region-specific locale file', () => {
      loadLocale('pt_BR.UTF-8');

      const r = checkOutput(() => {
        yargs(['-h']).help('h').wrap(null).parse();
      });

      yargs.locale().should.equal('pt_BR');
      loadLocale('en_US.UTF-8');
      r.logs.join(' ').should.match(/Exibe ajuda/);
    });

    it('uses locale string for help option default desc on .locale().help()', () => {
      const r = checkOutput(() => {
        yargs(['-h']).locale('pirate').help('h').wrap(null).parse();
      });

      r.logs.join(' ').should.match(/Parlay this here code of conduct/);
    });

    it('uses locale string for help option default desc on .help().locale()', () => {
      const r = checkOutput(() => {
        yargs(['-h']).help('h').locale('pirate').wrap(null).parse();
      });

      r.logs.join(' ').should.match(/Parlay this here code of conduct/);
    });

    // Addresses: https://github.com/yargs/yargs/issues/2178
    it('does not enter infinite loop when locale is invalid', () => {
      // Save env vars
      const lcAll = process.env.LC_ALL;
      const lcMessages = process.env.LC_MESSAGES;
      const lang = process.env.LANG;
      const language = process.env.LANGUAGE;
      // Change
      delete process.env.LC_ALL;
      delete process.env.LC_MESSAGES;
      process.env.LANG = '.UTF-8';
      delete process.env.LANGUAGE;
      try {
        yargs
          .command({
            command: 'cmd1',
            desc: 'cmd1 desc',
            builder: () => {},
            handler: _argv => {},
          })
          .parse();
      } catch {
        expect.fail();
      } finally {
        // Restore
        process.env.LC_ALL = lcAll;
        process.env.LC_MESSAGES = lcMessages;
        process.env.LANG = lang;
        process.env.LANGUAGE = language;
      }
    });

    describe('updateLocale', () => {
      it('allows you to override the default locale strings', () => {
        const r = checkOutput(() => {
          yargs(['snuh', '-h'])
            .command('blerg', 'blerg command')
            .help('h')
            .wrap(null)
            .updateLocale({
              'Commands:': 'COMMANDS!',
            })
            .parse();
        });

        r.logs.join(' ').should.match(/COMMANDS!/);
      });

      it('also works on default option group', () => {
        const r = checkOutput(() => {
          yargs(['-h'])
            .help('h')
            .wrap(null)
            .updateLocale({
              'Options:': 'OPTIONS!',
            })
            .parse();
        });

        r.logs.join(' ').should.match(/OPTIONS!/);
      });

      it('allows you to use updateStrings() as an alias for updateLocale()', () => {
        const r = checkOutput(() => {
          yargs(['snuh', '-h'])
            .command('blerg', 'blerg command')
            .help('h')
            .wrap(null)
            .updateStrings({
              'Commands:': '!SDNAMMOC',
            })
            .parse();
        });

        r.logs.join(' ').should.match(/!SDNAMMOC/);
      });
    });
  });

  describe('env', () => {
    it('translates no arg as empty prefix (parser applies all env vars)', () => {
      const options = yargs.env().getOptions();
      options.envPrefix.should.equal('');
    });

    it('accepts true as a valid prefix (parser applies all env vars)', () => {
      const options = yargs.env(true).getOptions();
      options.envPrefix.should.equal(true);
    });

    it('accepts empty string as a valid prefix (parser applies all env vars)', () => {
      const options = yargs.env('').getOptions();
      options.envPrefix.should.equal('');
    });

    it('accepts a string prefix', () => {
      const options = yargs.env('COOL').getOptions();
      options.envPrefix.should.equal('COOL');
    });

    it('translates false as undefined prefix (disables parsing of env vars)', () => {
      const options = yargs.env(false).getOptions();
      expect(options.envPrefix).to.equal(undefined);
    });
  });

  describe('parse', () => {
    it('parses a simple string', () => {
      const a1 = yargs.parse('-x=2 --foo=bar');
      const a2 = yargs('-x=2 --foo=bar').parse();
      a1.x.should.equal(2);
      a2.x.should.equal(2);

      a1.foo.should.equal('bar');
      a2.foo.should.equal('bar');
    });

    it('parses a quoted string', () => {
      const a1 = yargs.parse('-x=\'marks "the" spot\' --foo "break \'dance\'"');
      const a2 = yargs(
        '-x=\'marks "the" spot\' --foo "break \'dance\'"'
      ).parse();

      a1.x.should.equal('marks "the" spot');
      a2.x.should.equal('marks "the" spot');

      a1.foo.should.equal("break 'dance'");
      a2.foo.should.equal("break 'dance'");
    });

    it('parses an array', () => {
      const a1 = yargs.parse(['-x', '99', '--why=hello world']);
      const a2 = yargs(['-x', '99', '--why=hello world']).parse();

      a1.x.should.equal(99);
      a2.x.should.equal(99);

      a1.why.should.equal('hello world');
      a2.why.should.equal('hello world');
    });

    it('ignores implicit help command (with short-circuit)', () => {
      const parsed = yargs.help().parse('help', true);
      parsed._.should.deep.equal(['help']);
    });

    it('allows an optional context object to be provided', () => {
      const a1 = yargs.parse('-x=2 --foo=bar', {
        context: 'look at me go!',
      });
      a1.x.should.equal(2);
      a1.foo.should.equal('bar');
      a1.context.should.equal('look at me go!');
    });

    // see https://github.com/yargs/yargs/issues/724
    it('overrides parsed value of argv with context object', () => {
      const a1 = yargs.parse('-x=33', {
        x: 42,
      });
      a1.x.should.equal(42);
    });

    it('parses process.parse() if no arguments are provided', () => {
      const r = checkOutput(() => {
        yargs(['--help']).command('blerg', 'blerg command').wrap(null).parse();
      });

      r.logs[0].should.match(/Commands:[\s\S]*blerg command/);
    });

    it('can be called multiple times with the same behavior', () => {
      const counter = {foobar: 0};
      yargs(['test', 'foobar'])
        .command(
          'test <name>',
          'increases counter',
          yargs =>
            yargs.positional('name', {
              aliases: 'n',
              describe: 'a name',
              choices: ['foobar'],
              type: 'string',
            }),
          argv => {
            counter[argv.name]++;
          }
        )
        .fail(msg => {
          expect.fail(undefined, undefined, msg);
        });
      yargs.parse();
      yargs.parse();
      yargs.parse();
      expect(counter.foobar).to.equal(3);
    });
  });

  describe('parsed', () => {
    it('should be false before parsing', () => {
      const warn = global.console.warn;
      global.console.warn = () => {};
      yargs.parsed.should.equal(false);
      global.console.warn = warn;
    });

    it('should not be false after parsing', () => {
      const warn = global.console.warn;
      global.console.warn = () => {};
      yargs.parse();
      yargs.parsed.should.not.equal(false);
      global.console.warn = warn;
    });
  });

  // yargs.parse(['foo', '--bar'], function (err, argv, output) {}
  context('function passed as second argument to parse', () => {
    it('does not print to stdout', () => {
      const r = checkOutput(() => {
        yargs()
          .help('h')
          .parse('-h', (_err, argv, output) => {});
      });

      r.logs.length.should.equal(0);
      r.errors.length.should.equal(0);
    });

    it('gets passed error as first argument', () => {
      let err = null;
      const r = checkOutput(() => {
        yargs()
          .demand('robin')
          .parse('batman', (_err, argv, output) => {
            err = _err;
          });
      });
      r.logs.length.should.equal(0);
      r.errors.length.should.equal(0);
      err.should.match(/Missing required argument/);
    });

    it('gets passed argv as second argument', () => {
      let argv = null;
      const r = checkOutput(() => {
        yargs()
          .demand('robin')
          .parse('batman --foo', (_err, _argv, output) => {
            argv = _argv;
          });
      });
      r.logs.length.should.equal(0);
      r.errors.length.should.equal(0);
      argv.foo.should.equal(true);
    });

    it('gets passed output as third argument', () => {
      let output = null;
      const r = checkOutput(() => {
        yargs()
          .demand('robin')
          .help()
          .parse('--help', (_err, argv, _output) => {
            output = _output;
          });
      });
      r.logs.length.should.equal(0);
      r.errors.length.should.equal(0);
      output.should.match(/--robin.*\[required]/);
    });

    it('reinstates original exitProcess setting after invocation', () => {
      let callbackCalled = false;
      const r = checkOutput(() => {
        yargs
          .exitProcess(true)
          .help()
          .parse('--help', () => {
            callbackCalled = true;
            yargs.getExitProcess().should.equal(false);
          });
      });
      r.logs.length.should.equal(0);
      r.errors.length.should.equal(0);
      r.exit.should.equal(false);
      callbackCalled.should.equal(true);
      yargs.getExitProcess().should.equal(true);
    });

    it('does not call callback if subsequently called without callback', () => {
      let callbackCalled = 0;
      const callback = () => {
        callbackCalled++;
      };
      yargs.help();
      const r1 = checkOutput(() => {
        yargs.parse('--help', callback);
      });
      const r2 = checkOutput(() => {
        yargs.parse('--help');
      });
      callbackCalled.should.equal(1);
      r1.logs.length.should.equal(0);
      r1.errors.length.should.equal(0);
      r1.exit.should.equal(false);
      r2.exit.should.equal(true);
      r2.errors.length.should.equal(0);
      r2.logs[0].should.match(/--help.*Show help.*\[boolean]/);
    });

    it('resets error state between calls to parse', () => {
      const y = yargs().demand(2);

      let err1 = null;
      let out1 = null;
      let argv1 = null;
      y.parse('foo', (err, argv, output) => {
        err1 = err;
        argv1 = argv;
        out1 = output;
      });

      err1.message.should.match(/Not enough non-option arguments/);
      argv1._.should.include('foo');
      out1.should.match(/Not enough non-option arguments/);

      let err2 = null;
      let argv2 = null;
      let out2 = null;
      y.parse('foo bar', (err, argv, output) => {
        err2 = err;
        argv2 = argv;
        out2 = output;
      });

      expect(err2).to.equal(null);
      argv2._.should.deep.equal(['foo', 'bar']);
      expect(out2).to.equal('');
    });

    describe('commands', () => {
      it('does not invoke command handler if output is populated', () => {
        let err = null;
        let handlerCalled = false;
        const r = checkOutput(() => {
          yargs()
            .command('batman <api-token>', 'batman command', noop, () => {
              handlerCalled = true;
            })
            .parse('batman --what', (_err, argv, output) => {
              err = _err;
            });
        });
        r.logs.length.should.equal(0);
        r.errors.length.should.equal(0);
        err.message.should.match(/Not enough non-option arguments/);
        handlerCalled.should.equal(false);
      });

      it('invokes command handler normally if no output is populated', () => {
        let argv = null;
        let output = null;
        const r = checkOutput(() => {
          yargs()
            .command('batman <api-token>', 'batman command', noop, _argv => {
              argv = _argv;
            })
            .parse('batman robin --what', (_err, argv, _output) => {
              output = _output;
            });
        });
        r.logs.length.should.equal(0);
        r.errors.length.should.equal(0);
        output.should.equal('');
        argv['api-token'].should.equal('robin');
        argv.what.should.equal(true);
      });

      it('allows context object to be passed to parse', () => {
        let argv = null;
        yargs()
          .command('batman <api-token>', 'batman command', noop, _argv => {
            argv = _argv;
          })
          .parse(
            'batman robin --what',
            {
              state: 'grumpy but rich',
            },
            (_err, argv, _output) => {}
          );

        argv.state.should.equal('grumpy but rich');
        argv['api-token'].should.equal('robin');
        argv.what.should.equal(true);
      });

      // see: https://github.com/yargs/yargs/issues/671
      it('does not fail if context object has cyclical reference', () => {
        let argv = null;
        const context = {state: 'grumpy but rich'};
        context.res = context;
        yargs()
          .command('batman <api-token>', 'batman command', noop, _argv => {
            argv = _argv;
          })
          .parse('batman robin --what', context, (_err, argv, _output) => {});

        argv.state.should.equal('grumpy but rich');
        argv['api-token'].should.equal('robin');
        argv.what.should.equal(true);
      });

      it('allows nested sub-commands to be invoked multiple times', () => {
        const context = {counter: 0};

        checkOutput(() => {
          const parser = yargs().commandDir('fixtures/cmddir');

          parser.parse(
            'dream within-a-dream --what',
            {context},
            (_err, argv, _output) => {}
          );
          parser.parse(
            'dream within-a-dream --what',
            {context},
            (_err, argv, _output) => {}
          );
          parser.parse(
            'dream within-a-dream --what',
            {context},
            (_err, argv, _output) => {}
          );
        });

        context.counter.should.equal(3);
      });

      it('overwrites the prior context object, when parse is called multiple times', () => {
        let argv = null;
        const parser = yargs().command(
          'batman <api-token>',
          'batman command',
          noop,
          _argv => {}
        );

        parser.parse(
          'batman robin --what',
          {
            state: 'grumpy but rich',
          },
          (_err, _argv, _output) => {}
        );

        parser.parse(
          'batman robin --what',
          {
            state: 'the hero we need',
          },
          (_err, _argv, _output) => {
            argv = _argv;
          }
        );

        argv.state.should.equal('the hero we need');
      });

      it('populates argv appropriately when parse is called multiple times', () => {
        const parser = yargs()
          .command('batman <api-token>', 'batman command', noop, _argv => {})
          .command('robin <egg>', 'robin command', noop, _argv => {});

        let argv1 = null;
        parser.parse('batman abc123', (_err, argv, _output) => {
          argv1 = argv;
        });
        let argv2 = null;
        parser.parse('robin blue', (_err, argv, _output) => {
          argv2 = argv;
        });
        expect(argv1.egg).to.equal(undefined);
        argv1['api-token'].should.equal('abc123');

        expect(argv2['api-token']).to.equal(undefined);
        argv2.egg.should.equal('blue');
      });

      it('populates output appropriately when parse is called multiple times', () => {
        const parser = yargs()
          .command('batman <api-token>', 'batman command', noop, _argv => {})
          .command('robin <egg>', 'robin command', noop, _argv => {})
          .wrap(null);

        let output1 = null;
        parser.parse('batman help', (_err, _argv, output) => {
          output1 = output;
        });
        let output2 = null;
        parser.parse('robin help', (_err, _argv, output) => {
          output2 = output;
        });

        output1
          .split('\n')
          .should.deep.equal([
            'node batman <api-token>',
            '',
            'batman command',
            '',
            'Options:',
            '  --help     Show help  [boolean]',
            '  --version  Show version number  [boolean]',
          ]);

        output2
          .split('\n')
          .should.deep.equal([
            'node robin <egg>',
            '',
            'robin command',
            '',
            'Options:',
            '  --help     Show help  [boolean]',
            '  --version  Show version number  [boolean]',
          ]);
      });

      it('resets errors when parse is called multiple times', () => {
        const parser = yargs()
          .command('batman <api-token>', 'batman command', noop, _argv => {})
          .command('robin <egg>', 'robin command', noop, _argv => {})
          .wrap(null);

        let error1 = null;
        let output1 = null;
        parser.parse('batman', (err, _argv, output) => {
          error1 = err;
          output1 = output;
        });
        let error2 = null;
        let output2 = null;
        parser.parse('robin help', (err, _argv, output) => {
          error2 = err;
          output2 = output;
        });

        error1.message.should.match(/Not enough non-option arguments/);
        output1
          .split('\n')
          .should.deep.equal([
            'node batman <api-token>',
            '',
            'batman command',
            '',
            'Options:',
            '  --help     Show help  [boolean]',
            '  --version  Show version number  [boolean]',
            '',
            'Not enough non-option arguments: got 0, need at least 1',
          ]);

        expect(error2).to.equal(undefined);
        output2
          .split('\n')
          .should.deep.equal([
            'node robin <egg>',
            '',
            'robin command',
            '',
            'Options:',
            '  --help     Show help  [boolean]',
            '  --version  Show version number  [boolean]',
          ]);
      });

      it('preserves top-level config when parse is called multiple times', () => {
        let x = 'wrong';
        let err;
        let output;
        // set some top-level, reset-able config
        const parser = yargs()
          .demand(1, 'Must call a command')
          .strict()
          .wrap(null)
          .command('one <x>', 'The one and only command');
        // first call parse with command, which calls reset
        parser.parse('one two', (_, argv) => {
          x = argv.x;
        });
        // then call parse without command, which should enforce top-level config
        parser.parse('', (_err, argv, _output) => {
          err = _err || {};
          output = _output || '';
        });
        x.should.equal('two');
        err.should.have.property('message').and.equal('Must call a command');
        output
          .split('\n')
          .should.deep.equal([
            'node <command>',
            '',
            'Commands:',
            '  node one <x>  The one and only command',
            '',
            'Options:',
            '  --help     Show help  [boolean]',
            '  --version  Show version number  [boolean]',
            '',
            'Must call a command',
          ]);
      });
    });
  });

  describe('config', () => {
    it('allows a parsing function to be provided as a second argument', () => {
      const argv = yargs('--config ./test/fixtures/config.json')
        .config('config', cfgPath => JSON.parse(fs.readFileSync(cfgPath)))
        .global('config', false)
        .parse();

      argv.foo.should.equal('baz');
    });

    it('allows key to be specified with option shorthand', () => {
      const argv = yargs('--config ./test/fixtures/config.json')
        .option('config', {
          config: true,
          global: false,
        })
        .parse();

      argv.foo.should.equal('baz');
    });

    it('can be disabled with option shorthand', () => {
      const argv = yargs('--config ./test/fixtures/config.json')
        .option('config', {
          config: false,
          global: false,
        })
        .parse();

      argv.config.should.equal('./test/fixtures/config.json');
    });

    it('allows to pass a configuration object', () => {
      const argv = yargs.config({foo: 1, bar: 2}).parse();

      argv.foo.should.equal(1);
      argv.bar.should.equal(2);
    });

    describe('extends', () => {
      it('applies default configurations when given config object', () => {
        const argv = yargs
          .config({
            extends: './test/fixtures/extends/config_1.json',
            a: 1,
          })
          .parse();

        argv.a.should.equal(1);
        argv.b.should.equal(22);
        argv.z.should.equal(15);
      });

      it('protects against circular extended configurations', () => {
        const {YError} = require('../build/index.cjs');
        expect(() => {
          yargs.config({extends: './test/fixtures/extends/circular_1.json'});
        }).to.throw(YError);
      });

      it('handles absolute paths', () => {
        const absolutePath = path.join(
          process.cwd(),
          'test',
          'fixtures',
          'extends',
          'config_1.json'
        );

        const argv = yargs
          .config({
            a: 2,
            extends: absolutePath,
          })
          .parse();

        argv.a.should.equal(2);
        argv.b.should.equal(22);
        argv.z.should.equal(15);
      });

      it('tolerates null prototype config objects', () => {
        const argv = yargs
          .config({
            __proto__: null,
            a: 2,
            extends: './test/fixtures/extends/config_1.json',
          })
          .parse();

        argv.a.should.equal(2);
        argv.b.should.equal(22);
        argv.z.should.equal(15);
      });

      // see: https://www.npmjs.com/package/yargs-test-extends
      it('allows a module to be extended, rather than a JSON file', () => {
        const argv = yargs()
          .config({
            a: 2,
            extends: 'yargs-test-extends',
          })
          .parse();

        argv.a.should.equal(2);
        argv.c.should.equal(201);
      });

      it('ignores an extends key that does not look like a path or module', () => {
        const argv = yargs()
          .config({
            a: 2,
            extends: 'batman',
          })
          .parse();

        argv.a.should.equal(2);
        argv.extends.should.equal('batman');
      });

      it('allows files with .*rc extension to be extended', () => {
        const argv = yargs()
          .config({
            extends: './test/fixtures/extends/.myrc',
            a: 3,
          })
          .parse();

        argv.a.should.equal(3);
        argv.b.should.equal(22);
        argv.c.should.equal(201);
        argv.z.should.equal(15);
      });

      it('deep merges configs when extending when deep-merge-config=true', () => {
        const argv = yargs()
          .parserConfiguration({'deep-merge-config': true})
          .config({
            extends: './test/fixtures/extends/config_deep.json',
            a: {
              b: 11,
              d: [5, 2],
              f: 'no',
              g: {
                h: 122,
              },
              i: [1, 2],
            },
          })
          .parse();

        argv.a.b.should.equal(11);
        argv.a.c.should.equal(12);
        argv.a.d.should.deep.equal([5, 2]);
        argv.a.e.should.eql([1]);
        argv.a.f.should.equal('no');
        argv.a.g.h.should.equal(122);
        argv.a.i.should.deep.equal([1, 2]);
        argv.test.yes.should.equal(1);
      });

      it('deep merges multiple configs when extending when deep-merge-config=true', () => {
        const argv = yargs()
          .parserConfiguration({'deep-merge-config': true})
          .config({
            extends: './test/fixtures/extends/config_deep_2.json',
            a: {
              g: 3,
            },
          })
          .parse();

        argv.test.yes.should.equal(1);
        argv.a.b.should.equal(12);
        argv.a.c.should.equal(12);
        argv.a.g.should.equal(3);
      });

      it('does not deep merge objects by default', () => {
        const argv = yargs()
          .config({
            extends: './test/fixtures/extends/config_deep.json',
            a: {
              b: 11,
              d: [5, 2],
              f: 'no',
              g: {
                h: 122,
              },
            },
          })
          .parse();

        argv.a.b.should.equal(11);
        argv.a.should.not.have.property('c');
        argv.a.d.should.deep.equal([5, 2]);
        argv.a.should.not.have.property('e');
        argv.a.f.should.equal('no');
        argv.a.g.h.should.equal(122);
      });
    });
  });

  describe('normalize', () => {
    it('normalizes paths passed as arguments', () => {
      const argv = yargs('--path /foo/bar//baz/asdf/quux/..')
        .normalize(['path'])
        .parse();

      argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep));
    });

    it('normalizes path when when it is updated', () => {
      const argv = yargs('--path /batman').normalize(['path']).parse();

      argv.path = '/foo/bar//baz/asdf/quux/..';
      argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep));
    });

    it('allows key to be specified with option shorthand', () => {
      const argv = yargs('--path /batman')
        .option('path', {
          normalize: true,
        })
        .parse();

      argv.path = '/foo/bar//baz/asdf/quux/..';
      argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep));
    });

    it('can be disabled with option shorthand', () => {
      const argv = yargs('--path /batman')
        .option('path', {
          normalize: false,
        })
        .parse();

      argv.path = 'mongodb://url';
      argv.path.should.equal('mongodb://url');
    });
  });

  describe('narg', () => {
    it('accepts a key as the first argument and a count as the second', () => {
      const argv = yargs('--foo a b c').nargs('foo', 2).parse();

      argv.foo.should.deep.equal(['a', 'b']);
      argv._.should.deep.equal(['c']);
    });

    it('accepts a hash of keys and counts', () => {
      const argv = yargs('--foo a b c')
        .nargs({
          foo: 2,
        })
        .parse();

      argv.foo.should.deep.equal(['a', 'b']);
      argv._.should.deep.equal(['c']);
    });

    it('allows key to be specified with option shorthand', () => {
      const argv = yargs('--foo a b c')
        .option('foo', {
          nargs: 2,
        })
        .parse();

      argv.foo.should.deep.equal(['a', 'b']);
      argv._.should.deep.equal(['c']);
    });
  });

  describe('global', () => {
    it('does not reset a global options when reset is called', () => {
      const y = yargs('--foo a b c')
        .option('foo', {
          nargs: 2,
        })
        .option('bar', {
          nargs: 2,
          global: false,
        })
        .global('foo')
        .getInternalMethods()
        .reset();
      const options = y.getOptions();
      options.key.foo.should.equal(true);
      expect(options.key.bar).to.equal(undefined);
    });

    it('does not reset alias of global option', () => {
      const y = yargs('--foo a b c')
        .option('foo', {
          nargs: 2,
          alias: 'awesome-sauce',
        })
        .string('awesome-sauce')
        .demand('awesomeSauce')
        .option('bar', {
          nargs: 2,
          string: true,
          demand: true,
          global: false,
        })
        .global('foo')
        .getInternalMethods()
        .reset({
          foo: ['awesome-sauce', 'awesomeSauce'],
        });
      const options = y.getOptions();

      options.key.foo.should.equal(true);
      options.string.should.include('awesome-sauce');
      Object.keys(options.demandedOptions).should.include('awesomeSauce');

      expect(options.key.bar).to.equal(undefined);
      options.string.should.not.include('bar');
      Object.keys(options.demandedOptions).should.not.include('bar');
    });

    it('should set help to global option by default', () => {
      const y = yargs('--foo').help('help');
      const options = y.getOptions();
      options.local.should.not.include('help');
    });

    it('should set version to global option by default', () => {
      const y = yargs('--foo').version();
      const options = y.getOptions();
      options.local.should.not.include('version');
    });

    it('should not reset usage descriptions of global options', () => {
      const y = yargs('--foo')
        .describe('bar', 'my awesome bar option')
        .describe('foo', 'my awesome foo option')
        .global('foo')
        .global('bar', false)
        .getInternalMethods()
        .reset();
      const descriptions = y
        .getInternalMethods()
        .getUsageInstance()
        .getDescriptions();
      Object.keys(descriptions).should.include('foo');
      Object.keys(descriptions).should.not.include('bar');
    });

    it('should not reset implications of global options', () => {
      const y = yargs(['--x=33'])
        .implies({
          x: 'y',
        })
        .implies({
          z: 'w',
        })
        .global(['z'], false)
        .getInternalMethods()
        .reset();
      const implied = y
        .getInternalMethods()
        .getValidationInstance()
        .getImplied();
      Object.keys(implied).should.include('x');
      Object.keys(implied).should.not.include('z');
    });

    it('should expose an options short-hand for declaring global options', () => {
      const y = yargs('--foo a b c')
        .option('foo', {
          nargs: 2,
        })
        .option('bar', {
          nargs: 2,
          global: false,
        })
        .getInternalMethods()
        .reset();
      const options = y.getOptions();
      options.key.foo.should.equal(true);
      expect(options.key.bar).to.equal(undefined);
    });
  });

  describe('pkgConf', () => {
    it('uses values from package.json', () => {
      const argv = yargs('--foo a').pkgConf('repository').parse();

      argv.foo.should.equal('a');
      argv.type.should.equal('git');
    });

    it('combines yargs defaults with package.json values', () => {
      const argv = yargs('--foo a')
        .defaults('b', 99)
        .pkgConf('repository')
        .parse();

      argv.b.should.equal(99);
      argv.foo.should.equal('a');
      argv.type.should.equal('git');
    });

    it('should use value from package.json, if argv value is using default value', () => {
      const argv = yargs('--foo a')
        .default('b', 99)
        .pkgConf('repository')
        .default('type', 'default')
        .parse();

      argv.b.should.equal(99);
      argv.foo.should.equal('a');
      argv.type.should.equal('git');
    });

    it('should apply value from config object to all aliases', () => {
      const argv = yargs('--foo a')
        .pkgConf('repository')
        .alias('type', 't')
        .alias('t', 'u')
        .parse();

      argv.foo.should.equal('a');
      argv.type.should.equal('git');
      argv.t.should.equal('git');
      argv.u.should.equal('git');
    });

    it('is cool with a key not existing', () => {
      const argv = yargs('--foo a').default('b', 99).pkgConf('banana').parse();

      argv.b.should.equal(99);
      argv.foo.should.equal('a');
      expect(argv.type).to.equal(undefined);
    });

    it('allows an alternative cwd to be specified', () => {
      const argv = yargs('--foo a').pkgConf('blerg', './test/fixtures').parse();

      argv.foo.should.equal('a');
      argv.dotNotation.should.equal(false);
    });

    it("doesn't mess up other pkg lookups when cwd is specified", () => {
      const r = checkOutput(() =>
        yargs('--version')
          .pkgConf('repository', './test/fixtures')
          .version()
          .parse()
      );
      const options = yargs.getOptions();

      // assert pkgConf lookup (test/fixtures/package.json)
      options.configObjects.should.deep.equal([{type: 'svn'}]);
      // assert parseArgs and guessVersion lookup (package.json)
      expect(options.configuration['dot-notation']).to.equal(undefined);
      r.logs[0].should.not.equal('9.9.9'); // breaks when yargs gets to this version
    });

    // see https://github.com/yargs/yargs/issues/485
    it('handles an invalid package.json', () => {
      const argv = yargs('--foo a')
        .pkgConf('yargs', './test/fixtures/broken-json')
        .parse();

      argv.foo.should.equal('a');
    });

    it('should apply default configurations from extended packages', () => {
      const argv = yargs()
        .pkgConf('foo', 'test/fixtures/extends/packageA')
        .parse();

      argv.a.should.equal(80);
      argv.b.should.equals('riffiwobbles');
    });

    it('should apply extended configurations from cwd when no path is given', () => {
      const argv = yargs('', 'test/fixtures/extends/packageA')
        .pkgConf('foo')
        .parse();

      argv.a.should.equal(80);
      argv.b.should.equals('riffiwobbles');
    });
  });

  describe('parserConfiguration', () => {
    it('overrides the default parser configuration', () => {
      const argv = yargs('--foo.bar 1 --no-baz 2')
        .parserConfiguration({'boolean-negation': false, 'dot-notation': false})
        .parse();
      expect(argv['foo.bar']).to.equal(1);
      argv.noBaz.should.equal(2);
    });

    it('supports --unknown-options-as-args', () => {
      const argv = yargs('--foo.bar 1 --no-baz 2')
        .parserConfiguration({'unknown-options-as-args': true})
        .parse();
      argv._.should.deep.eql(['--foo.bar', 1, '--no-baz', 2]);
      const argv2 = yargs('foo --foo.bar --cool 1 --no-baz 2')
        .command(
          'foo',
          'my foo command',
          yargs => {
            yargs.boolean('cool');
          },
          () => {}
        )
        .parserConfiguration({'unknown-options-as-args': true})
        .parse();
      argv2._.should.deep.eql(['foo', '--foo.bar', 1, '--no-baz', 2]);
      argv2.cool.should.equal(true);
    });
  });

  describe('skipValidation', () => {
    it('skips validation if an option with skipValidation is present', () => {
      const argv = yargs(['--koala', '--skip'])
        .demand(1)
        .fail(msg => {
          expect.fail();
        })
        .skipValidation(['skip', 'reallySkip'])
        .parse();
      argv.koala.should.equal(true);
    });

    it('does not skip validation if no option with skipValidation is present', done => {
      const argv = yargs(['--koala'])
        .demand(1)
        .fail(msg => done())
        .skipValidation(['skip', 'reallySkip'])
        .parse();
      argv.koala.should.equal(true);
    });

    it('allows key to be specified with option shorthand', () => {
      const argv = yargs(['--koala', '--skip'])
        .demand(1)
        .fail(msg => {
          expect.fail();
        })
        .option('skip', {
          skipValidation: true,
        })
        .parse();
      argv.koala.should.equal(true);
    });

    it('allows having an option that skips validation but not skipping validation if that option is not used', () => {
      let skippedValidation = true;
      yargs(['--no-skip'])
        .demand(5)
        .option('skip', {
          skipValidation: true,
        })
        .fail(msg => {
          skippedValidation = false;
        })
        .parse();
      expect(skippedValidation).to.equal(false);
    });
  });

  describe('.help()', () => {
    it('enables `--help` option and `help` command without arguments', () => {
      const option = checkOutput(() => yargs('--help').wrap(null).parse());
      const command = checkOutput(() => yargs('help').wrap(null).parse());
      const expected = [
        'Options:',
        '  --help     Show help  [boolean]',
        '  --version  Show version number  [boolean]',
      ];
      option.logs[0].split('\n').should.deep.equal(expected);
      command.logs[0].split('\n').should.deep.equal(expected);
    });

    it('enables `--help` option and `help` command with `true` argument', () => {
      const option = checkOutput(() =>
        yargs('--help').help(true).wrap(null).parse()
      );
      const command = checkOutput(() =>
        yargs('help').help(true).wrap(null).parse()
      );
      const expected = [
        'Options:',
        '  --version  Show version number  [boolean]',
        '  --help     Show help  [boolean]',
      ];
      option.logs[0].split('\n').should.deep.equal(expected);
      command.logs[0].split('\n').should.deep.equal(expected);
    });

    it('enables given string as help option and command with string argument', () => {
      const option = checkOutput(() =>
        yargs('--info').help('info').wrap(null).parse()
      );
      const command = checkOutput(() =>
        yargs('info').help('info').wrap(null).parse()
      );
      const helpOption = checkOutput(() =>
        yargs('--help').help('info').wrap(null).parse()
      );
      const expected = [
        'Options:',
        '  --version  Show version number  [boolean]',
        '  --info     Show help  [boolean]',
      ];
      option.logs[0].split('\n').should.deep.equal(expected);
      command.logs[0].split('\n').should.deep.equal(expected);
      helpOption.result.should.have.property('help').and.equal(true);
    });

    it('enables given string as help option and command with custom description with two string arguments', () => {
      const option = checkOutput(() =>
        yargs('--info').help('info', 'Display info').wrap(null).parse()
      );
      const command = checkOutput(() =>
        yargs('info').help('info', 'Display info').wrap(null).parse()
      );
      const expected = [
        'Options:',
        '  --version  Show version number  [boolean]',
        '  --info     Display info  [boolean]',
      ];
      option.logs[0].split('\n').should.deep.equal(expected);
      command.logs[0].split('\n').should.deep.equal(expected);
    });

    it('enables given string as help option and command with custom description with two string arguments and `true` argument', () => {
      const option = checkOutput(() =>
        yargs('--info').help('info', 'Display info', true).wrap(null).parse()
      );
      const command = checkOutput(() =>
        yargs('info').help('info', 'Display info', true).wrap(null).parse()
      );
      const expected = [
        'Options:',
        '  --version  Show version number  [boolean]',
        '  --info     Display info  [boolean]',
      ];
      option.logs[0].split('\n').should.deep.equal(expected);
      command.logs[0].split('\n').should.deep.equal(expected);
    });
  });

  describe('.help() with .alias()', () => {
    it('uses multi-char (but not single-char) help alias as command', () => {
      const info = checkOutput(() =>
        yargs('info')
          .help()
          .alias('h', 'help')
          .alias('h', 'info')
          .wrap(null)
          .parse()
      );
      const h = checkOutput(() =>
        yargs('h')
          .help()
          .alias('h', 'help')
          .alias('h', 'info')
          .wrap(null)
          .parse()
      );
      info.logs[0]
        .split('\n')
        .should.deep.equal([
          'Options:',
          '      --version       Show version number  [boolean]',
          '  -h, --help, --info  Show help  [boolean]',
        ]);
      h.result.should.have.property('_').and.deep.equal(['h']);
    });
  });

  describe('.coerce()', () => {
    it('supports string and function args (as option key and coerce function)', () => {
      const argv = yargs([
        '--file',
        path.join(__dirname, 'fixtures', 'package.json'),
      ])
        .alias('file', 'f')
        .coerce('file', arg => JSON.parse(fs.readFileSync(arg, 'utf8')))
        .parse();
      expect(argv.file).to.have.property('version').and.equal('9.9.9');
    });

    it('supports object arg (as map of multiple options)', () => {
      const argv = yargs('--expand abc --range 1..3')
        .coerce({
          expand(arg) {
            return arg.split('');
          },
          range(arg) {
            const arr = arg.split('..').map(Number);
            return {begin: arr[0], end: arr[1]};
          },
        })
        .parse();
      expect(argv.expand).to.deep.equal(['a', 'b', 'c']);
      expect(argv.range).to.have.property('begin').and.equal(1);
      expect(argv.range).to.have.property('end').and.equal(3);
    });

    it('supports array and function args (as option keys and coerce function)', () => {
      const argv = yargs(['--src', 'in', '--dest', 'out'])
        .coerce(['src', 'dest'], arg => path.resolve(arg))
        .parse();
      argv.src.should.match(/in/).and.have.length.above(2);
      argv.dest.should.match(/out/).and.have.length.above(3);
    });

    it('allows an error to be handled by fail() handler', () => {
      let msg;
      let err;
      let jsonErrMessage;
      yargs('--json invalid')
        .coerce('json', arg => {
          try {
            JSON.parse(arg);
          } catch (err) {
            jsonErrMessage = err.message;
          }
          return JSON.parse(arg);
        })
        .fail((m, e) => {
          msg = m;
          err = e;
        })
        .parse();
      expect(msg).to.equal(jsonErrMessage);
      expect(err).to.not.equal(undefined);
    });

    it('supports an option alias', () => {
      const argv = yargs('-d 2016-08-12')
        .coerce('date', Date.parse)
        .alias('date', 'd')
        .parse();
      argv.date.should.equal(1470960000000);
    });

    it('supports a global option within command', () => {
      let regex;
      yargs('check --regex x')
        .global('regex')
        .coerce('regex', RegExp)
        .command('check', 'Check something', {}, argv => {
          regex = argv.regex;
        })
        .parse();
      expect(regex).to.be.an.instanceof(RegExp);
      regex.toString().should.equal('/x/');
    });

    it('is supported by .option()', () => {
      const argv = yargs('--env SHELL=/bin/bash')
        .option('env', {
          coerce(arg) {
            const arr = arg.split('=');
            return {name: arr[0], value: arr[1] || ''};
          },
        })
        .parse();
      expect(argv.env).to.have.property('name').and.equal('SHELL');
      expect(argv.env).to.have.property('value').and.equal('/bin/bash');
    });

    it('supports positional and variadic args for a command', () => {
      let age;
      let dates;
      yargs('add 30days 2016-06-13 2016-07-18')
        .command(
          'add <age> [dates..]',
          'Testing',
          yargs =>
            yargs
              .coerce('age', arg => parseInt(arg, 10) * 86400000)
              .coerce('dates', arg => arg.map(str => new Date(str))),
          argv => {
            age = argv.age;
            dates = argv.dates;
          }
        )
        .parse();
      expect(age).to.equal(2592000000);
      expect(dates).to.have.lengthOf(2);
      dates[0].toString().should.equal(new Date('2016-06-13').toString());
      dates[1].toString().should.equal(new Date('2016-07-18').toString());
    });

    it('returns camelcase args for a command', () => {
      let age1;
      let age2;
      let dates;
      yargs('add 30days 2016-06-13 2016-07-18')
        .command(
          'add <age-in-days> [dates..]',
          'Testing',
          yargs =>
            yargs
              .coerce('age-in-days', arg => parseInt(arg, 10) * 86400000)
              .coerce('dates', arg => arg.map(str => new Date(str))),
          argv => {
            age1 = argv.ageInDays;
            age2 = argv['age-in-days'];
            dates = argv.dates;
          }
        )
        .parse();
      expect(age1).to.equal(2592000000);
      expect(age2).to.equal(2592000000);
      expect(dates).to.have.lengthOf(2);
      dates[0].toString().should.equal(new Date('2016-06-13').toString());
      dates[1].toString().should.equal(new Date('2016-07-18').toString());
    });

    it('allows an error from positional arg to be handled by fail() handler', () => {
      let msg;
      let err;
      yargs('throw ball')
        .command('throw <msg>', false, yargs =>
          yargs
            .coerce('msg', arg => {
              throw new Error(arg);
            })
            .fail((m, e) => {
              msg = m;
              err = e;
            })
        )
        .parse();
      expect(msg).to.equal('ball');
      expect(err).to.not.equal(undefined);
    });

    it('throws error if coerce callback is missing', () => {
      assert.throws(() => {
        yargs().coerce(['a', 'b']);
      }, /coerce callback must be provided/);
      assert.throws(() => {
        yargs().coerce('c');
      }, /coerce callback must be provided/);
    });

    // Refs: https://github.com/yargs/yargs/issues/1909
    it('shows coerced option in help', async () => {
      const help = await yargs()
        .option('option1', {
          describe: 'option1 description',
          type: 'string',
          demandOption: true,
        })
        .option('option2', {
          describe: 'option2 description',
          type: 'string',
          demandOption: true,
        })
        .coerce('option2', () => undefined)
        .getHelp();
      help.should.match(/option2 description/);
    });

    it('argv includes coerced aliases', () => {
      const argv = yargs('--foo bar')
        .option('foo', {
          coerce: s => s.toUpperCase(),
          alias: 'f',
        })
        .parse();
      argv['foo'].should.equal('BAR');
      argv['f'].should.equal('BAR');
    });

    it('argv includes coerced camelCase', () => {
      const argv = yargs('--foo-foo bar')
        .option('foo-foo', {
          coerce: s => s.toUpperCase(),
        })
        .parse();
      argv['foo-foo'].should.equal('BAR');
      argv['fooFoo'].should.equal('BAR');
    });

    it('coerce still works when key used for coerce is not explicitly present in argv', () => {
      const argv = yargs('--foo-foo bar')
        .option('foo-foo')
        .coerce('foo-foo', s => s.toUpperCase())
        .parserConfiguration({'strip-dashed': true})
        .parse();
      expect(argv['foo-foo']).to.equal(undefined);
      argv['fooFoo'].should.equal('BAR');
    });

    it('argv does not include stripped aliases', () => {
      const argv = yargs('-f bar')
        .option('foo-foo', {
          coerce: s => s.toUpperCase(),
          alias: 'f',
        })
        .parserConfiguration({'strip-aliased': true})
        .parse();
      argv['foo-foo'].should.equal('BAR');
      argv['fooFoo'].should.equal('BAR');
      expect(argv['f']).to.equal(undefined);
    });

    it('argv does not include stripped dashes', () => {
      const argv = yargs('-f bar')
        .option('foo-foo', {
          coerce: s => s.toUpperCase(),
          alias: 'f',
        })
        .parserConfiguration({'strip-dashed': true})
        .parse();
      expect(argv['foo-foo']).to.equal(undefined);
      argv['fooFoo'].should.equal('BAR');
      argv['f'].should.equal('BAR');
    });

    it('argv does not include disabled camel-case-expansion', () => {
      const argv = yargs('-f bar')
        .option('foo-foo', {
          coerce: s => s.toUpperCase(),
          alias: 'f',
        })
        .parserConfiguration({'camel-case-expansion': false})
        .parse();
      argv['foo-foo'].should.equal('BAR');
      expect(argv['fooFoo']).to.equal(undefined);
      argv['f'].should.equal('BAR');
    });
  });

  describe('stop parsing', () => {
    it('populates argv._ with unparsed arguments after "--"', () => {
      const argv = yargs.parse('--foo 33 --bar=99 -- --grep=foobar');
      argv.foo.should.equal(33);
      argv.bar.should.equal(99);
      argv._.length.should.equal(1);
      argv._[0].should.equal('--grep=foobar');
    });
  });

  describe('yargs context', () => {
    beforeEach(() => {
      clearRequireCache();
      yargs = require('../index.cjs');
    });

    it('should track commands being executed', () => {
      let context;
      yargs('one two')
        .command(
          'one',
          'level one',
          yargs => {
            context = yargs.getInternalMethods().getContext();
            context.commands.should.deep.equal(['one']);
            return yargs.command(
              'two',
              'level two',
              yargs => {
                context.commands.should.deep.equal(['one', 'two']);
              },
              argv => {
                context.commands.should.deep.equal(['one', 'two']);
              }
            );
          },
          argv => {
            context.commands.should.deep.equal(['one']);
          }
        )
        .parse();
      context.commands.should.deep.equal([]);
    });
  });

  describe('positional', () => {
    it('defaults array with no arguments to []', () => {
      const args = yargs('cmd')
        .command('cmd [foo..]', 'run the cmd', yargs => {
          yargs.positional('foo', {
            describe: 'foo positionals',
          });
        })
        .parse();
      args.foo.should.eql([]);
    });

    it('populates array with appropriate arguments', () => {
      const args = yargs('cmd /tmp/foo/bar a b')
        .command('cmd <file> [foo..]', 'run the cmd', yargs => {
          yargs
            .positional('file', {
              describe: 'the required bit',
            })
            .positional('foo', {
              describe: 'the variadic bit',
            });
        })
        .parse();
      args.file.should.equal('/tmp/foo/bar');
      args.foo.should.eql(['a', 'b']);
    });

    it('allows a conflicting argument to be specified', done => {
      yargs()
        .command('cmd <hero>', 'a command', yargs => {
          yargs.positional('hero', {
            conflicts: 'conflicting',
          });
        })
        .parse('cmd batman --conflicting', err => {
          err.message.should.equal(
            'Arguments hero and conflicting are mutually exclusive'
          );
          return done();
        });
    });

    it('allows a default to be set', () => {
      const argv = yargs('cmd')
        .command('cmd [heroes...]', 'a command', yargs => {
          yargs.positional('heroes', {
            default: ['batman', 'Iron Man'],
          });
        })
        .parse();
      argv.heroes.should.eql(['batman', 'Iron Man']);
    });

    it('allows a defaultDescription to be set', () => {
      const r = checkOutput(() =>
        yargs('cmd --help')
          .wrap(null)
          .command('cmd [heroes...]', 'a command', yargs => {
            yargs.positional('heroes', {
              default: ['batman', 'Iron Man'],
              defaultDescription: 'batman and Iron Man',
            });
          })
          .parse()
      );
      r.logs
        .join('\n')
        .split(/\n+/)
        .should.deep.equal([
          'usage cmd [heroes...]',
          'a command',
          'Positionals:',
          '  heroes  [array] [default: batman and Iron Man]',
          'Options:',
          '  --help     Show help  [boolean]',
          '  --version  Show version number  [boolean]',
        ]);
    });

    it('allows an implied argument to be specified', done => {
      yargs()
        .command('cmd <hero>', 'a command', yargs => {
          yargs.positional('hero', {
            implies: 'universe',
          });
        })
        .parse('cmd batman', err => {
          err.message.should.match(/hero -> universe/);
          return done();
        });
    });

    it('allows an alias to be provided', () => {
      const argv = yargs('cmd')
        .command('cmd [heroes...]', 'a command', yargs => {
          yargs.positional('heroes', {
            alias: 'do-gooders',
            default: ['batman', 'robin'],
          });
        })
        .parse();
      argv.heroes.should.eql(['batman', 'robin']);
      argv.doGooders.should.eql(['batman', 'robin']);
      argv['do-gooders'].should.eql(['batman', 'robin']);
    });

    it('allows normalize to be specified', () => {
      const argv = yargs('cmd /tmp/awesome/../ /tmp/awesome/b/../')
        .command('cmd <files...>', 'a command', yargs => {
          yargs.positional('files', {
            normalize: true,
          });
        })
        .parse();
      argv.files.should.eql([
        '/tmp/'.replace(/\//g, path.sep),
        '/tmp/awesome/'.replace(/\//g, path.sep),
      ]);
    });

    it('allows a choices array to be specified', done => {
      yargs()
        .command('cmd <hero>', 'a command', yargs => {
          yargs.positional('hero', {
            choices: ['batman', 'Iron Man', 'robin'],
          });
        })
        .parse('cmd joker', err => {
          err.message.should.match(
            /Argument: hero, Given: "joker", Choices: "batman"/
          );
          return done();
        });
    });

    it('allows a coerce method to be provided', () => {
      const argv = yargs('cmd batman')
        .command('cmd <hero>', 'a command', yargs => {
          yargs.positional('hero', {
            coerce: arg => arg.toUpperCase(),
            alias: 'do-gooder',
          });
        })
        .parse();
      argv.hero.should.equal('BATMAN');
      argv.doGooder.should.equal('BATMAN');
    });

    it('allows a boolean type to be specified', () => {
      const argv = yargs('cmd false')
        .command('cmd [run]', 'a command', yargs => {
          yargs.positional('run', {
            type: 'boolean',
          });
        })
        .parse();
      argv.run.should.equal(false);
    });

    it('allows a number type to be specified', () => {
      const argv = yargs('cmd nan')
        .command('cmd [count]', 'a command', yargs => {
          yargs.positional('count', {
            type: 'number',
          });
        })
        .parse();
      isNaN(argv.count).should.equal(true);
    });

    it('allows a string type to be specified', () => {
      const argv = yargs('cmd 33')
        .command('cmd [str]', 'a command', yargs => {
          yargs.positional('str', {
            type: 'string',
          });
        })
        .parse();
      argv.str.should.equal('33');
    });

    it('allows positional arguments for subcommands to be configured', () => {
      const argv = yargs('cmd subcommand 33')
        .command('cmd', 'a command', yargs => {
          yargs.command('subcommand [str]', 'a subcommand', yargs => {
            yargs.positional('str', {
              type: 'string',
            });
          });
        })
        .parse();

      argv.str.should.equal('33');
    });

    it('allows positionals to be defined for default command', async () => {
      const help = await yargs()
        .command('* [foo]', 'default command')
        .positional('foo', {
          default: 33,
          type: 'number',
        })
        .getHelp();
      help.should.include('default: 33');
      help.should.include('default command');
    });

    // see: https://github.com/yargs/yargs-parser/pull/110
    it('does not parse large scientific notation values, when type string', done => {
      yargs('cmd')
        .command('cmd deploy <version>', 'a command', yargs => {
          yargs.version(false).positional('version', {
            type: 'string',
          });
        })
        .parse('cmd deploy 123e123', (err, argv) => {
          if (err) {
            return done(err);
          }
          argv.version.should.eql('123e123');
          return done();
        });
    });
  });

  // see: https://github.com/babel/babel/pull/10733
  it('should not fail if command handler freezes object', () => {
    const argv = yargs()
      .command(
        'cmd',
        'a command',
        yargs => {
          yargs.parserConfiguration({'populate--': true});
        },
        argv => {
          Object.freeze(argv);
          argv._.should.eql(['cmd']);
          argv['--'].should.eql(['foo']);
        }
      )
      .parse(['cmd', '--', 'foo']);
    argv._.should.eql(['cmd', 'foo']);
    // This should actually not be undefined, once we fix
    // #1482.
    argv['--'].should.eql(['foo']);
  });

  // See: https://github.com/yargs/yargs/issues/1098
  it('should allow array and requires arg to be used in conjunction', () => {
    const argv = yargs(['-i', 'item1', 'item2', 'item3'])
      .option('i', {
        alias: 'items',
        type: 'array',
        requiresArg: true,
      })
      .parse();
    argv.items.should.eql(['item1', 'item2', 'item3']);
    argv.i.should.eql(['item1', 'item2', 'item3']);
  });

  // See: https://github.com/yargs/yargs/issues/1570
  describe('"nargs" with "array"', () => {
    it('should not consume more than nargs items', () => {
      const argv = yargs([
        '-i',
        'item1',
        'item2',
        '-i',
        'item3',
        'item4',
      ]).option('i', {
        alias: 'items',
        type: 'array',
        nargs: 1,
      }).argv;
      argv.items.should.eql(['item1', 'item3']);
      argv.i.should.eql(['item1', 'item3']);
      argv._.should.eql(['item2', 'item4']);
    });

    it('should apply nargs with higher precedence than requiresArg: true', () => {
      const argv = yargs([
        '-i',
        'item1',
        'item2',
        '-i',
        'item3',
        'item4',
      ]).option('i', {
        alias: 'items',
        type: 'array',
        nargs: 1,
        requiresArg: true,
      }).argv;
      argv.items.should.eql(['item1', 'item3']);
      argv.i.should.eql(['item1', 'item3']);
      argv._.should.eql(['item2', 'item4']);
    });

    // TODO: make this work with aliases, using a check similar to
    // checkAllAliases() in yargs-parser.
    it('should apply nargs with higher precedence than requiresArg()', () => {
      const argv = yargs(['-i', 'item1', 'item2', '-i', 'item3', 'item4'])
        .option('items', {
          alias: 'i',
          type: 'array',
          nargs: 1,
        })
        .requiresArg(['items']).argv;
      argv.items.should.eql(['item1', 'item3']);
      argv.i.should.eql(['item1', 'item3']);
      argv._.should.eql(['item2', 'item4']);
    });

    it('should raise error if not enough values follow nargs key', done => {
      yargs
        .option('i', {
          alias: 'items',
          type: 'array',
          nargs: 1,
        })
        .parse(['-i'], err => {
          err.message.should.match(/Not enough arguments following: i/);
          return done();
        });
    });
  });

  // See: https://github.com/nodejs/node/issues/31951
  describe('should not pollute the prototype', () => {
    it('does not pollute, when .parse() is called', () => {
      yargs.parse([
        '-f.__proto__.foo',
        '99',
        '-x.y.__proto__.bar',
        '100',
        '--__proto__',
        '200',
      ]);
      Object.keys({}.__proto__).length.should.equal(0) // eslint-disable-line
      expect({}.foo).to.equal(undefined);
      expect({}.bar).to.equal(undefined);
    });

    it('does not pollute, when .argv is called', () => {
      yargs(['-f.__proto__.foo', '99', '-x.y.__proto__.bar', '100', '--__proto__', '200']).argv // eslint-disable-line
      Object.keys({}.__proto__).length.should.equal(0) // eslint-disable-line
      expect({}.foo).to.equal(undefined);
      expect({}.bar).to.equal(undefined);
    });

    // TODO(bcoe): due to replacement of __proto__ with ___proto___ parser
    // hints are not properly applied, we should move to an alternate approach
    // in the future:
    it('does not pollute, when options are set', () => {
      yargs
        .option('__proto__', {
          describe: 'pollute pollute',
          nargs: 33,
        })
        .default('__proto__', {hello: 'world'})
        .parse(['--foo']);
        Object.keys({}.__proto__).length.should.equal(0) // eslint-disable-line
    });
  });

  describe('parsing --value as a value in -f=--value and --bar=--value', () => {
    it('should work in the general case', () => {
      const argv = yargs([
        '-f=--item1',
        'item2',
        '--bar=--item3',
        'item4',
      ]).argv;
      argv.f.should.eql('--item1');
      argv.bar.should.eql('--item3');
      argv._.should.eql(['item2', 'item4']);
    });

    it('should work with array', () => {
      const argv = yargs([
        '-f=--item1',
        'item2',
        '--bar=--item3',
        'item4',
      ]).array(['f', 'bar']).argv;
      argv.f.should.eql(['--item1', 'item2']);
      argv.bar.should.eql(['--item3', 'item4']);
      argv._.should.eql([]);
    });

    it('should work with nargs', () => {
      const argv = yargs([
        '-f=--item1',
        'item2',
        'item3',
        '--bar=--item4',
        'item5',
        'item6',
      ])
        .option('f', {nargs: 2})
        .option('bar', {nargs: 2}).argv;
      argv.f.should.eql(['--item1', 'item2']);
      argv.bar.should.eql(['--item4', 'item5']);
      argv._.should.eql(['item3', 'item6']);
    });

    it('should work with both array and nargs', () => {
      const argv = yargs([
        '-f=--item1',
        'item2',
        '-f',
        'item3',
        'item4',
        '--bar=--item5',
        'item6',
        '--bar',
        'item7',
        'item8',
      ]).option('f', {alias: 'bar', array: true, nargs: 1}).argv;
      argv.f.should.eql(['--item1', 'item3', '--item5', 'item7']);
      argv.bar.should.eql(['--item1', 'item3', '--item5', 'item7']);
      argv._.should.eql(['item2', 'item4', 'item6', 'item8']);
    });
  });

  it('throws error for unsupported Node.js versions', () => {
    process.env.YARGS_MIN_NODE_VERSION = '55';
    clearRequireCache();
    expect(() => {
      require('../index.cjs');
    }).to.throw(/yargs supports a minimum Node.js version of 55/);
    delete process.env.YARGS_MIN_NODE_VERSION;
  });

  // Handling of strings that look like numbers, see:
  // https://github.com/yargs/yargs/issues/1758
  describe('bug #1758', () => {
    it('does not drop .0 if flag is configured as string', () => {
      const argv = yargs('cmd --foo 33.0')
        .command('cmd [str]', 'a command', yargs => {
          return yargs.option('foo', {
            type: 'string',
          });
        })
        .parse();
      argv.foo.should.equal('33.0');
    });

    it('does not drop .0 if positional is configured as string', () => {
      const argv = yargs('cmd 33.0')
        .command('cmd [str]', 'a command', yargs => {
          return yargs.positional('str', {
            type: 'string',
          });
        })
        .parse();
      argv.str.should.equal('33.0');
    });

    it('continues to parse values in _ as numbers, when they look like numbers', () => {
      const argv = yargs('hello 33.0').parse();
      argv._[0].should.equal('hello');
      argv._[1].should.equal(33);
    });
  });

  // See: https://github.com/yargs/yargs/issues/1420
  describe('async', () => {
    describe('parse', () => {
      it('calls parse callback once async handler has resolved', done => {
        let executionCount = 0;
        yargs()
          .command(
            'cmd [str]',
            'a command',
            () => {},
            async argv => {
              return new Promise(resolve => {
                setTimeout(() => {
                  argv.addedAsync = 99;
                  executionCount++;
                  return resolve(argv);
                }, 5);
              });
            }
          )
          .parse('cmd foo', async (_err, argv) => {
            argv.addedAsync.should.equal(99);
            argv.str.should.equal('foo');
            executionCount.should.equal(1);
            return done();
          });
      });
      it('calls parse callback once deeply nested promise has resolved', done => {
        let executionCount = 0;
        yargs()
          .command(
            'cmd',
            'a command',
            yargs => {
              yargs.command(
                'foo [apple]',
                'foo command',
                () => {},
                async argv => {
                  return new Promise(resolve => {
                    setTimeout(() => {
                      argv.addedAsync = 99;
                      executionCount++;
                      return resolve(argv);
                    }, 5);
                  });
                }
              );
            },
            () => {}
          )
          .parse('cmd foo orange', async (_err, argv) => {
            argv.addedAsync.should.equal(99);
            argv.apple.should.equal('orange');
            executionCount.should.equal(1);
            return done();
          });
      });
      it('populates err with async rejection', done => {
        let executionCount = 0;
        yargs()
          .command(
            'cmd [str]',
            'a command',
            () => {},
            async argv => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  executionCount++;
                  return reject(Error('async error'));
                }, 5);
              });
            }
          )
          .parse('cmd foo', async err => {
            err.message.should.equal('async error');
            executionCount.should.equal(1);
            return done();
          });
      });
      it('caches nested help output, so that it can be output by showHelp()', done => {
        let executionCount = 0;
        const y = yargs();
        y.command(
          'cmd [str]',
          'a command',
          () => {},
          async argv => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                executionCount++;
                return reject(Error('async error'));
              }, 5);
            });
          }
        ).parse('cmd foo', async (_err, argv) => {
          y.showHelp(output => {
            output.should.match(/a command/);
            executionCount.should.equal(1);
            return done();
          });
        });
      });
      it('caches deeply nested help output, so that it can be output by showHelp()', done => {
        let executionCount = 0;
        const y = yargs();
        y.command(
          'cmd',
          'a command',
          yargs => {
            yargs.command(
              'inner [foo]',
              'inner command',
              () => {},
              async argv => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    executionCount++;
                    return reject(Error('async error'));
                  }, 5);
                });
              }
            );
          },
          () => {}
        ).parse('cmd inner bar', async (_err, argv) => {
          y.showHelp(output => {
            output.should.match(/inner command/);
            executionCount.should.equal(1);
            return done();
          });
        });
      });
    });
    describe('argv', () => {
      it('returns promise that resolves argv on success', async () => {
        let executionCount = 0;
        const argvPromise = yargs('cmd foo').command(
          'cmd [str]',
          'a command',
          () => {},
          async argv => {
            return new Promise(resolve => {
              setTimeout(() => {
                argv.addedAsync = 99;
                executionCount++;
                return resolve();
              }, 5);
            });
          }
        ).argv;
        (typeof argvPromise.then).should.equal('function');
        const argv = await argvPromise;
        argv.addedAsync.should.equal(99);
        argv.str.should.equal('foo');
        executionCount.should.equal(1);
      });
      it('returns deeply nested promise that resolves argv on success', async () => {
        let executionCount = 0;
        const argvPromise = yargs('cmd foo orange')
          .command(
            'cmd',
            'a command',
            yargs => {
              yargs.command(
                'foo [apple]',
                'foo command',
                () => {},
                async argv => {
                  return new Promise(resolve => {
                    setTimeout(() => {
                      argv.addedAsync = 99;
                      executionCount++;
                      return resolve();
                    }, 5);
                  });
                }
              );
            },
            () => {}
          )
          .parse();
        (typeof argvPromise.then).should.equal('function');
        const argv = await argvPromise;
        argv.addedAsync.should.equal(99);
        argv.apple.should.equal('orange');
        executionCount.should.equal(1);
      });
      it('returns promise that can be caught if rejected', async () => {
        let executionCount = 0;
        const argv = yargs('cmd foo')
          .fail(false)
          .command(
            'cmd [str]',
            'a command',
            () => {},
            async argv => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  executionCount++;
                  return reject(Error('async error'));
                }, 5);
              });
            }
          ).argv;
        (typeof argv.then).should.equal('function');
        try {
          await argv;
          throw Error('unreachable');
        } catch (err) {
          err.message.should.equal('async error');
          executionCount.should.equal(1);
        }
      });
      it('caches nested help output, so that it can be output by showHelp()', async () => {
        let executionCount = 0;
        const y = yargs();
        const argv = y
          .fail(false)
          .command(
            'cmd [str]',
            'a command',
            () => {},
            async argv => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  executionCount++;
                  return reject(Error('async error'));
                }, 5);
              });
            }
          )
          .parse('cmd foo');
        (typeof argv.then).should.equal('function');
        try {
          await argv;
          throw Error('unreachable');
        } catch (err) {
          const output = await y.getHelp();
          output.should.match(/a command/);
          executionCount.should.equal(1);
        }
      });
      it('caches deeply nested help output, so that it can be output by showHelp()', async () => {
        let executionCount = 0;
        const y = yargs('cmd inner bar');
        const argv = y.fail(false).command(
          'cmd',
          'a command',
          yargs => {
            yargs.command(
              'inner [foo]',
              'inner command',
              () => {},
              async argv => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    executionCount++;
                    return reject(Error('async error'));
                  }, 5);
                });
              }
            );
          },
          () => {}
        ).argv;
        (typeof argv.then).should.equal('function');
        try {
          await argv;
          throw Error('unreachable');
        } catch (err) {
          const output = await y.getHelp();
          output.should.match(/inner command/);
          executionCount.should.equal(1);
        }
      });
    });
  });

  describe('getHelp', () => {
    it('should run parse() and return help, if parse() not yet called', async () => {
      const y = yargs(['--foo'])
        .options('foo', {
          alias: 'f',
          describe: 'foo option',
        })
        .wrap(null);
      const help = await y.getHelp();
      help
        .split('\n')
        .should.deep.equal([
          'Options:',
          '      --help     Show help  [boolean]',
          '      --version  Show version number  [boolean]',
          '  -f, --foo      foo option',
        ]);
    });
    it('should display top-level help with no command given', async () => {
      const y = yargs('--help')
        .command(
          ['list [pattern]', 'ls', '*'],
          'List key-value pairs for pattern',
          {},
          noop
        )
        .command('get <key>', 'Get value for key', {}, noop)
        .command('set <key> [value]', 'Set value for key', {}, noop);
      const help = await y.getHelp();
      help
        .split('\n')
        .should.deep.equal([
          'node [pattern]',
          '',
          'List key-value pairs for pattern',
          '',
          'Commands:',
          '  node list [pattern]     List key-value pairs for pattern',
          '                                                         [default] [aliases: ls]',
          '  node get <key>          Get value for key',
          '  node set <key> [value]  Set value for key',
          '',
          'Options:',
          '  --help     Show help                                                 [boolean]',
          '  --version  Show version number                                       [boolean]',
        ]);
    });
    it('should allow help to be output for failed command', async () => {
      const y = yargs('foo')
        .command(
          'foo',
          'foo command',
          () => {},
          async () => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                return reject(Error('async failure'));
              });
            });
          }
        )
        .fail(false);
      try {
        await y.argv;
        throw Error('unreachable');
      } catch (err) {
        err.message.should.equal('async failure');
        (await y.getHelp()).should.match(/foo command/);
      }
    });
    it('should allow help to be output for successful command', async () => {
      const y = yargs('foo').command(
        'foo',
        'foo command',
        () => {},
        async argv => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              argv.addedAsync = 99;
              return resolve();
            });
          });
        }
      );
      const argv = await y.argv;
      (await y.getHelp()).should.match(/foo command/);
      argv.addedAsync.should.equal(99);
      argv._.should.eql(['foo']);
    });
    it('should not run handler or middleware', async () => {
      let commandCalled = false;
      let middlewareCalled = false;
      const y = yargs('foo')
        .command(
          'foo',
          'foo command',
          () => {},
          async argv => {
            commandCalled = true;
          }
        )
        .middleware(() => {
          middlewareCalled = true;
        });
      (await y.getHelp()).should.match(/foo command/);
      commandCalled.should.equal(false);
      middlewareCalled.should.equal(false);
    });
    // Refs: #1853
    it('should use cached help message for nested synchronous commands', async () => {
      const y = yargs('object').command('object', 'object command', yargs => {
        yargs.command('get', 'get command');
      });
      const argv = y.argv;
      const help = await y.getHelp();
      help.should.match(/node object get/);
      argv._.should.eql(['object']);
    });
    it('should return appropriate help message when async builder used', async () => {
      const help = await yargs('foo')
        .command(
          'foo [bar]',
          'foo command',
          async yargs => {
            wait();
            return yargs.positional('foo', {
              demand: true,
              default: 'hello',
              type: 'string',
            });
          },
          async argv => {}
        )
        .getHelp();
      help.should.match(/default: "hello"/);
      help.should.match(/foo command/);
    });
  });
  describe('getters', () => {
    it('has getter for strict commands', () => {
      const y1 = yargs('foo').strictCommands();
      const y2 = yargs('bar');
      assert.strictEqual(y1.getStrictCommands(), true);
      assert.strictEqual(y2.getStrictCommands(), false);
    });
    it('has getter for strict options', () => {
      const y1 = yargs('foo').strictOptions();
      const y2 = yargs('bar');
      assert.strictEqual(y1.getStrictOptions(), true);
      assert.strictEqual(y2.getStrictOptions(), false);
    });
  });
  describe('parseAsync', () => {
    it('returns promise when parse is synchronous', () => {
      const argv = yargs('foo').parseAsync();
      assert.strictEqual(isPromise(argv), true);
    });
    it('returns promise when parse is asynchronous', async () => {
      const argv = yargs('--foo bar')
        .middleware(async () => {
          await wait();
        })
        .parseAsync();
      assert.strictEqual(isPromise(argv), true);
      assert.strictEqual((await argv).foo, 'bar');
    });
  });
  describe('parseSync', () => {
    it('succeeds if no async functions used during parsing', () => {
      const argv = yargs('foo 33')
        .command(
          'foo [bar]',
          'foo command',
          () => {},
          () => {}
        )
        .middleware(argv => {
          argv.bar *= 2;
        })
        .parseSync();
      assert.strictEqual(argv.bar, 66);
    });
    it('throws if any async method is used', () => {
      assert.throws(() => {
        yargs('foo 33')
          .command(
            'foo [bar]',
            'foo command',
            () => {},
            () => {}
          )
          .middleware(async argv => {
            argv.bar *= 2;
          })
          .parseSync();
      }, /.*parseSync\(\) must not be used.*/);
    });
  });
});
