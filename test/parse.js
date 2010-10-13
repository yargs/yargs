var optimist = require('optimist');

exports['short boolean'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-b' ]),
        { b : true, _ : [], $0 : 'expresso' }
    );
};

exports['long boolean'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '--bool' ]),
        { bool : true, _ : [], $0 : 'expresso' }
    );
};
    
exports.bare = function (assert) {
    assert.deepEqual(
        optimist.parse([ 'foo', 'bar', 'baz' ]),
        { _ : [ 'foo', 'bar', 'baz' ], $0 : 'expresso' }
    );
};

exports['short group'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-cats' ]),
        { c : true, a : true, t : true, s : true, _ : [], $0 : 'expresso' }
    );
};

exports['short group next'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-cats', 'meow' ]),
        { c : true, a : true, t : true, s : 'meow', _ : [], $0 : 'expresso' }
    );
};
 
exports['short capture'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-h', 'localhost' ]),
        { h : 'localhost', _ : [], $0 : 'expresso' }
    );
};

exports['short captures'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-h', 'localhost', '-p', '555' ]),
        { h : 'localhost', p : '555', _ : [], $0 : 'expresso' }
    );
};


exports['long capture'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '--pow=xixxle' ]),
        { pow : 'xixxle', _ : [], $0 : 'expresso' }
    );
};

exports['long captures'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '--host=localhost', '--port=555' ]),
        { host : 'localhost', port : '555', _ : [], $0 : 'expresso' }
    );
};

exports['mixed short bool and capture'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-h', 'localhost', '-fp', '555', 'script.js' ]),
        {
            f : true, p : 555, h : 'localhost',
            _ : [ 'script.js' ], $0 : 'expresso',
        }
    );
};
 
exports['short and long'] = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-h', 'localhost', '-fp', '555', 'script.js' ]),
        {
            f : true, p : 555, h : 'localhost',
            _ : [ 'script.js' ], $0 : 'expresso',
        }
    );
};

exports.no = function (assert) {
    assert.deepEqual(
        optimist.parse([ '--no-moo' ]),
        { moo : false, _ : [], $0 : 'expresso' }
    );
};
 
exports.multi = function (assert) {
    assert.deepEqual(
        optimist.parse([ '-v', 'a', '-v', 'b', '-v', 'c' ]),
        { v : ['a','b','c'], _ : [], $0 : 'expresso' }
    );
};
 
exports.comprehensive = function (assert) {
    assert.deepEqual(
        optimist.parse([
            '--name=meowmers', 'bare', '-cats', 'woo',
            '-h', 'awesome', '--multi=quux',
            '-b', '--bool', '--no-meep', '--multi=baz',
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
            multi : [ 'quux', 'baz' ],
            meep : false,
            name : 'meowmers',
            _ : [ 'bare', '--not-a-flag', 'eek' ],
            $0 : 'expresso'
        }
    );
};
