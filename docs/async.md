# Async API

_Note: this document describes an API that has not yet been implemented, and
serves as a design document._

yargs exposes an async API surface, making it easier to compose command driven
applications that perform asynchronous operations.

As an example, perhaps you would like to create a command line application that
fetches the contents of a URL:

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

Detailed specifics of the `yargs.async` API follow:

## `yargs.async`

To create an asynchronous application simply use the `require('yargs').async`
statement, rather than `require('yargs')`.

The asynchronous API surface varies from the synchronous API surface in a
variety of ways...

## `.argv`

## `.parse`

## Command Builders

## Command Handlers

## Middleware
