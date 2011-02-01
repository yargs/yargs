var spawn = require('child_process').spawn;
var assert = require('assert');

exports.dotSlashEmpty = function () {
    var to = setTimeout(function () {
        assert.fail('Never got stdout data.')
    }, 1000);
    
    var oldDir = process.cwd();
    process.chdir(__dirname + '/_');
    var bin = spawn('./bin.js');
    process.chdir(oldDir);
    
    bin.stderr.on('data', assert.fail);
    bin.stdout.on('data', function (buf) {
        clearTimeout(to);
        var _ = JSON.parse(buf.toString());
        assert.eql(_, []);
    });
};

exports.dotSlashArgs = function () {
    var to = setTimeout(function () {
        assert.fail('Never got stdout data.')
    }, 1000);
    
    var oldDir = process.cwd();
    process.chdir(__dirname + '/_');
    var bin = spawn('./bin.js', ['a','b','c']);
    process.chdir(oldDir);
    
    bin.stderr.on('data', assert.fail);
    bin.stdout.on('data', function (buf) {
        clearTimeout(to);
        var _ = JSON.parse(buf.toString());
        assert.eql(_, ['a','b','c']);
    });
};
