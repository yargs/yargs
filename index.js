module.exports = Argv;
var path = require('path');

/*  Hack an instance of Argv with process.argv into Argv
    so people an do
        require('optimist')(['--beeble=1','-z','zizzle']).argv
    to parse a list of args and
        require('optimist').argv
    to get a parsed version of process.argv.
*/
var inst = Argv(process.argv.slice(2));
Object.keys(inst).forEach(function (key) {
    Argv[key] = typeof inst[key] == 'function'
        ? inst[key].bind(inst)
        : inst[key];
});

function Argv (args, cwd) {
    var self = {};
    if (!cwd) cwd = process.cwd();
    
    self.$0 = process.argv
        .slice(0,2)
        .map(function (x) {
            var b = rebase(cwd, x);
            return x.match(/^\//) && b.length < x.length
                ? b : x
        })
        .join(' ')
    ;
    
    if (process.argv[1] == process.env._) {
        self.$0 = process.env._.replace(
            path.dirname(process.execPath) + '/', ''
        );
    }
    
    function set (key, val) {
        var num = Number(val);
        var value = typeof val !== 'string' || isNaN(num) ? val : num;
        if (flags.strings[key]) value = val;
        
        if (key in self.argv) {
            if (!Array.isArray(self.argv[key])) {
                self.argv[key] = [ self.argv[key] ];
            }
            self.argv[key].push(value);
        }
        else {
            self.argv[key] = value;
        }
    }
    
    var flags = { bools : {}, strings : {} };
    
    self.boolean = function (bools) {
        if (!Array.isArray(bools)) {
            bools = [].slice.call(arguments);
        }
        
        bools.forEach(function (name) {
            flags.bools[name] = true;
        });
        
        rescan();
        
        bools.forEach(function (name) {
            if (!self.argv[name]) {
                self.argv[name] = false;
            }
        });
        
        return self;
    };
    
    self.string = function (strings) {
        if (!Array.isArray(strings)) {
            strings = [].slice.call(arguments);
        }
        
        strings.forEach(function (name) {
            flags.strings[name] = true;
        });
        
        rescan();
        
        return self;
    };
    
    function rescan () {
        self.argv = { _ : [], $0 : self.$0 };
        
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            
            if (arg == '--') {
                self.argv._.push.apply(self.argv._, args.slice(i + 1));
                break;
            }
            else if (arg.match(/^--.+=/)) {
                var m = arg.match(/^--([^=]+)=(.*)/);
                set(m[1], m[2]);
            }
            else if (arg.match(/^--no-.+/)) {
                var key = arg.match(/^--no-(.+)/)[1];
                set(key, false);
            }
            else if (arg.match(/^--.+/)) {
                var key = arg.match(/^--(.+)/)[1];
                var next = args[i + 1];
                if (next !== undefined && !next.match(/^-/)
                && !flags.bools[key]) {
                    set(key, next);
                    i++;
                }
                else {
                    set(key, true);
                }
            }
            else if (arg.match(/^-[^-]+/)) {
                var letters = arg.slice(1,-1).split('');
                
                var broken = false;
                for (var j = 0; j < letters.length; j++) {
                    if (letters[j+1] && letters[j+1].match(/\W/)) {
                        set(letters[j], arg.slice(j+2));
                        broken = true;
                        break;
                    }
                    else {
                        set(letters[j], true);
                    }
                }
                
                if (!broken) {
                    var key = arg.slice(-1)[0];
                    
                    if (args[i+1] && !args[i+1].match(/^-/)
                    && !flags.bools[key]) {
                        set(key, args[i+1]);
                        i++;
                    }
                    else {
                        set(key, true);
                    }
                }
            }
            else {
                var n = Number(arg);
                self.argv._.push(isNaN(n) ? arg : n);
            }
        }
    }
    rescan();
    
    var usage;
    self.usage = function (msg, opts) {
        if (!opts && typeof msg === 'object') {
            opts = msg;
            msg = null;
        }
      
        usage = msg;
        return opts ? self.options(opts) : self;
    };
    
    function fail (msg) {
        console.error(msg);
        self.showHelp();
        process.exit(1);
    }
    
    self.check = function (f) {
        try {
            if (f(self.argv) === false) fail(
                'Argument check failed: ' + f.toString()
            );
        }
        catch (err) { fail(err) }
        
        return self;
    };
    
    self.demand = function (keys, cb) {
        if (typeof keys == 'number') {
            return self.demandCount(keys, cb);
        }
        
        var missing = [];
        keys.forEach(function (key) {
            if (!(key in self.argv)) missing.push(key);
        });
        
        if (missing.length > 0) {
            if (cb) cb(missing);
            else fail('Missing arguments: ' + missing.join(' '));
        }
        return self;
    };
    
    self.demandCount = function (count, cb) {
        if (self.argv._.length < count) {
            if (cb) cb(self.argv._.length);
            else fail('Not enough arguments, expected '
                + count + ', but only found ' + self.argv._.length);
        }
        return self;
    };
    
    self.default = function (key, value) {
        if (typeof key === 'object') {
            Object.keys(key).forEach(function (k) {
                self.default(k, key[k]);
            });
        }
        else {
            if (self.argv[key] === undefined) {
                self.argv[key] = value;
            }
        }
        return self;
    };
    
    self.parse = function (args) {
        return Argv(args).argv;
    };
    
    self.camelCase = function () {
        for (var key in self.argv) {
            var camelCasedKey = key.replace(/-([a-z])/g, function ($0, firstLetter) {
                return firstLetter.toUpperCase();
            });
            if (camelCasedKey !== key) {
                self.argv[camelCasedKey] = self.argv[key];
                delete self.argv[key];
            }
        }
        return self;
    };
    
    function longestElement (a) {
        var l = 0;
        for (var i = 0; i < a.length; i++) {
            if (a[l].length < a[i].length) {
                l = i;
            }
        }

        return a[l].length;
    }
    
    self.options = function (opts) {
        var required = [],
            strings = [],
            bools = [];
    
        self.options = opts;
      
        Object.keys(opts).forEach(function (key) {
          var o = opts[key],
              oargs = [key]
            
          if (o.short && o.short !== key) {
              oargs.unshift(o.short);
          }
        
          if (o.required) {
              required = required.concat(oargs);
          }
        
          if (o.boolean) {
              bools = bools.concat(oargs);
          }
          else if (o.string) {
              strings = strings.concat(oargs);
          }
        
          if (o.default) {
              //
              // If this argument has default values then set it
              // internally on this `Argv` instance for both the verbose
              // and `short` option (if provided).
              //
              oargs.forEach(function (a) {
                  self.default(a, o.default);
              });
          }
        });
      
        if (required.length > 0) {
            //
            // If required properties have been supplied, 
            // then demand them immediately. 
            //
            // TODO: Patch `.demand()` so that it can discern between
            // multiple options for each real option. (e.g. `.demand(['a', 'about'])`
            // fails when it is really the same argument.
            //
            self.demand(required);
        }
      
        if (bools.length > 0) {
            self.boolean(bools);
        }
      
        if (strings.length > 0) {
            self.string(strings);
        }
      
        return self;
    };
    
    self.showHelp = function (padding) {
        if (usage) {
          console.error(usage.replace(/\$0/g, self.$0));
        }
      
        if (self.options && Object.keys(self.options).length > 0) {
            var help = Object.keys(self.options).map(function (key) {
                var o = self.options[key],
                    hargs = [o.short, key]; 
          
                hargs = hargs.filter(function (a) { 
                    return a; 
                }).map(function (a) {
                    return a.length === 1 ? '-' + a : '--' + a;
                }).join(', ');
          
                return {
                    args: hargs,
                    description: o.description,
                    default: o.default
                };
            })
        
            padding = padding || 2;
        
            var larg = longestElement(help.map(function (h) { return h.args })),
                described = help.filter(function (h) { return h.description }),
                more = help.filter(function (h) { return !h.description });
        
            function printOpt (h) {
              var hdesc = h.description || '';
          
              if (h.args.length < larg) {
                  h.args += new Array(larg - h.args.length + 1).join(' ');
              }
          
              if (padding) {
                  hdesc = new Array(padding + 1).join(' ') + hdesc;
              }
          
              return [
                  '  ' + h.args,
                  hdesc,
                  h.default ? '[' + h.default + ']' : ''
              ].join(' ');
            }
        
            if (described.length > 0) {
                console.log('options:');
                console.log(described.map(printOpt).join('\n'));
            }
        
            if (more.length > 0) {
                console.log('\nmore options:');
                console.log(more.map(printOpt).join('\n'));
            }
        }
    }
    
    return self;
};

// rebase an absolute path to a relative one with respect to a base directory
// exported for tests
module.exports.rebase = rebase;
function rebase (base, dir) {
    var ds = path.normalize(dir).split('/').slice(1);
    var bs = path.normalize(base).split('/').slice(1);
    
    for (var i = 0; ds[i] && ds[i] == bs[i]; i++);
    ds.splice(0, i); bs.splice(0, i);
    
    var p = path.normalize(
        bs.map(function () { return '..' }).concat(ds).join('/')
    ).replace(/\/$/,'').replace(/^$/, '.');
    return p.match(/^[.\/]/) ? p : './' + p;
}
