// this file handles outputting usage instructions,
// failures, etc. keeps logging in one place.
var wordwrap = require('wordwrap');

module.exports = Usage;

function Usage (yargs) {
    var self = {};

    // methods for ouputting/building failure message.
    var fails = [];
    self.failFn = function (f) {
        fails.push(f);
    };

    var failMessage = null;
    var showHelpOnFail = true;
    self.showHelpOnFail = function (enabled, message) {
        if (typeof enabled === 'string') {
            message = enabled;
            enabled = true;
        }
        else if (typeof enabled === 'undefined') {
            enabled = true;
        }
        failMessage = message;
        showHelpOnFail = enabled;
        return self;
    };

    self.fail = function (msg) {
        if (fails.length) {
            fails.forEach(function (f) {
                f(msg);
            });
        } else {
            if (showHelpOnFail) {
                yargs.showHelp();
            }
            if (msg) console.error(msg);
            if (failMessage) {
                if (msg) {
                    console.error("");
                }
                console.error(failMessage);
            }
            if (yargs.getExitProcess()){
                process.exit(1);
            }else{
                throw new Error(msg);
            }
        }
    };

    // methods for ouputting/building help (usage) message.
    var usage;
    self.usage = function (msg) {
        usage = msg;
    };

    var wrap = null;
    self.wrap = function (cols) {
        wrap = cols;
    };

    self.help = function () {
        var descriptions = yargs.getDescriptions(),
            demanded = yargs.getDemanded(),
            examples = yargs.getExamples(),
            options = yargs.getOptions(),
            keys = Object.keys(
                Object.keys(descriptions)
                .concat(Object.keys(demanded))
                .concat(Object.keys(options.default))
                .reduce(function (acc, key) {
                    if (key !== '_') acc[key] = true;
                    return acc;
                }, {})
            );

        var help = keys.length ? [ 'Options:' ] : [];

        if (examples.length) {
            help.unshift('');
            examples.forEach(function (example) {
                example[0] = example[0].replace(/\$0/g, yargs.$0);
            });

            var commandlen = longest(examples.map(function (a) {
                return a[0];
            }));

            var exampleLines = examples.map(function(example) {
                var command = example[0];
                var description = example[1];
                command += Array(commandlen + 5 - command.length).join(' ');
                return '  ' + command + description;
            });

            exampleLines.push('');
            help = exampleLines.concat(help);
            help.unshift('Examples:');
        }

        if (usage) {
            help.unshift(usage.replace(/\$0/g, yargs.$0), '');
        }

        var aliasKeys = (Object.keys(options.alias) || [])
            .concat(Object.keys(yargs.parsed.newAliases) || []);

        keys = keys.filter(function(key) {
            return !yargs.parsed.newAliases[key] && aliasKeys.every(function(alias) {
                return -1 == (options.alias[alias] || []).indexOf(key);
            });
        });
        var switches = keys.reduce(function (acc, key) {
            acc[key] = [ key ].concat(options.alias[key] || [])
                .map(function (sw) {
                    return (sw.length > 1 ? '--' : '-') + sw
                })
                .join(', ')
            ;
            return acc;
        }, {});

        var switchlen = longest(Object.keys(switches).map(function (s) {
            return switches[s] || '';
        }));

        var desclen = longest(Object.keys(descriptions).map(function (d) {
            return descriptions[d] || '';
        }));

        keys.forEach(function (key) {
            var kswitch = switches[key];
            var desc = descriptions[key] || '';

            if (wrap) {
                desc = wordwrap(switchlen + 4, wrap)(desc)
                    .slice(switchlen + 4)
                ;
            }

            var spadding = new Array(
                Math.max(switchlen - kswitch.length + 3, 0)
            ).join(' ');

            var dpadding = new Array(
                Math.max(desclen - desc.length + 1, 0)
            ).join(' ');

            var type = null;

            if (options.boolean[key]) type = '[boolean]';
            if (options.count[key]) type = '[count]';
            if (options.string[key]) type = '[string]';
            if (options.normalize[key]) type = '[string]';

            if (!wrap && dpadding.length > 0) {
                desc += dpadding;
            }

            var prelude = '  ' + kswitch + spadding;
            var extra = [
                type,
                demanded[key]
                    ? '[required]'
                    : null
                ,
                options.default[key] !== undefined
                    ? '[default: ' + (typeof options.default[key] === 'string' ?
                    JSON.stringify : String)(options.default[key]) + ']'
                    : null
            ].filter(Boolean).join('  ');

            var body = [ desc, extra ].filter(Boolean).join('  ');

            if (wrap) {
                var dlines = desc.split('\n');
                var dlen = dlines.slice(-1)[0].length
                    + (dlines.length === 1 ? prelude.length : 0)

                if (extra.length > wrap) {
                    body = desc + '\n' + wordwrap(switchlen + 4, wrap)(extra)
                } else {
                    body = desc + (dlen + extra.length > wrap - 2
                        ? '\n'
                            + new Array(wrap - extra.length + 1).join(' ')
                            + extra
                        : new Array(wrap - extra.length - dlen + 1).join(' ')
                            + extra
                    );
                }
            }

            help.push(prelude + body);
        });

        if (keys.length) help.push('');
        return help.join('\n');
    };

    self.showHelp = function (fn) {
        if (!fn) fn = console.error.bind(console);
        fn(self.help());
    }

    function longest (xs) {
        return Math.max.apply(
            null,
            xs.map(function (x) { return x.length })
        );
    }

    // logic for displaying application version.
    var version = null;
    self.version = function (ver, opt, msg) {
        version = ver;
    };

    self.showVersion = function() {
        console.info(version);
    };

    return self;
}
