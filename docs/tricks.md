# Parsing Tricks

<a name="stop"></a>
Stop Parsing
------------

Use `--` to stop parsing flags and stuff the remainder into `argv._`.

    $ node examples/reflect.js -a 1 -b 2 -- -c 3 -d 4
    { _: [ '-c', '3', '-d', '4' ],
      a: 1,
      b: 2,
      '$0': 'examples/reflect.js' }

<a name="negate"></a>
Negating Boolean Arguments
-------------

If you want to explicitly set a field to false instead of just leaving it
undefined or to override a default you can do `--no-key`.

    $ node examples/reflect.js -a --no-b
    { _: [], a: true, b: false, '$0': 'examples/reflect.js' }

<a name="numbers"></a>
Numbers
-------

Every argument that looks like a number (`!isNaN(Number(arg))`) is converted to
one. This way you can just `net.createConnection(argv.port)` and you can add
numbers out of `argv` with `+` without having that mean concatenation,
which is super frustrating.

You can change this behavior by calling [`parserConfiguration()`](/docs/api.md#parserConfiguration)
or by explicitly specifying [`string`](/docs/api.md/#string) for your flags.

<a name="arrays"></a>
Arrays
----------

If you specify a flag multiple times it will get turned into an array containing
all the values in order.

    $ node examples/reflect.js -x 5 -x 8 -x 0
    { _: [], x: [ 5, 8, 0 ], '$0': 'examples/reflect.js' }

You can also configure an option as the [type `array`](/docs/api.md#array), to
support arrays of the form `-x 5 6 7 8`.

<a name="objects"></a>
Objects
------------

When you use dots (`.`s) in argument names, an implicit object path is assumed.
This lets you organize arguments into nested objects.

    $ node examples/reflect.js --foo.bar.baz=33 --foo.quux=5
    { _: [],
      foo: { bar: { baz: 33 }, quux: 5 },
      '$0': 'examples/reflect.js' }

This also works when loading from ENV variables (configurable with `.env('MYPREFIX')` using double underscores:

    $ MYPREFIX_FOO__BAR__BAZ=33 MYPREFIX_FOO__QUUX=5 node examples/reflect.js
    { _: [],
      foo: { bar: { baz: 33 }, quux: 5 },
      '$0': 'examples/reflect.js' }

<a name="quotes"></a>
Quotes
------------

When you use string arguments that include dashes (`-`), those will be seen as a separate option by the shell instead of part of the string. The problem is that shells like bash tend to strip quotes. The solution for this is to wrap the string in two sets of quotes.

Use double quotes inside single quotes.

```
$ node examples/reflect.js --foo '"--hello -x=yes -v"'
{ _: [], foo: '--hello -x=yes -v',
  '$0': 'examples/reflect.js' }
```

Use escaped double quotes inside double quotes.

```
$ node examples/reflect.js --foo "\"--hello -x=yes -v\""
{ _: [], foo: '--hello -x=yes -v',
  '$0': 'examples/reflect.js' }
```

