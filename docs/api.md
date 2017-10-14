API
=======

You can run Yargs without any configuration, and it will do its
best to parse `process.argv`:

````javascript
require('yargs').argv
````

You can also pass in the `process.argv` yourself:

````javascript
require('yargs')([ '-x', '1', '-y', '2' ]).argv
````

or use `.parse()` to do the same thing:

````javascript
require('yargs').parse([ '-x', '1', '-y', '2' ])
````

Calling `.parse()` with no arguments is equivalent to calling `yargs.argv`:

```javascript
require('yargs').parse()
```

The rest of these methods below come in just before the terminating `.argv`.

<a name="alias"></a>.alias(key, alias)
------------------

Set key names as equivalent such that updates to a key will propagate to aliases
and vice-versa.

Optionally `.alias()` can take an object that maps keys to aliases.
Each key of this object should be the canonical version of the option, and each
value should be a string or an array of strings.

.argv
-----

Get the arguments as a plain old object.

Arguments without a corresponding flag show up in the `argv._` array.

The script name or node command is available at `argv.$0` similarly to how `$0`
works in bash or perl.

If `yargs` is executed in an environment that embeds node and there's no script name (e.g.
[Electron](http://electron.atom.io/) or [nw.js](http://nwjs.io/)), it will ignore the first parameter since it
expects it to be the script name. In order to override this behavior, use `.parse(process.argv.slice(1))`
instead of `.argv` and the first parameter won't be ignored.

<a name="array"></a>.array(key)
----------

Tell the parser to interpret `key` as an array. If `.array('foo')` is set,
`--foo foo bar` will be parsed as `['foo', 'bar']` rather than as `'foo'`.

<a name="boolean"></a>.boolean(key)
-------------

Interpret `key` as a boolean. If a non-flag option follows `key` in
`process.argv`, that string won't get set as the value of `key`.

`key` will default to `false`, unless a `default(key, undefined)` is
explicitly set.

If `key` is an array, interpret all the elements as booleans.

.check(fn, [global=true])
----------

Check that certain conditions are met in the provided arguments.

`fn` is called with two arguments, the parsed `argv` hash and an array of options and their aliases.

If `fn` throws or returns a non-truthy value, show the thrown error, usage information, and
exit.

`global` indicates whether `check()` should be enabled both
at the top-level and for each sub-command.

<a name="choices"></a>.choices(key, choices)
----------------------

Limit valid values for `key` to a predefined set of `choices`, given as an array
or as an individual value.

```js
var argv = require('yargs')
  .alias('i', 'ingredient')
  .describe('i', 'choose your sandwich ingredients')
  .choices('i', ['peanut-butter', 'jelly', 'banana', 'pickles'])
  .help('help')
  .argv
```

If this method is called multiple times, all enumerated values will be merged
together. Choices are generally strings or numbers, and value matching is
case-sensitive.

Optionally `.choices()` can take an object that maps multiple keys to their
choices.

Choices can also be specified as `choices` in the object given to `option()`.

```js
var argv = require('yargs')
  .option('size', {
    alias: 's',
    describe: 'choose a size',
    choices: ['xs', 's', 'm', 'l', 'xl']
  })
  .argv
```

<a name="coerce"></a>.coerce(key, fn)
----------------

Provide a synchronous function to coerce or transform the value(s) given on the
command line for `key`.

The coercion function should accept one argument, representing the parsed value
from the command line, and should return a new value or throw an error. The
returned value will be used as the value for `key` (or one of its aliases) in
`argv`.

If the function throws, the error will be treated as a validation
failure, delegating to either a custom [`.fail()`](#fail) handler or printing
the error message in the console.

Coercion will be applied to a value after
all other modifications, such as [`.normalize()`](#normalize).

_Examples:_

```js
var argv = require('yargs')
  .coerce('file', function (arg) {
    return require('fs').readFileSync(arg, 'utf8')
  })
  .argv
```

Optionally `.coerce()` can take an object that maps several keys to their
respective coercion function.

```js
var argv = require('yargs')
  .coerce({
    date: Date.parse,
    json: JSON.parse
  })
  .argv
```

You can also map the same function to several keys at one time. Just pass an
array of keys as the first argument to `.coerce()`:

```js
var path = require('path')
var argv = require('yargs')
  .coerce(['src', 'dest'], path.resolve)
  .argv
```

If you are using dot-notion or arrays, .e.g., `user.email` and `user.password`,
coercion will be applied to the final object that has been parsed:

```js
// --user.name Batman --user.password 123
// gives us: {name: 'batman', password: '[SECRET]'}
var argv = require('yargs')
  .option('user')
  .coerce('user', opt => {
    opt.name = opt.name.toLowerCase()
    opt.password = '[SECRET]'
    return opt
  })
  .argv
```

.command(cmd, desc, [builder], [handler])
-----------------------------------------
.command(cmd, desc, [module])
-----------------------------
.command(module)
----------------

Define the commands exposed by your application.

`cmd` should be a string representing the command or an array of strings
representing the command and its aliases. Read more about command aliases in the
subsection below.

Use `desc` to provide a description for each command your application accepts (the
values stored in `argv._`).  Set `desc` to `false` to create a hidden command.
Hidden commands don't show up in the help output and aren't available for
completion.

Optionally, you can provide a `builder` object to give hints about the
options that your command accepts:

```js
yargs
  .command('get', 'make a get HTTP request', {
    url: {
      alias: 'u',
      default: 'http://yargs.js.org/'
    }
  })
  .help()
  .argv
```

`builder` can also be a function. This function is executed
with a `yargs` instance, and can be used to provide _advanced_ command specific help:

```js
yargs
  .command('get', 'make a get HTTP request', function (yargs) {
    return yargs.option('url', {
      alias: 'u',
      default: 'http://yargs.js.org/'
    })
  })
  .help()
  .argv
```

You can also provide a handler function, which will be executed with the
parsed `argv` object:

```js
yargs
  .command(
    'get',
    'make a get HTTP request',
    function (yargs) {
      return yargs.option('u', {
        alias: 'url',
        describe: 'the URL to make an HTTP request to'
      })
    },
    function (argv) {
      console.log(argv.url)
    }
  )
  .help()
  .argv
```

Please see [Advanced Topics: Commands](https://github.com/yargs/yargs/blob/master/docs/advanced.md#commands) for a thorough
discussion of the advanced features exposed in the Command API.

.completion([cmd], [description], [fn])
---------------------------------------

Enable bash-completion shortcuts for commands and options.

`cmd`: When present in `argv._`, will result in the `.bashrc` completion script
being outputted. To enable bash completions, concat the generated script to your
`.bashrc` or `.bash_profile`.

`description`: Provide a description in your usage instructions for the command
that generates bash completion scripts.

`fn`: Rather than relying on yargs' default completion functionality, which
shiver me timbers is pretty awesome, you can provide your own completion
method.

If invoked without parameters, `.completion()` will make `completion` the command to output
the completion script.

```js
var argv = require('yargs')
  .completion('completion', function(current, argv) {
    // 'current' is the current command being completed.
    // 'argv' is the parsed arguments so far.
    // simply return an array of completions.
    return [
      'foo',
      'bar'
    ];
  })
  .argv;
```

You can also provide asynchronous completions.

```js
var argv = require('yargs')
  .completion('completion', function(current, argv, done) {
    setTimeout(function() {
      done([
        'apple',
        'banana'
      ]);
    }, 500);
  })
  .argv;
```

But wait, there's more! You can return an asynchronous promise.

```js
var argv = require('yargs')
  .completion('completion', function(current, argv, done) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(['apple', 'banana'])
      }, 10)
    })
  })
  .argv;
```

<a name="config"></a>.config([key], [description], [parseFn])
-------------------------------------------------------------
.config(object)
---------------

Tells the parser that if the option specified by `key` is passed in, it
should be interpreted as a path to a JSON config file. The file is loaded
and parsed, and its properties are set as arguments. Because the file is
loaded using Node's require(), the filename MUST end in `.json` to be
interpreted correctly.

If invoked without parameters, `.config()` will make `--config` the option to pass the JSON config file.

An optional `description` can be provided to customize the config (`key`) option
in the usage string.

An optional `parseFn` can be used to provide a custom parser. The parsing
function must be synchronous, and should return an object containing
key value pairs or an error.

```js
var argv = require('yargs')
  .config('settings', function (configPath) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  })
  .argv
```

You can also pass an explicit configuration `object`, it will be parsed
and its properties will be set as arguments.

```js
var argv = require('yargs')
  .config({foo: 1, bar: 2})
  .argv
console.log(argv)
```

```
$ node test.js
{ _: [],
  foo: 1,
  bar: 2,
  '$0': 'test.js' }
```

### `extends` Keyword

`config` and `pkgConf` can provide the `extends` keyword to
indicate that configuration should inherit from another location.

The value of extends can be either a relative or absolute path to a JSON
configuration file, e.g.,

```js
yargs.config({
  extends: './configs/a.json',
  logLevel: 'verbose'
})
```

Or, a module can be provided (this is useful for creating functionality like
  [babel-presets](https://babeljs.io/docs/plugins/)).

**my-library.js**

```js
yargs.pkgConf('nyc')
```

**consuming package.json**

```json
{
  "nyc": {
    "extends": "nyc-babel-config"
  }
}
```

Where `nyc-babel-config` is a package that exports configuration in its index.

<a name="conflicts"></a>.conflicts(x, y)
----------------------------------------------

Given the key `x` is set, the key `y` must not be set. `y` can either be a single
string or an array of argument names that `x` conflicts with.

Optionally `.conflicts()` can accept an object specifying multiple conflicting keys.

<a name="count"></a>.count(key)
------------

Interpret `key` as a boolean flag, but set its parsed value to the number of
flag occurrences rather than `true` or `false`. Default value is thus `0`.

<a name="default"></a>.default(key, value, [description])
---------------------------------------------------------
.defaults(key, value, [description])
------------------------------------

**Note:** The `.defaults()` alias is deprecated. It will be
removed in the next major version.

Set `argv[key]` to `value` if no option was specified in `process.argv`.

Optionally `.default()` can take an object that maps keys to default values.

But wait, there's more! The default value can be a `function` which returns
a value. The name of the function will be used in the usage string:

```js
var argv = require('yargs')
  .default('random', function randomValue() {
    return Math.random() * 256;
  }).argv;
```

Optionally, `description` can also be provided and will take precedence over
displaying the value in the usage instructions:

```js
.default('timeout', 60000, '(one-minute)')
```

<a name="demand"></a>.demand(count, [max], [msg]) [DEPRECATED]
--------------------

`demand()` has been deprecated, please instead see [`demandOption()`](#demandOption) and
[`demandCommand()`](#demandCommand).

<a name="demandOption"></a>.demandOption(key, [msg | boolean])
------------------------------
.demandOption(key, msg)
------------------------------

If `key` is a string, show the usage information and exit if `key` wasn't
specified in `process.argv`.

If `key` is an array, demand each element.

If a `msg` string is given, it will be printed when the argument is missing, instead of the standard error message.

```javascript
// demand an array of keys to be provided
require('yargs')
  .option('run', {
    alias: 'r',
    describe: 'run your program'
  })
  .option('path', {
    alias: 'p',
    describe: 'provide a path to file'
  })
  .option('spec', {
    alias: 's',
    describe: 'program specifications'
  })
  .demandOption(['run', 'path'], 'Please provide both run and path arguments to work with this tool')
  .help()
  .argv
```
which will provide the following output:
```bash
Options:
  --run, -r   run your program                [required]
  --path, -p  provide a path to file          [required]
  --spec, -s  program specifications
  --help      Show help                        [boolean]

  Missing required arguments: run, path
  Please provide both run and path arguments to work with this tool
```

If a `boolean` value is given, it controls whether the option is demanded;
this is useful when using `.options()` to specify command line parameters.

```javascript
// demand individual options within the option constructor
require('yargs')
  .options({
    'run': {
      alias: 'r',
      describe: 'run your program',
      demandOption: true
    },
    'path': {
      alias: 'p',
      describe: 'provide a path to file',
      demandOption: true
    },
    'spec': {
      alias: 's',
      describe: 'program specifications'
    }
  })
  .help()
  .argv
```
which will provide the following output:
```bash
Options:
  --run, -r   run your program                                       [required]
  --path, -p  provide a path to file                                 [required]
  --spec, -s  program specifications
  --help      Show help                                               [boolean]

Missing required arguments: run, path
```

<a name="demandCommand"></a>.demandCommand([min=1], [minMsg])
------------------------------
.demandCommand([min=1], [max], [minMsg], [maxMsg])
------------------------------

Demand in context of commands. You can demand a minimum and a maximum number a user can have within your program, as well as provide corresponding error messages if either of the demands is not met.
```javascript
require('yargs')
  .command({
    command: 'configure <key> [value]',
    aliases: ['config', 'cfg'],
    desc: 'Set a config variable',
    builder: (yargs) => yargs.default('value', 'true'),
    handler: (argv) => {
      console.log(`setting ${argv.key} to ${argv.value}`)
    }
  })
  // provide a minimum demand and a minimum demand message
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv
```

which will provide the following output:

```bash
Commands:
  configure <key> [value]  Set a config variable         [aliases: config, cfg]

Options:
  --help  Show help                                                   [boolean]

You need at least one command before moving on
```

_Note: in `minMsg` and `maxMsg`, every occurrence of `$0` will be replaced
with the observed value, and every instance of `$1` will be replaced with the
expected value._

<a name="describe"></a>.describe(key, desc)
--------------------

Describe a `key` for the generated usage information.

Optionally `.describe()` can take an object that maps keys to descriptions.

.detectLocale(boolean)
-----------

Should yargs attempt to detect the os' locale? Defaults to `true`.

.env([prefix])
--------------

Tell yargs to parse environment variables matching the given prefix and apply
them to argv as though they were command line arguments.

Use the "__" separator in the environment variable to indicate nested options.
(e.g. prefix_nested__foo => nested.foo)

If this method is called with no argument or with an empty string or with `true`,
then all env vars will be applied to argv.

Program arguments are defined in this order of precedence:

1. Command line args
2. Env vars
3. Config file/objects
4. Configured defaults

```js
var argv = require('yargs')
  .env('MY_PROGRAM')
  .option('f', {
    alias: 'fruit-thing',
    default: 'apple'
  })
  .argv
console.log(argv)
```

```
$ node fruity.js
{ _: [],
  f: 'apple',
  'fruit-thing': 'apple',
  fruitThing: 'apple',
  '$0': 'fruity.js' }
```

```
$ MY_PROGRAM_FRUIT_THING=banana node fruity.js
{ _: [],
  fruitThing: 'banana',
  f: 'banana',
  'fruit-thing': 'banana',
  '$0': 'fruity.js' }
```

```
$ MY_PROGRAM_FRUIT_THING=banana node fruity.js -f cat
{ _: [],
  f: 'cat',
  'fruit-thing': 'cat',
  fruitThing: 'cat',
  '$0': 'fruity.js' }
```

Env var parsing is disabled by default, but you can also explicitly disable it
by calling `.env(false)`, e.g. if you need to undo previous configuration.

.epilog(str)
------------
.epilogue(str)
--------------

A message to print at the end of the usage instructions, e.g.

```js
var argv = require('yargs')
  .epilogue('for more information, find our manual at http://example.com');
```

.example(cmd, desc)
-------------------

Give some example invocations of your program. Inside `cmd`, the string
`$0` will get interpolated to the current script name or node command for the
present script similar to how `$0` works in bash or perl.
Examples will be printed out as part of the help message.

<a name="exitprocess"></a>.exitProcess(enable)
----------------------------------

By default, yargs exits the process when the user passes a help flag, uses the
`.version` functionality, or when validation fails. Calling
`.exitProcess(false)` disables this behavior, enabling further actions after
yargs have been validated.

<a name="fail"></a>.fail(fn)
---------

Method to execute when a failure occurs, rather than printing the failure message.

`fn` is called with the failure message that would have been printed, the
`Error` instance originally thrown and yargs state when the failure
occured.

```js
var argv = require('yargs')
  .fail(function (msg, err, yargs) {
    if (err) throw err // preserve stack
    console.error('You broke it!')
    console.error(msg)
    console.error('You should be doing', yargs.help())
    process.exit(1)
  })
  .argv
```

.getCompletion(args, done);
---------------------------

Allows to programmatically get completion choices for any line.

`args`: An array of the words in the command line to complete.

`done`: The callback to be called with the resulting completions.

For example:

```js
require('yargs')
  .option('foobar')
  .option('foobaz')
  .completion()
  .getCompletion(['./test.js', '--foo'], function (completions) {
    console.log(completions)
  })
```

Outputs the same completion choices as `./test.js --foo`<kbd>TAB</kbd>: `--foobar` and `--foobaz`

<a name="global"></a>.global(globals, [global=true])
------------

Indicate that an option (or group of options) should not be reset when a command
is executed, as an example:

```js
var argv = require('yargs')
  .option('a', {
    alias: 'all',
    default: true,
    global: false
  })
  .option('n', {
    alias: 'none',
    default: true,
    global: false
  })
  .command('foo', 'foo command', function (yargs) {
    return yargs.option('b', {
      alias: 'bar'
    })
  })
  .help('help')
  .global('a')
  .argv
```

If the `foo` command is executed the `all` option will remain, but the `none`
option will have been eliminated.

Options default to being global.

<a name="group"></a>.group(key(s), groupName)
--------------------

Given a key, or an array of keys, places options under an alternative heading
when displaying usage instructions, e.g.,

```js
var yargs = require('yargs')(['--help'])
  .help()
  .group('batman', 'Heroes:')
  .describe('batman', "world's greatest detective")
  .wrap(null)
  .argv
```
***
    Heroes:
      --batman  world's greatest detective

    Options:
      --help  Show help  [boolean]

<a name="help"></a>.help()
-----------------------------------------
.help([option | boolean])
-----------------------------------------
.help([option, [description]])
-----------------------------------------

Configure an (e.g. `--help`) and implicit command that displays the usage
string and exits the process. By default yargs enables help on the `--help` option.

If present, the `description` parameter customizes the description of
the help option in the usage string.

If the boolean argument `false` is provided, it will disable `--help`.

Note that any multi-char aliases (e.g. `help`) used for the help option will
also be used for the implicit command. If there are no multi-char aliases (e.g.
`h`), then all single-char aliases will be used for the command.

If invoked without parameters, `.help()` will use `--help` as the option and
`help` as the implicit command to trigger help output.

Example:

```js
var yargs = require("yargs")(['--info'])
  .usage("$0 -operand1 number -operand2 number -operation [add|subtract]")
  .help('info')
  .argv
```

<a name="implies"></a>.implies(x, y)
--------------

Given the key `x` is set, it is required that the key `y` is set. `y` can either
be the name of an argument to imply, a number indicating a number indicating the
position of an argument or an array of multiple implications to associate with `x`.

Optionally `.implies()` can accept an object specifying multiple implications.

.locale()
---------

Return the locale that yargs is currently using.

By default, yargs will auto-detect the operating system's locale so that
yargs-generated help content will display in the user's language.

To override this behavior with a static locale, pass the desired locale as a
string to this method (see below).

.locale(locale)
---------------

Override the auto-detected locale from the user's operating system with a static
locale. Note that the OS locale can be modified by setting/exporting the `LC_ALL`
environment variable.

```js
var argv = require('yargs')
  .usage('./$0 - follow ye instructions true')
  .option('option', {
    alias: 'o',
    describe: "'tis a mighty fine option",
    demandOption: true
  })
  .command('run', "Arrr, ya best be knowin' what yer doin'")
  .example('$0 run foo', "shiver me timbers, here's an example for ye")
  .help('help')
  .wrap(70)
  .locale('pirate')
  .argv
```

***

```shell
./test.js - follow ye instructions true

Choose yer command:
  run  Arrr, ya best be knowin' what yer doin'

Options for me hearties!
  --option, -o  'tis a mighty fine option               [requi-yar-ed]
  --help        Parlay this here code of conduct             [boolean]

Ex. marks the spot:
  test.js run foo  shiver me timbers, here's an example for ye

Ye be havin' to set the followin' argument land lubber: option
```

Locales currently supported:

* **de:** German.
* **en:** American English.
* **es:** Spanish.
* **fr:** French.
* **hi:** Hindi.
* **hu:** Hungarian.
* **id:** Indonesian.
* **it:** Italian.
* **ja:** Japanese.
* **ko:** Korean.
* **nb:** Norwegian Bokmål.
* **pirate:** American Pirate.
* **pl:** Polish.
* **pt:** Portuguese.
* **pt_BR:** Brazilian Portuguese.
* **ru:** Russian.
* **th:** Thai.
* **tr:** Turkish.
* **zh_CN:** Chinese.

To submit a new translation for yargs:

1. use `./locales/en.json` as a starting point.
2. submit a pull request with the new locale file.

*The [Microsoft Terminology Search](http://www.microsoft.com/Language/en-US/Search.aspx) can be useful for finding the correct terminology in your locale.*

<a name="nargs"></a>.nargs(key, count)
-----------

The number of arguments that should be consumed after a key. This can be a
useful hint to prevent parsing ambiguity. For example:

```js
var argv = require('yargs')
  .nargs('token', 1)
  .parse(['--token', '-my-token']);
```

parses as:

`{ _: [], token: '-my-token', '$0': 'node test' }`

Optionally `.nargs()` can take an object of `key`/`narg` pairs.

<a name="normalize"></a>.normalize(key)
---------------

The key provided represents a path and should have `path.normalize()` applied.

<a name="number"></a>.number(key)
------------

Tell the parser to always interpret `key` as a number.

If `key` is an array, all elements will be parsed as numbers.

If the option is given on the command line without a value, `argv` will be
populated with `undefined`.

If the value given on the command line cannot be parsed as a number, `argv` will
be populated with `NaN`.

Note that decimals, hexadecimals, and scientific notation are all accepted.

```js
var argv = require('yargs')
  .number('n')
  .number(['width', 'height'])
  .argv
```

.option(key, [opt])
-----------------
.options(key, [opt])
------------------

This method can be used to make yargs aware of options that _could_
exist. You can also pass an `opt` object which can hold further
customization, like `.alias()`, `.demandOption()` etc. for that option.

For example:

````javascript
var argv = require('yargs')
    .option('f', {
        alias: 'file',
        demandOption: true,
        default: '/etc/passwd',
        describe: 'x marks the spot',
        type: 'string'
    })
    .argv
;
````

is the same as

````javascript
var argv = require('yargs')
    .alias('f', 'file')
    .demandOption('f')
    .default('f', '/etc/passwd')
    .describe('f', 'x marks the spot')
    .string('f')
    .argv
;
````

Optionally `.options()` can take an object that maps keys to `opt` parameters.

````javascript
var argv = require('yargs')
    .options({
      'f': {
        alias: 'file',
        demandOption: true,
        default: '/etc/passwd',
        describe: 'x marks the spot',
        type: 'string'
      }
    })
    .argv
;
````

Valid `opt` keys include:

- `alias`: string or array of strings, alias(es) for the canonical option key, see [`alias()`](#alias)
- `array`: boolean, interpret option as an array, see [`array()`](#array)
- `boolean`: boolean, interpret option as a boolean flag, see [`boolean()`](#boolean)
- `choices`: value or array of values, limit valid option arguments to a predefined set, see [`choices()`](#choices)
- `coerce`: function, coerce or transform parsed command line values into another value, see [`coerce()`](#coerce)
- `config`: boolean, interpret option as a path to a JSON config file, see [`config()`](#config)
- `configParser`: function, provide a custom config parsing function, see [`config()`](#config)
- `conflicts`: string or object, require certain keys not to be set, see [`conflicts()`](#conflicts)
- `count`: boolean, interpret option as a count of boolean flags, see [`count()`](#count)
- `default`: value, set a default value for the option, see [`default()`](#default)
- `defaultDescription`: string, use this description for the default value in help content, see [`default()`](#default)
- `demandOption`: boolean or string, demand the option be given, with optional error message, see [`demandOption()`](#demandOption)
- `desc`/`describe`/`description`: string, the option description for help content, see [`describe()`](#describe)
- `global`: boolean, indicate that this key should not be [reset](#reset) when a command is invoked, see [`global()`](#global)
- `group`: string, when displaying usage instructions place the option under an alternative group heading, see [`group()`](#group)
- `implies`: string or object, require certain keys to be set, see [`implies()`](#implies)
- `nargs`: number, specify how many arguments should be consumed for the option, see [`nargs()`](#nargs)
- `normalize`: boolean, apply `path.normalize()` to the option, see [`normalize()`](#normalize)
- `number`: boolean, interpret option as a number, [`number()`](#number)
- `requiresArg`: boolean, require the option be specified with a value, see [`requiresArg()`](#requiresArg)
- `skipValidation`: boolean, skips validation if the option is present, see [`skipValidation()`](#skipValidation)
- `string`: boolean, interpret option as a string, see [`string()`](#string)
- `type`: one of the following strings
    - `'array'`: synonymous for `array: true`, see [`array()`](#array)
    - `'boolean'`: synonymous for `boolean: true`, see [`boolean()`](#boolean)
    - `'count'`: synonymous for `count: true`, see [`count()`](#count)
    - `'number'`: synonymous for `number: true`, see [`number()`](#number)
    - `'string'`: synonymous for `string: true`, see [`string()`](#string)

.parse([args], [context], [parseCallback])
------------

Parse `args` instead of `process.argv`. Returns the `argv` object.
`args` may either be a pre-processed argv array, or a raw argument string.

A `context` object can optionally be given as the second argument to `parse()`, providing a
useful mechanism for passing state information to commands:

```js
const parser = yargs
  .command('lunch-train <restaurant>', 'start lunch train', function () {}, function (argv) {
    console.log(argv.restaurant, argv.time)
  })
  .parse("lunch-train rudy's", {time: '12:15'})
```

A `parseCallback` can also be provided to `.parse()`. If a callback is given, it will be invoked with three arguments:

1. `err`: populated if any validation errors raised while parsing.
2. `argv`: the parsed argv object.
3. `output`: any text that would have been output to the terminal, had a
  callback not been provided.

```js
// providing the `fn` argument to `parse()` runs yargs in headless mode, this
// makes it easy to use yargs in contexts other than the CLI, e.g., writing
// a chat-bot.
const parser = yargs
  .command('lunch-train <restaurant> <time>', 'start lunch train', function () {}, function (argv) {
    api.scheduleLunch(argv.restaurant, moment(argv.time))
  })
  .help()

parser.parse(bot.userText, function (err, argv, output) {
  if (output) bot.respond(output)
})
```

***Note:*** Providing a callback to `parse()` disables the [`exitProcess` setting](#exitprocess) until after the callback is invoked.


<a name="pkg-conf"></a>
.pkgConf(key, [cwd])
------------

Similar to [`config()`](#config), indicates that yargs should interpret the object from the specified key in package.json
as a configuration object.

`cwd` can optionally be provided, the package.json will be read
from this location.

.positional(key, opt)
------------

`.positional()` allows you to configure a command's positional arguments
with an API similar to [`.option()`](#optionkey-opt). `.positional()`
should be called in a command's builder function, and is not
available on the top-level yargs instance.

> _you can describe top-level positional arguments using
  [default commands](/docs/advanced.md#default-commands)._

```js
const argv = require('yargs')('run --help')
  .command('run <port> <guid>', 'run the server', (yargs) => {
    yargs.positional('guid', {
      describe: 'a unique identifier for the server',
      type: 'string'
    })
  }).argv
console.log(argv)
```

Valid `opt` keys include:

  - `alias`: string or array of strings, see [`alias()`](#alias)
  - `choices`: value or array of values, limit valid option arguments to a predefined set, see [`choices()`](#choices)
  - `coerce`: function, coerce or transform parsed command line values into another value, see [`coerce()`](#coerce)
  - `conflicts`: string or object, require certain keys not to be set, see [`conflicts()`](#conflicts)
  - `default`: value, set a default value for the option, see [`default()`](#default)
  - `desc`/`describe`/`description`: string, the option description for help content, see [`describe()`](#describe)
  - `implies`: string or object, require certain keys to be set, see [`implies()`](#implies)
  - `normalize`: boolean, apply `path.normalize()` to the option, see [`normalize()`](#normalize)
  - `type`: one of the following strings
      - `'boolean'`: synonymous for `boolean: true`, see [`boolean()`](#boolean)
      - `'number'`: synonymous for `number: true`, see [`number()`](#number)
      - `'string'`: synonymous for `string: true`, see [`string()`](#string)

.recommendCommands()
---------------------------

Should yargs provide suggestions regarding similar commands if no matching
command is found?

.require(key, [msg | boolean])
------------------------------
.required(key, [msg | boolean])
------------------------------

An alias for [`demand()`](#demand). See docs there.

<a name="requiresArg"></a>.requiresArg(key)
-----------------

Specifies either a single option key (string), or an array of options that
must be followed by option values. If any option value is missing, show the
usage information and exit.

The default behavior is to set the value of any key not followed by an
option value to `true`.

<a name="reset"></a>.reset() [DEPRECATED]
--------

Reset the argument object built up so far. This is useful for
creating nested command line interfaces. Use [global](#global)
to specify keys that should not be reset.

```js
var yargs = require('yargs')
  .usage('$0 command')
  .command('hello', 'hello command')
  .command('world', 'world command')
  .demandCommand(1, 'must provide a valid command'),
  argv = yargs.argv,
  command = argv._[0];

if (command === 'hello') {
  yargs.reset()
    .usage('$0 hello')
    .help('h')
    .example('$0 hello', 'print the hello message!')
    .argv

  console.log('hello!');
} else if (command === 'world'){
  yargs.reset()
    .usage('$0 world')
    .help('h')
    .example('$0 world', 'print the world message!')
    .argv

  console.log('world!');
} else {
  yargs.showHelp();
}
```

.showCompletionScript()
----------------------

Generate a bash completion script. Users of your application can install this
script in their `.bashrc`, and yargs will provide completion shortcuts for
commands and options.

.showHelp(consoleLevel='error')
---------------------------

Print the usage data using the [`console`](https://nodejs.org/api/console.html) function `consoleLevel` for printing.

Example:

```js
var yargs = require("yargs")
  .usage("$0 -operand1 number -operand2 number -operation [add|subtract]");
yargs.showHelp(); //prints to stderr using console.error()
```

Or, to print the usage data to `stdout` instead, you can specify the use of `console.log`:

```js
yargs.showHelp("log"); //prints to stdout using console.log()
```

Later on, `argv` can be retrieved with `yargs.argv`.

.showHelpOnFail(enable, [message])
----------------------------------

By default, yargs outputs a usage string if any error is detected. Use the
`.showHelpOnFail()` method to customize this behavior. If `enable` is `false`,
the usage string is not output. If the `message` parameter is present, this
message is output after the error message.

line_count.js:

````javascript
#!/usr/bin/env node
var argv = require('yargs')
    .usage('Count the lines in a file.\nUsage: $0 -f <file>')
    .demandOption('f')
    .alias('f', 'file')
    .describe('f', 'Load a file')
    .string('f')
    .showHelpOnFail(false, 'Specify --help for available options')
    .help('help')
    .argv;

// etc.
````

***

```
$ node line_count.js
Missing argument value: f

Specify --help for available options
```

<a name="skipValidation"></a>.skipValidation(key)
-----------------

Specifies either a single option key (string), or an array of options.
If any of the options is present, yargs validation is skipped.

.strict([enabled=true])
---------

Any command-line argument given that is not demanded, or does not have a
corresponding description, will be reported as an error.

Unrecognized commands will also be reported as errors.

<a name="string"></a>.string(key)
------------

Tell the parser logic not to interpret `key` as a number or boolean.
This can be useful if you need to preserve leading zeros in an input.

If `key` is an array, interpret all the elements as strings.

`.string('_')` will result in non-hyphenated arguments being interpreted as strings,
regardless of whether they resemble numbers.

.updateLocale(obj)
------------------
.updateStrings(obj)
------------------

Override the default strings used by yargs with the key/value
pairs provided in `obj`:

```js
var argv = require('yargs')
  .command('run', 'the run command')
  .help('help')
  .updateStrings({
    'Commands:': 'My Commands -->\n'
  })
  .wrap(null)
  .argv
```

***

```shell
My Commands -->

  run  the run command

Options:
  --help  Show help  [boolean]
```

If you explicitly specify a `locale()`, you should do so *before* calling
`updateStrings()`.

.usage(<message|command>, [desc], [builder], [handler])
---------------------

Set a usage message to show which commands to use. Inside `message`, the string
`$0` will get interpolated to the current script name or node command for the
present script similar to how `$0` works in bash or perl.

If the optional `desc`/`builder`/`handler` are provided, `.usage()`
acts an an alias for [`.command()`](#commandmodule). This allows you to use
`.usage()` to configure the [default command](/docs/advanced.md#default-commands) that will be run as an entry-point to your application and allows you
to provide configuration for the positional arguments accepted by your program:

```js
const argv = require('yargs')
  .usage('$0 <port>', 'start the application server', (yargs) => {
    yargs.positional('port', {
      describe: 'the port that your application should bind to',
      type: 'number'
    })
  }).argv
```

<a name="version"></a>
.version()
----------------------------------------
.version([version|boolean])
----------------------------------------
.version([option], [description], [version])
----------------------------------------

Add an option (e.g. `--version`) that displays the version number (given by the
`version` parameter) and exits the process. By default yargs enables version for the `--version` option.

If no arguments are passed to `version` (`.version()`), yargs will parse the `package.json`
of your module and use its `version` value.

If the boolean argument `false` is provided, it will disable `--version`.

<a name="wrap"></a>.wrap(columns)
--------------

Format usage output to wrap at `columns` many columns.

By default wrap will be set to `Math.min(80, windowWidth)`. Use `.wrap(null)` to
specify no column limit (no right-align). Use `.wrap(yargs.terminalWidth())` to
maximize the width of yargs' usage instructions.
