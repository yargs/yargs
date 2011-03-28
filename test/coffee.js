// coffee script style arguments where process.argv is .splice(2)'d
var fs = require('fs');
var Script = process.binding('evals').Script;
var Hash = require('hashish');

exports.coffee = function (assert) {
    fs.readFile(__dirname + '/../index.js', function (err, src) {
        if (err) assert.fail(err);
        var context = {
            require : require,
            module : { exports : {} },
            process : Hash.merge(process, {
                argv : [ 'meow', '--x=10' ],
            }),
        };
        context.exports = context.module.exports;
        Script.runInNewContext(src.toString(), context);
        
        var argv = context.module.exports.argv;
        assert.eql(argv.x, 10);
        assert.eql(argv._, ['meow']);
        
    });
};
