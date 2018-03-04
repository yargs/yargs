# Parsing Tricks

---
### Yargs document pages
* [Advanced topics](https://github.com/restarian/yargs/blob/brace_document/docs/advanced_topics.md)
* [Change log](https://github.com/restarian/yargs/blob/brace_document/docs/change_log.md)
* [Contributing to yargs](https://github.com/restarian/yargs/blob/brace_document/docs/contributing_to_yargs.md)
* [Examples](https://github.com/restarian/yargs/blob/brace_document/docs/examples.md)
* [The api](https://github.com/restarian/yargs/blob/brace_document/docs/the_api.md)
* **Tricks**
* [Yargs synopsis](https://github.com/restarian/yargs/blob/brace_document/docs/yargs_synopsis.md)

---

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
