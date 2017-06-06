Installation
============

With [npm](https://github.com/npm/npm), just do:

    npm install yargs

or clone this project on github:

    git clone http://github.com/yargs/yargs.git

To run the tests with npm, just do:

    npm test

<a name="configuration"></a>
Configuration
=============

Using the `yargs` stanza in your `package.json` you can turn on and off
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
