# Async API

_Note: this document describes an API that has not yet been fully implemented._

yargs exposes an async API surface, making it easier to compose command driven
applications that perform asynchronous operations.

As an example, perhaps you would like to create a command line application that
fetches a URL, like curl:

```js
const fetch = require('node-fetch')
const yargs = require('yargs').async
const argv = yargs.command('fetch <url>', 'fetch the contents of a URL', () => {}, async (argv) => {
  const res = await fetch(argv.url)
  console.info(`status = ${res.status} ${res.statusText}`)
  console.info(await res.text())
}).argv
await argv // resolves when the command has finished.
```

## `require('yargs').async`

To create an asynchronous application simply use the `require('yargs').async`
import, rather than `require('yargs')`. `yargs.async` varies in the following
ways:

## `.argv`

## `.parse`

## Command Builders

## Command Handlers

## Middleware
