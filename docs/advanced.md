# Advanced Topics

<a name="commands"></a>
## Commands

Yargs provides a powerful set of tools for composing modular command-driven-applications.
In this section we cover some of the advanced features available in this API:

### Default Commands

To specify a default command use the string `*` or `$0`. A default command
will be run if the positional arguments provided match no known
commands. tldr; default commands allow you to define the entry point to your
application using a similar API to subcommands.

```js
const argv = require('yargs')
  .command('$0', 'the default command', () => {}, (argv) => {
    console.log('this command will be run by default')
  })
```

The command defined above will be executed if the program
is run with `./my-cli.js --x=22`.

Default commands can also be used as a command alias, like so:

```js
const argv = require('yargs')
  .command(['serve', '$0'], 'the serve command', () => {}, (argv) => {
    console.log('this command will be run by default')
  })
```

The command defined above will be executed if the program
is run with `./my-cli.js --x=22`, or with `./my-cli.js serve --x=22`.

### Positional Arguments

Commands can accept _optional_ and _required_ positional arguments. Required
positional arguments take the form `<foo>`, and optional arguments
take the form `[bar]`. The parsed positional arguments will be populated in
`argv`:

```js
yargs.command('get <source> [proxy]', 'make a get HTTP request')
  .help()
  .argv
```

#### Positional Argument Aliases

Aliases can be provided for positional arguments using the `|` character.
As an example, suppose our application allows either a username _or_
an email as the first argument:

```js
yargs.command('get <username|email> [password]', 'fetch a user by username or email.')
  .help()
  .argv
```

In this way, both `argv.username` and `argv.email` would be populated with the
same value when the command is executed.

#### Variadic Positional Arguments

The last positional argument can optionally accept an array of
values, by using the `..` operator:

```js
yargs.command('download <url> [files..]', 'download several files')
  .help()
  .argv
```

#### Describing Positional Arguments

