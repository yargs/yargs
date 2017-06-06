# yargs

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![NPM version][npm-image]][npm-url]
[![Windows Tests][windows-image]][windows-url]
[![js-standard-style][standard-image]][standard-url]
[![Conventional Commits][conventional-commits-image]][conventional-commits-url]
[![Gitter][gitter-image]][gitter-url]

> Yargs be a node.js library fer hearties tryin' ter parse optstrings.

Yargs helps you build interactive command line tools, by parsing arguments and generating an elegant user interface.

Yargs gives you:

* commands and (grouped) options (`my-program.js serve --port=5000`).
* a dynamically generated help menu based on your arguments.
* bash-completion shortcuts for commands and options.
* and tons more.

_tldr;_

```js
const yargs = require('yargs') // eslint-disable-line
  .command('serve', 'start the server', (yargs) => {
    yargs.option('port', {
      describe: 'port to bind on',
      default: 5000
    })    
  }, (argv) => {
    if (argv.verbose) console.info(`start server on :${argv.port}`)
    serve(argv.port)
  })
  .option('verbose', {
    alias: 'v',
    default: false
  })
  .help()
  .argv
```

## Table of Contents

* [Installation](/docs/installation.md)
  * [Configuration](/docs/installation.md#configuration)
* [Examples](/docs/examples.md)
* [API](/docs/api.md) **(you probably want me.)**
* [Parsing Tricks](/docs/tricks.md)
  * [Stop the Parser](/docs/tricks.md#stop)
  * [Negating Boolean Arguments](/docs/tricks.md#negate)
  * [Numbers](/docs/tricks.md#numbers)
  * [Arrays](/docs/tricks.md#arrays)
  * [Objects](/docs/tricks.md#objects)
* [Advanced Topics](/docs/advanced.md)
  * [Commands](/docs/advanced.md#commands)
  * [Configuration Management](/docs/advanced.md#configuration)
  * [Plugins](/docs/advanced.md#plugins)
* [Best Practices](/docs/best-practices.md)
  * [Building a Feature-Rich CLI App](/docs/best-practices.md#example)
* [Contributing](/contributing.md)

[travis-url]: https://travis-ci.org/yargs/yargs
[travis-image]: https://img.shields.io/travis/yargs/yargs/master.svg
[coveralls-url]: https://coveralls.io/github/yargs/yargs
[coveralls-image]: https://img.shields.io/coveralls/yargs/yargs.svg
[npm-url]: https://www.npmjs.com/package/yargs
[npm-image]: https://img.shields.io/npm/v/yargs.svg
[windows-url]: https://ci.appveyor.com/project/bcoe/yargs-ljwvf
[windows-image]: https://img.shields.io/appveyor/ci/bcoe/yargs-ljwvf/master.svg?label=Windows%20Tests
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[conventional-commits-image]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[conventional-commits-url]: https://conventionalcommits.org/
[gitter-image]: https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=2592000
[gitter-url]: https://gitter.im/yargs/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link
