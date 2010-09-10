var optimist = require('optimist');

exports['short boolean'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-b' ]),
        { b : true, _ : [] }
    );
};

exports['long boolean'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '--bool' ]),
        { bool : true, _ : [] }
    );
};
    
exports.bare = function (assert) {
    assert.deepEqual(
        optimist.parse([ 'foo', 'bar', 'baz' ]),
        { _ : [ 'foo', 'bar', 'baz' ] }
    );
};

exports['short group'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-cats' ]),
        { c : true, a : true, t : true, s : true, _ : [] }
    );
};

exports['short group next'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-cats', 'meow' ]),
        { c : true, a : true, t : true, s : 'meow', _ : [] }
    );
};
 
exports['short capture'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-h', 'localhost' ]),
        { h : 'localhost', _ : [] }
    );
};

exports['short captures'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-h', 'localhost', '-p', '555' ]),
        { h : 'localhost', p : '555', _ : [] }
    );
};


exports['long capture'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '--pow=xixxle' ]),
        { pow : 'xixxle', _ : [] }
    );
};

exports['long captures'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '--host=localhost', '--port=555' ]),
        { host : 'localhost', port : '555', _ : [] }
    );
};

exports['mixed short bool and capture'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-h', 'localhost', '-fp', '555', 'script.js' ]),
        { f : true, p : 555, h : 'localhost', _ : [ 'script.js' ] }
    );
};
 
exports['short and long'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-h', 'localhost', '-fp', '555', 'script.js' ]),
        { f : true, p : 555, h : 'localhost', _ : [ 'script.js' ] }
    );
};

exports.no = function (assert) {
    assert.deepEqual(
        optimist.parse([ '--no-moo' ]),
        { moo : false, _ : [] }
    );
};
 
 
exports.comprehensive = function (assert) {
    assert.deepEqual(
        optimist.parse([
            '--name=meowmers', 'bare', '-cats', 'woo', '-h', 'awesome',
            '-b', '--bool', '--no-meep',
            '--', '--not-a-flag', 'eek'
        ]),
        {
            c : true,
            a : true,
            t : true,
            s : 'woo',
            h : 'awesome',
            b : true,
            bool : true,
            meep : false,
            name : 'meowmers',
            _ : [ 'bare', '--not-a-flag', 'eek' ],
        }
    );
};
