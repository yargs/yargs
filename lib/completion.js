var fs = require('fs'),
  path = require('path');

// add completion to your yargs-powered
// applications.
module.exports = function (yargs, usage) {
  var self = {
    completionKey: 'get-yargs-completions'
  };

  // get a list of completion commands, one per line.
  self.getCompletion = function() {
    var current = process.argv[process.argv.length - 1],
      previous = process.argv.slice(process.argv.indexOf('--' + self.completionKey) + 1),
      argv = yargs.parse(previous);

      fs.writeFileSync('./foo.txt', JSON.stringify({
        previous: previous,
        current: current
      }), 'utf-8');


    if (!current.match(/^-/)) {
      usage.getCommands().forEach(function(command) {
        console.log(command[0]);
      });
    }

    if (current.match(/^-/)) {
      Object.keys(yargs.getOptions().key).forEach(function(key) {
        console.log('--' + key);
      });
    }
  };

  // generate the completion script to add to your .bashrc.
  self.generateCompletionScript = function($0) {
    var script = fs.readFileSync(
        path.resolve(__dirname, '../completion.sh.hbs'),
        'utf-8'
      ),
      name = path.basename($0);

    // add ./to applications not yet installed as bin.
    if ($0.match(/\.js$/)) $0 = './' + $0;

    script = script.replace(/{{app_name}}/g, name);
    return script.replace(/{{app_path}}/g, $0);
  };

  return self;
};
