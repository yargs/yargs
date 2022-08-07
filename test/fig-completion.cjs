/* global describe, it, beforeEach */
'use-strict';
const yargs = require('../index.cjs');
const {checkOutput} = require('./helpers/utils.cjs');

require('chai').should();

describe('FigCompletion', () => {
  beforeEach(() => {
    yargs.getInternalMethods().reset();
  });

  it('should accept both options from handler and from main command', () => {
    const o = checkOutput(() =>
      yargs('generate-fig-spec')
        .command(
          '$0 [bar]',
          'Do something',
          yargs => {
            return yargs.option('other-opt', {
              default: 1,
              nargs: 3,
              type: 'number',
            });
          },
          () => {}
        )
        .option('opt', {default: 'foo', nargs: 3, type: 'string'})
        .figCompletion()
        .parse()
    );
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": [',
        '    "usage"',
        '  ],',
        '  "description": "Do something",',
        '  "subcommands": [],',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    },',
        '    {',
        '      "name": [',
        '        "--opt"',
        '      ],',
        '      "args": [',
        '        {',
        '          "name": "string"',
        '        },',
        '        {',
        '          "name": "string"',
        '        },',
        '        {',
        '          "name": "string"',
        '        }',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "--other-opt"',
        '      ],',
        '      "args": [',
        '        {',
        '          "name": "number"',
        '        },',
        '        {',
        '          "name": "number"',
        '        },',
        '        {',
        '          "name": "number"',
        '        }',
        '      ]',
        '    }',
        '  ],',
        '  "args": [',
        '    {',
        '      "name": "bar",',
        '      "isOptional": true',
        '    }',
        '  ]',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  it('should accept both subcommands from handler and from main command', () => {
    const o = checkOutput(() =>
      yargs('generate-fig-spec')
        .command(
          '$0 <cmd>',
          'Main description',
          y => {
            return y.command('apple').command('pear');
          },
          () => {}
        )
        .command('banana')
        .figCompletion()
        .parse()
    );
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": [',
        '    "usage"',
        '  ],',
        '  "description": "Main description",',
        '  "subcommands": [',
        '    {',
        '      "name": [',
        '        "apple"',
        '      ],',
        '      "options": []',
        '    },',
        '    {',
        '      "name": [',
        '        "pear"',
        '      ],',
        '      "options": []',
        '    },',
        '    {',
        '      "name": [',
        '        "banana"',
        '      ],',
        '      "options": []',
        '    }',
        '  ],',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    }',
        '  ],',
        '  "args": [',
        '    {',
        '      "name": "cmd"',
        '    }',
        '  ]',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  describe('respect "boolean-negation" config', () => {
    it('When true', () => {
      const config = {'boolean-negation': true};
      const o = checkOutput(() =>
        yargs('generate-fig-spec')
          .parserConfiguration(config)
          .command('$0', 'Default', {
            bopt: {
              type: 'boolean',
            },
          })
          .figCompletion()
          .parse()
      );
      o.exitCode.should.equal(0);
      o.errors.length.should.equal(0);
      o.logs[0]
        .split('\n')
        .should.deep.equal([
          '// Autogenerated by the Yargs integration',
          '',
          'const completionSpec: Fig.Spec = {',
          '  "name": [',
          '    "usage"',
          '  ],',
          '  "description": "Default",',
          '  "options": [',
          '    {',
          '      "name": [',
          '        "--bopt"',
          '      ],',
          '      "exclusiveOn": [',
          '        "--no-bopt"',
          '      ],',
          '      "args": {',
          '        "name": "boolean",',
          '        "suggestions": [',
          '          "true",',
          '          "false"',
          '        ],',
          '        "isOptional": true',
          '      }',
          '    },',
          '    {',
          '      "name": [',
          '        "--no-bopt"',
          '      ],',
          '      "exclusiveOn": [',
          '        "--bopt"',
          '      ]',
          '    }',
          '  ],',
          '  "subcommands": []',
          '};',
          '',
          'export default completionSpec;',
          '',
        ]);
    });

    it('When false', () => {
      const config = {'boolean-negation': false};
      const o = checkOutput(() =>
        yargs('generate-fig-spec')
          .command('$0', 'Default', {
            bopt: {
              type: 'boolean',
            },
          })
          .parserConfiguration(config)
          .figCompletion()
          .parse()
      );
      o.exitCode.should.equal(0);
      o.errors.length.should.equal(0);
      o.logs[0]
        .split('\n')
        .should.deep.equal([
          '// Autogenerated by the Yargs integration',
          '',
          'const completionSpec: Fig.Spec = {',
          '  "name": [',
          '    "usage"',
          '  ],',
          '  "description": "Default",',
          '  "options": [',
          '    {',
          '      "name": [',
          '        "--bopt"',
          '      ],',
          '      "args": {',
          '        "name": "boolean",',
          '        "suggestions": [',
          '          "true",',
          '          "false"',
          '        ],',
          '        "isOptional": true',
          '      }',
          '    }',
          '  ],',
          '  "subcommands": []',
          '};',
          '',
          'export default completionSpec;',
          '',
        ]);
    });
  });

  it('.showFigCompletion() should work without parsing', () => {
    const o = checkOutput(() =>
      yargs()
        .command(
          '$0',
          'An awesome description',
          y => {
            return y.option('delta').alias('delta', 'd').boolean('delta');
          },
          () => {}
        )
        .showFigCompletion()
    );
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": [',
        '    "usage"',
        '  ],',
        '  "description": "An awesome description",',
        '  "subcommands": [],',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    },',
        '    {',
        '      "name": [',
        '        "--delta",',
        '        "-d"',
        '      ],',
        '      "exclusiveOn": [',
        '        "--no-delta"',
        '      ],',
        '      "args": {',
        '        "name": "boolean",',
        '        "suggestions": [',
        '          "true",',
        '          "false"',
        '        ],',
        '        "isOptional": true',
        '      }',
        '    },',
        '    {',
        '      "name": [',
        '        "--no-delta",',
        '        "--no-d"',
        '      ],',
        '      "exclusiveOn": [',
        '        "--delta"',
        '      ]',
        '    }',
        '  ]',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  // TODO(fedeci): not working properly
  it('should not print parent commands when nested', () => {
    const o = checkOutput(() => {
      yargs('cmd1 cmd2 generate-fig-spec')
        .command(
          '$0',
          "Won't get printed",
          y => {
            return y.command(
              'cmd1',
              "Won't get printed",
              y => {
                return y.command(
                  'cmd2',
                  'This will be the root description',
                  y => {
                    return y
                      .figCompletion()
                      .command('cmd3', 'This is a first level printed cmd');
                  },
                  () => {
                    console.log('HI');
                  }
                );
              },
              () => {
                console.log('HI');
              }
            );
          },
          () => {
            console.log('HI');
          }
        )
        .parse();
    });
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": [',
        '    "usage"',
        '  ],',
        '  "description": "Won\'t get printed",',
        '  "subcommands": [',
        '    {',
        '      "name": [',
        '        "cmd1"',
        '      ],',
        '      "description": "Won\'t get printed",',
        '      "subcommands": [',
        '        {',
        '          "name": [',
        '            "cmd2"',
        '          ],',
        '          "description": "This will be the root description",',
        '          "subcommands": [',
        '            {',
        '              "name": [',
        '                "cmd3"',
        '              ],',
        '              "description": "This is a first level printed cmd",',
        '              "options": []',
        '            }',
        '          ],',
        '          "options": [',
        '            {',
        '              "name": [',
        '                "--help"',
        '              ],',
        '              "description": "Show help"',
        '            },',
        '            {',
        '              "name": [',
        '                "--version"',
        '              ],',
        '              "description": "Show version number"',
        '            }',
        '          ]',
        '        }',
        '      ],',
        '      "options": [',
        '        {',
        '          "name": [',
        '            "--help"',
        '          ],',
        '          "description": "Show help"',
        '        },',
        '        {',
        '          "name": [',
        '            "--version"',
        '          ],',
        '          "description": "Show version number"',
        '        }',
        '      ]',
        '    }',
        '  ],',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    }',
        '  ]',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  it('should not run handlers of parent', () => {
    const o = checkOutput(() =>
      yargs('cmd1 cmd2 generate-fig-spec')
        .command(
          '$0',
          "Won't get printed",
          y => {
            return y.command(
              'cmd1',
              "Won't get printed",
              y => {
                return y.command(
                  'cmd2',
                  'This will be the root description',
                  y => {
                    return y
                      .figCompletion()
                      .command('cmd3', 'This is a first level printed cmd');
                  },
                  () => {
                    console.log('Handler 2');
                  }
                );
              },
              () => {
                console.log('Handler 1');
              }
            );
          },
          () => {
            console.log('Root Handler');
          }
        )
        .parse()
    );
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": [',
        '    "usage"',
        '  ],',
        '  "description": "Won\'t get printed",',
        '  "subcommands": [',
        '    {',
        '      "name": [',
        '        "cmd1"',
        '      ],',
        '      "description": "Won\'t get printed",',
        '      "subcommands": [',
        '        {',
        '          "name": [',
        '            "cmd2"',
        '          ],',
        '          "description": "This will be the root description",',
        '          "subcommands": [',
        '            {',
        '              "name": [',
        '                "cmd3"',
        '              ],',
        '              "description": "This is a first level printed cmd",',
        '              "options": []',
        '            }',
        '          ],',
        '          "options": [',
        '            {',
        '              "name": [',
        '                "--help"',
        '              ],',
        '              "description": "Show help"',
        '            },',
        '            {',
        '              "name": [',
        '                "--version"',
        '              ],',
        '              "description": "Show version number"',
        '            }',
        '          ]',
        '        }',
        '      ],',
        '      "options": [',
        '        {',
        '          "name": [',
        '            "--help"',
        '          ],',
        '          "description": "Show help"',
        '        },',
        '        {',
        '          "name": [',
        '            "--version"',
        '          ],',
        '          "description": "Show version number"',
        '        }',
        '      ]',
        '    }',
        '  ],',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    }',
        '  ]',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  it('it should work with * as main command', () => {
    const o = checkOutput(() =>
      yargs('generate-fig-spec')
        .command(
          '* [foo]',
          'Do something',
          y => {
            return y
              .positional('foo', {
                desc: 'Some argument description',
                alias: 'f',
              })
              .command(
                'subcmd',
                'Some command description',
                y => {
                  return y.command(
                    'subsubcmd [arg]',
                    'Some nested description',
                    {
                      opt: {
                        alias: 'o',
                        number: true,
                      },
                    },
                    () => {}
                  );
                },
                () => {}
              );
          },
          () => {}
        )
        .command(
          ['start [app]', 'run', 'up'],
          'Start up an app',
          {
            name: {
              alias: 'n',
              string: true,
              hidden: true,
            },
          },
          argv => {
            console.log('starting up the', argv.app || 'default', 'app');
          }
        )
        .command({
          command: 'configure',
          aliases: ['config', 'cfg'],
          desc: 'Set a config variable',
          builder: y => {
            return y.command(
              'login <key> [value]',
              'Configure login to app',
              y => {
                return y.positional('value', {default: true});
              },
              () => {}
            );
          },
          handler: argv => {
            console.log(`setting ${argv.key} to ${argv.value}`);
          },
        })
        .figCompletion()
        .parse()
    );
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": [',
        '    "usage"',
        '  ],',
        '  "description": "Do something",',
        '  "subcommands": [',
        '    {',
        '      "name": [',
        '        "subcmd"',
        '      ],',
        '      "description": "Some command description",',
        '      "subcommands": [',
        '        {',
        '          "name": [',
        '            "subsubcmd"',
        '          ],',
        '          "description": "Some nested description",',
        '          "options": [',
        '            {',
        '              "name": [',
        '                "--opt",',
        '                "-o"',
        '              ],',
        '              "args": [',
        '                {',
        '                  "name": "number"',
        '                }',
        '              ]',
        '            }',
        '          ],',
        '          "args": [',
        '            {',
        '              "name": "arg",',
        '              "isOptional": true',
        '            }',
        '          ]',
        '        }',
        '      ],',
        '      "options": [',
        '        {',
        '          "name": [',
        '            "--help"',
        '          ],',
        '          "description": "Show help"',
        '        },',
        '        {',
        '          "name": [',
        '            "--version"',
        '          ],',
        '          "description": "Show version number"',
        '        }',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "start",',
        '        "run",',
        '        "up"',
        '      ],',
        '      "description": "Start up an app",',
        '      "options": [',
        '        {',
        '          "name": [',
        '            "--name",',
        '            "-n"',
        '          ],',
        '          "hidden": true,',
        '          "args": [',
        '            {',
        '              "name": "string"',
        '            }',
        '          ]',
        '        }',
        '      ],',
        '      "args": [',
        '        {',
        '          "name": "app",',
        '          "isOptional": true',
        '        }',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "configure",',
        '        "config",',
        '        "cfg"',
        '      ],',
        '      "description": "Set a config variable",',
        '      "subcommands": [',
        '        {',
        '          "name": [',
        '            "login"',
        '          ],',
        '          "description": "Configure login to app",',
        '          "subcommands": [],',
        '          "options": [',
        '            {',
        '              "name": [',
        '                "--help"',
        '              ],',
        '              "description": "Show help"',
        '            },',
        '            {',
        '              "name": [',
        '                "--version"',
        '              ],',
        '              "description": "Show version number"',
        '            }',
        '          ],',
        '          "args": [',
        '            {',
        '              "name": "key"',
        '            },',
        '            {',
        '              "name": "value",',
        '              "isOptional": true,',
        '              "default": "true"',
        '            }',
        '          ]',
        '        }',
        '      ],',
        '      "options": [',
        '        {',
        '          "name": [',
        '            "--help"',
        '          ],',
        '          "description": "Show help"',
        '        },',
        '        {',
        '          "name": [',
        '            "--version"',
        '          ],',
        '          "description": "Show version number"',
        '        }',
        '      ]',
        '    }',
        '  ],',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    }',
        '  ],',
        '  "args": [',
        '    {',
        '      "name": "foo|f",',
        '      "isOptional": true,',
        '      "description": "Some argument description"',
        '    }',
        '  ]',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  it('it should support async builders', () => {
    const o = checkOutput(() =>
      yargs('generate-fig-spec')
        .scriptName('area')
        .command(
          '$0',
          '',
          async y => {
            return Promise.resolve(
              y
                .usage('Usage: $0 -w num -h num')
                .example(
                  '$0 -w 5 -h 6',
                  'Returns the area (30) by multiplying the width with the height.'
                )
                .option('w', {
                  alias: 'width',
                  describe: 'The width of the area.',
                  demandOption: 'The width is required.',
                  type: 'number',
                  nargs: 1,
                })
                .option('h', {
                  alias: 'height',
                  describe: 'The height of the area.',
                  demandOption: 'The height is required.',
                  type: 'number',
                  nargs: 1,
                })
                .demand(['w', 'h'])
                .describe('help', 'Show help.')
                .describe('version', 'Show version number.')
                .epilog('copyright 2019')
            );
          },
          () => {}
        )
        .figCompletion()
        .parse()
    );
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": [',
        '    "area"',
        '  ],',
        '  "subcommands": [],',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help."',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number."',
        '    },',
        '    {',
        '      "name": [',
        '        "-w",',
        '        "--width"',
        '      ],',
        '      "description": "The width of the area.",',
        '      "isRequired": true,',
        '      "args": [',
        '        {',
        '          "name": "number"',
        '        }',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "-h",',
        '        "--height"',
        '      ],',
        '      "description": "The height of the area.",',
        '      "isRequired": true,',
        '      "args": [',
        '        {',
        '          "name": "number"',
        '        }',
        '      ]',
        '    }',
        '  ]',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  it('should not throw for missing required arguments', () => {
    const o = checkOutput(() =>
      yargs('generate-fig-spec')
        .command(
          '$0 <cmd>',
          'Main description',
          y => y.option('a').option('b'),
          () => {}
        )
        .command('install', 'install a package (name@version)')
        .command(
          'publish',
          'publish the package inside the current working directory'
        )
        .option('f', {
          array: true,
          description: 'an array of files',
          default: 'test.js',
          alias: 'file',
        })
        .alias('f', 'fil')
        .option('help', {
          alias: 'h',
          description: 'display help message',
        })
        .string(['user', 'pass'])
        .implies('user', 'pass')
        .help('help')
        .demand('q')
        .version('1.0.1', 'version', 'display version information')
        .alias('version', 'v')
        .example(
          'npm install npm@latest -g',
          'install the latest version of npm'
        )
        .epilog('for more information visit https://github.com/chevex/yargs')
        .showHelpOnFail(false, 'whoops, something went wrong! run with --help')
        .figCompletion()
        .parse()
    );
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": [',
        '    "usage"',
        '  ],',
        '  "description": "Main description",',
        '  "subcommands": [',
        '    {',
        '      "name": [',
        '        "install"',
        '      ],',
        '      "description": "install a package (name@version)",',
        '      "options": []',
        '    },',
        '    {',
        '      "name": [',
        '        "publish"',
        '      ],',
        '      "description": "publish the package inside the current working directory",',
        '      "options": []',
        '    }',
        '  ],',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "-f",',
        '        "--file",',
        '        "--fil"',
        '      ],',
        '      "description": "an array of files",',
        '      "args": [',
        '        {',
        '          "isVariadic": true',
        '        }',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "--user"',
        '      ],',
        '      "dependsOn": [',
        '        "--pass"',
        '      ],',
        '      "args": [',
        '        {',
        '          "name": "string"',
        '        }',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "--pass"',
        '      ],',
        '      "args": [',
        '        {',
        '          "name": "string"',
        '        }',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--1.0.1"',
        '      ],',
        '      "description": "version"',
        '    },',
        '    {',
        '      "name": [',
        '        "-a"',
        '      ],',
        '      "args": [',
        '        {',
        '          "name": "string"',
        '        }',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "-b"',
        '      ],',
        '      "args": [',
        '        {',
        '          "name": "string"',
        '        }',
        '      ]',
        '    }',
        '  ],',
        '  "args": [',
        '    {',
        '      "name": "cmd"',
        '    }',
        '  ]',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  it('should respect nargs and choices', () => {
    const o = checkOutput(() =>
      yargs('generate-fig-spec')
        .option('a')
        .choices('a', ['1', '2', '3'])
        .nargs('a', 2)
        .figCompletion()
        .parse()
    );
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": "usage",',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    },',
        '    {',
        '      "name": [',
        '        "-a"',
        '      ],',
        '      "args": [',
        '        {',
        '          "name": "string",',
        '          "suggestions": [',
        '            "1",',
        '            "2",',
        '            "3"',
        '          ]',
        '        },',
        '        {',
        '          "name": "string",',
        '          "suggestions": [',
        '            "1",',
        '            "2",',
        '            "3"',
        '          ]',
        '        }',
        '      ]',
        '    }',
        '  ],',
        '  "subcommands": []',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  it('should add correct suggestions to boolean options', () => {
    const o = checkOutput(() =>
      yargs('generate-fig-spec')
        .option('a')
        .boolean('a')
        .conflicts('a', 'b')
        .option('b')
        .boolean('b')
        .nargs('b', 3)
        .deprecateOption('b')
        .figCompletion()
        .parse()
    );
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": "usage",',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    },',
        '    {',
        '      "name": [',
        '        "-a"',
        '      ],',
        '      "exclusiveOn": [',
        '        "-b",',
        '        "--no-a"',
        '      ],',
        '      "args": {',
        '        "name": "boolean",',
        '        "suggestions": [',
        '          "true",',
        '          "false"',
        '        ],',
        '        "isOptional": true',
        '      }',
        '    },',
        '    {',
        '      "name": [',
        '        "--no-a"',
        '      ],',
        '      "exclusiveOn": [',
        '        "-b",',
        '        "-a"',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "-b"',
        '      ],',
        '      "deprecated": true,',
        '      "args": [',
        '        {',
        '          "name": "boolean",',
        '          "suggestions": [',
        '            "true",',
        '            "false"',
        '          ]',
        '        },',
        '        {',
        '          "name": "boolean",',
        '          "suggestions": [',
        '            "true",',
        '            "false"',
        '          ]',
        '        },',
        '        {',
        '          "name": "boolean",',
        '          "suggestions": [',
        '            "true",',
        '            "false"',
        '          ]',
        '        }',
        '      ]',
        '    }',
        '  ],',
        '  "subcommands": []',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  it('should choose the correct option type', () => {
    const o = checkOutput(() =>
      yargs('generate-fig-spec')
        .option('a')
        .count('a')
        .option('b')
        .number('b')
        .deprecateOption('b', 'This opt was deprecated, use "-a" instead.')
        .figCompletion()
        .parse()
    );
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": "usage",',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    },',
        '    {',
        '      "name": [',
        '        "-a"',
        '      ],',
        '      "isRepeatable": true',
        '    },',
        '    {',
        '      "name": [',
        '        "-b"',
        '      ],',
        '      "deprecated": {',
        '        "description": "This opt was deprecated, use \\"-a\\" instead."',
        '      },',
        '      "args": [',
        '        {',
        '          "name": "number"',
        '        }',
        '      ]',
        '    }',
        '  ],',
        '  "subcommands": []',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  it('should respect positional configuration', () => {
    const o = checkOutput(() =>
      yargs('generate-fig-spec')
        .command(
          '$0 <foo...>',
          'Some description',
          y =>
            y.positional('foo', {
              choices: ['1', '2'],
            }),
          () => {},
          undefined,
          true
        )
        .figCompletion()
        .parse()
    );
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": [',
        '    "usage"',
        '  ],',
        '  "deprecated": true,',
        '  "description": "Some description",',
        '  "subcommands": [],',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    }',
        '  ],',
        '  "args": [',
        '    {',
        '      "name": "foo",',
        '      "isVariadic": true,',
        '      "suggestions": [',
        '        "1",',
        '        "2"',
        '      ]',
        '    }',
        '  ]',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });
});
