#!/usr/bin/env node
var argv = require('../../')
  .help('help')
  .option("version")
  .option("yabba-dabba-doo", {
    type: "boolean"
  })
  .parserConfiguration({
    'dot-notation': false,
    'boolean-negation': false
  })
  .argv
if (argv.version) {
  console.log("custom version text");
} else {
  console.log(argv)
}