You can use the method [`.positional()`](/docs/api.md#positionalkey-opt) in a command's builder function to describe and configure a positional argument:

```js
yargs.command('get <source> [proxy]', 'make a get HTTP request', (yargs) => {
  yargs.positional('source', {
    describe: 'URL to fetch content from',
    type: 'string',
    default: 'http://www.google.com'
  }).positional('proxy', {
    describe: 'optional proxy URL'
  })
})
.help()
.argv
```

### Command Execution

When a command is given on the command line, yargs will execute the following:

1. push the command into the current context
2. reset non-global configuration
3. apply command configuration via the `builder`, if given
4. parse and validate args from the command line, including positional args
5. if validation succeeds, run the `handler` function, if given
6. pop the command from the current context

### Command Aliases

You can define aliases for a command by putting the command and all of its
aliases into an array.

Alternatively, a command module may specify an `aliases` property, which may be
a string or an array of strings. All aliases defined via the `command` property
and the `aliases` property will be concatenated together.

The first element in the array is considered the canonical command, which may
define positional arguments, and the remaining elements in the array are
considered aliases. Aliases inherit positional args from the canonical command,
and thus any positional args defined in the aliases themselves are ignored.

If either the canonical command or any of its aliases are given on the command
line, the command will be executed.

```js
#!/usr/bin/env node
require('yargs')
  .command(['start [app]', 'run', 'up'], 'Start up an app', {}, (argv) => {
    console.log('starting up the', argv.app || 'default', 'app')
  })
  .command({
    command: 'configure <key> [value]',
    aliases: ['config', 'cfg'],
    desc: 'Set a config variable',
    builder: (yargs) => yargs.default('value', 'true'),
    handler: (argv) => {
      console.log(`setting ${argv.key} to ${argv.value}`)
    }
  })
  .demandCommand()
  .help()
  .wrap(72)
  .argv
```

```
$ ./svc.js help
Commands:
  start [app]              Start up an app            [aliases: run, up]
  configure <key> [value]  Set a config variable  [aliases: config, cfg]

Options:
  --help  Show help                                            [boolean]

$ ./svc.js cfg concurrency 4
setting concurrency to 4

$ ./svc.js run web
starting up the web app
```

### Providing a Command Module

For complicated commands you can pull the logic into a module. A module
simply needs to export:

* `exports.command`: string (or array of strings) that executes this command when given on the command line, first string may contain positional args
* `exports.aliases`: array of strings (or a single string) representing aliases of `exports.command`, positional args defined in an alias are ignored
* `exports.describe`: string used as the description for the command in help text, use `false` for a hidden command
* `exports.builder`: object declaring the options the command accepts, or a function accepting and returning a yargs instance
* `exports.handler`: a function which will be passed the parsed argv.

```js
// my-module.js
exports.command = 'get <source> [proxy]'

exports.describe = 'make a get HTTP request'

exports.builder = {
  banana: {
    default: 'cool'
  },
  batman: {
    default: 'sad'
  }
}

exports.handler = function (argv) {
  // do something with argv.
}
```

You then register the module like so:

```js
yargs.command(require('my-module'))
  .help()
  .argv
```

Or if the module does not export `command` and `describe` (or if you just want to override them):

```js
yargs.command('get <source> [proxy]', 'make a get HTTP request', require('my-module'))
  .help()
  .argv
```

.commandDir(directory, [opts])
------------------------------

Apply command modules from a directory relative to the module calling this method.

This allows you to organize multiple commands into their own modules under a
single directory and apply all of them at once instead of calling
`.command(require('./dir/module'))` multiple times.

By default, it ignores subdirectories. This is so you can use a directory
structure to represent your command hierarchy, where each command applies its
subcommands using this method in its builder function. See the example below.

Note that yargs assumes all modules in the given directory are command modules
and will error if non-command modules are encountered. In this scenario, you
can either move your module to a different directory or use the `exclude` or
`visit` option to manually filter it out. More on that below.

`directory` is a relative directory path as a string (required).

`opts` is an options object (optional). The following options are valid:

- `recurse`: boolean, default `false`

    Look for command modules in all subdirectories and apply them as a flattened
    (non-hierarchical) list.

- `extensions`: array of strings, default `['js']`

    The types of files to look for when requiring command modules.

- `visit`: function

    A synchronous function called for each command module encountered. Accepts
    `commandObject`, `pathToFile`, and `filename` as arguments. Returns
    `commandObject` to include the command; any falsy value to exclude/skip it.

- `include`: RegExp or function

    Whitelist certain modules. See [`require-directory` whitelisting](https://www.npmjs.com/package/require-directory#whitelisting) for details.

- `exclude`: RegExp or function

    Blacklist certain modules. See [`require-directory` blacklisting](https://www.npmjs.com/package/require-directory#blacklisting) for details.

### Example command hierarchy using `.commandDir()`

Desired CLI:

```sh
$ myapp --help
$ myapp init
$ myapp remote --help
$ myapp remote add base http://yargs.js.org
$ myapp remote prune base
$ myapp remote prune base fork whatever
```

Directory structure:

```
myapp/
├─ cli.js
└─ cmds/
   ├─ init.js
   ├─ remote.js
   └─ remote_cmds/
      ├─ add.js
      └─ prune.js
```

cli.js:

```js
#!/usr/bin/env node
require('yargs')
  .commandDir('cmds')
  .demandCommand()
  .help()
  .argv
```

cmds/init.js:

```js
exports.command = 'init [dir]'
exports.desc = 'Create an empty repo'
exports.builder = {
  dir: {
    default: '.'
  }
}
exports.handler = function (argv) {
  console.log('init called for dir', argv.dir)
}
```

cmds/remote.js:

```js
exports.command = 'remote <command>'
exports.desc = 'Manage set of tracked repos'
exports.builder = function (yargs) {
  return yargs.commandDir('remote_cmds')
}
exports.handler = function (argv) {}
```

cmds/remote_cmds/add.js:

```js
exports.command = 'add <name> <url>'
exports.desc = 'Add remote named <name> for repo at url <url>'
exports.builder = {}
exports.handler = function (argv) {
  console.log('adding remote %s at url %s', argv.name, argv.url)
}
```

cmds/remote_cmds/prune.js:

```js
exports.command = 'prune <name> [names..]'
exports.desc = 'Delete tracked branches gone stale for remotes'
exports.builder = {}
exports.handler = function (argv) {
  console.log('pruning remotes %s', [].concat(argv.name).concat(argv.names).join(', '))
}
```

<a name="configuration"></a>
## Building Configurable CLI Apps

One of the goals of yargs has been to examine practices common in the
JavaScript CLI community, and to make to make it easy to apply these
conventions to your own application.

One useful set of conventions that has emerged is around how applications
allow users to extend and customize their functionality.

### .rc files

It's common for libraries, e.g., [Babel](https://babeljs.io/docs/usage/babelrc/), [ESLint](https://github.com/eslint/eslint#configuration), to allow you to
provide configuration by populating a `.rc` file.

Yargs' [`config()`](/docs/api.md#config), combined with the module [find-up](https://www.npmjs.com/package/find-up), makes it  easy to
implement `.rc` functionality:

```js
const findUp = require('find-up')
const fs = require('fs')
const configPath = findUp.sync(['.myapprc', '.myapprc.json'])
const config = configPath ? JSON.parse(fs.readFileSync(configPath)) : {}
const argv = require('yargs')
  .config(config)
  .argv
```

### Providing Configuration in Your package.json

Another common practice is to allow users to provide configuration via
a reserved field in the package.json. You can configure [nyc](https://github.com/istanbuljs/nyc#configuring-nyc) or [babel](https://babeljs.io/docs/usage/babelrc/#lookup-behavior), for instance,
using the `nyc` and `babel` key respectively:

```json
{
  "nyc": {
    "watermarks": {
      "lines": [80, 95],
      "functions": [80, 95],
      "branches": [80, 95],
      "statements": [80, 95]
    }
  }
}
```

Yargs gives you this functionality using the [`pkgConf()`](/docs/api.md#config)
method:

```js
const argv = require('yargs')
  .pkgConf('nyc')
  .argv
```

### Creating a Plugin Architecture

Both [`pkgConf()`](/docs/api.md#config) and [`config()`](/docs/api.md#config) support
the `extends` keyword. `extends` allows you to inherit configuration from [other npm modules](https://www.npmjs.com/package/@istanbuljs/nyc-config-babel), making it
possible to build plugin architectures similar to [Babel's presets](https://babeljs.io/docs/plugins/#presets):

```json
{
  "nyc": {
    "extends": "@istanbuljs/nyc-config-babel"
  }
}
```

<a name="customizing"></a>
## Customizing Yargs' Parser

Not everyone always agrees on how `process.argv` should be interpreted;
using the `yargs` stanza in your `package.json` you can turn on and off
some of yargs' parsing features:

```json
{
  "yargs": {
    "short-option-groups": true,
    "camel-case-expansion": true,
    "dot-notation": true,
    "parse-numbers": true,
    "boolean-negation": true
  }
}
```

See the [yargs-parser](https://github.com/yargs/yargs-parser#configuration) module
for detailed documentation of this feature.
