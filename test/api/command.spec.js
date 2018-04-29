'use strict'
/* global describe, it, beforeEach, afterEach */

require('chai').should()
const expect = require('chai').expect
const checkOutput = require('../helpers/utils').checkOutput
const noop = () => {}

describe('command', () => {
  let yargs
  beforeEach(() => {
    yargs = require('../../')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../../')]
    yargs = undefined
  })

  it('executes command handler with parsed argv', (done) => {
    yargs(['blerg'])
      .command(
        'blerg',
        'handle blerg things',
        noop,
        (argv) => {
          // we should get the argv from the prior yargs.
          argv._[0].should.equal('blerg')
          return done()
        }
      )
      .exitProcess(false) // defaults to true.
      .argv
  })
  it('runs all middleware before reaching the handler', function (done) {
    yargs(['foo'])
      .command(
        'foo',
        'handle foo things',
        function () {},
        function (argv) {
          // we should get the argv filled with data from the middleware
          argv._[0].should.equal('foo')
          argv.hello.should.equal('world')
          return done()
        },
      [function (argv) {
        return {hello: 'world'}
      }]
      )
      .exitProcess(false) // defaults to true.
      .argv
  })
  it('recommends a similar command if no command handler is found', () => {
    const r = checkOutput(() => {
      yargs(['boat'])
        .command('goat')
        .recommendCommands()
        .argv
    })

    r.errors[2].should.match(/Did you mean goat/)
  })

  it('does not recommend a similiar command if no similar command exists', () => {
    const r = checkOutput(() => {
      yargs(['foo'])
        .command('nothingSimilar')
        .recommendCommands()
        .argv
    })

    r.logs.should.be.empty
  })

  it('recommends the longest match first', () => {
    const r = checkOutput(() => {
      yargs(['boat'])
        .command('bot')
        .command('goat')
        .recommendCommands()
        .argv
    })

    r.errors[2].should.match(/Did you mean goat/)
  })

  // see: https://github.com/yargs/yargs/issues/822
  it('does not print command recommendation if help message will be shown', (done) => {
    const parser = yargs()
      .command('goat')
      .help()
      .recommendCommands()

    parser.parse('boat help', {}, (err, _argv, output) => {
      if (err) return done(err)
      output.split('Commands:').length.should.equal(2)
      return done()
    })
  })

  it("skips executing root-level command if builder's help is executed", () => {
    const r = checkOutput(() => {
      yargs(['blerg', '-h'])
        .command(
          'blerg',
          'handle blerg things',
          yargs => yargs
              .command('snuh', 'snuh command')
              .help('h')
              .wrap(null),
          () => {
            throw Error('should not happen')
          }
        )
        .help('h')
        .argv
    })

    r.logs[0].split('\n').should.deep.equal([
      'usage blerg',
      '',
      'handle blerg things',
      '',
      'Commands:',
      '  usage blerg snuh  snuh command',
      '',
      'Options:',
      '  --version  Show version number  [boolean]',
      '  -h         Show help  [boolean]'
    ])
  })

  it('executes top-level help if no handled command is provided', () => {
    const r = checkOutput(() => {
      yargs(['snuh', '-h'])
        .command('blerg', 'handle blerg things', yargs => yargs
            .command('snuh', 'snuh command')
            .help('h')
            .argv
          )
        .help('h')
        .wrap(null)
        .argv
    })

    r.logs[0].split('\n').should.deep.equal([
      'usage [command]',
      '',
      'Commands:',
      '  usage blerg  handle blerg things',
      '',
      'Options:',
      '  --version  Show version number  [boolean]',
      '  -h         Show help  [boolean]'
    ])
  })

  it("accepts an object for describing a command's options", () => {
    const r = checkOutput(() => {
      yargs(['blerg', '-h'])
        .command('blerg <foo>', 'handle blerg things', {
          foo: {
            default: 99
          },
          bar: {
            default: 'hello world'
          }
        })
        .help('h')
        .wrap(null)
        .argv
    })

    const usageString = r.logs[0]
    usageString.should.match(/usage blerg <foo>/)
    usageString.should.match(/--foo.*default: 99/)
    usageString.should.match(/--bar.*default: "hello world"/)
  })

  it("accepts a module with a 'builder' and 'handler' key", () => {
    const argv = yargs(['blerg', 'bar'])
      .command('blerg <foo>', 'handle blerg things', require('../fixtures/command'))
      .argv

    argv.banana.should.equal('cool')
    argv.batman.should.equal('sad')
    argv.foo.should.equal('bar')

    global.commandHandlerCalledWith.banana.should.equal('cool')
    global.commandHandlerCalledWith.batman.should.equal('sad')
    global.commandHandlerCalledWith.foo.should.equal('bar')
    delete global.commandHandlerCalledWith
  })

  it("accepts a module with a keys 'command', 'describe', 'builder', and 'handler'", () => {
    const argv = yargs(['blerg', 'bar'])
      .command(require('../fixtures/command-module'))
      .argv

    argv.banana.should.equal('cool')
    argv.batman.should.equal('sad')
    argv.foo.should.equal('bar')

    global.commandHandlerCalledWith.banana.should.equal('cool')
    global.commandHandlerCalledWith.batman.should.equal('sad')
    global.commandHandlerCalledWith.foo.should.equal('bar')
    delete global.commandHandlerCalledWith
  })

  it('derives \'command\' string from filename when missing', () => {
    const argv = yargs('nameless --foo bar')
      .command(require('../fixtures/cmddir_noname/nameless'))
      .argv

    argv.banana.should.equal('cool')
    argv.batman.should.equal('sad')
    argv.foo.should.equal('bar')

    global.commandHandlerCalledWith.banana.should.equal('cool')
    global.commandHandlerCalledWith.batman.should.equal('sad')
    global.commandHandlerCalledWith.foo.should.equal('bar')
    delete global.commandHandlerCalledWith
  })

  it('throws error for non-module command object missing \'command\' string', () => {
    expect(() => {
      yargs.command({
        desc: 'A command with no name',
        builder (yargs) { return yargs },
        handler (argv) {}
      })
    }).to.throw(/No command name given for module: { desc: 'A command with no name',\n {2}builder: \[Function(: builder)?],\n {2}handler: \[Function(: handler)?] }/)
  })
})
