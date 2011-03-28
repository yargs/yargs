var optimist = require('optimist');
var assert = require('assert');

exports['short boolean'] = function (assert) {
    var parse = optimist.parse([ '-b' ]);
    assert.eql(parse, { b : true, _ : [], $0 : 'expresso' });
    assert.eql(typeof parse.b, 'boolean');
};

exports['long boolean'] = function (assert) {
    assert.eql(
        optimist.parse([ '--bool' ]),
        { bool : true, _ : [], $0 : 'expresso' }
    );
};
    
exports.bare = function (assert) {
    assert.eql(
        optimist.parse([ 'foo', 'bar', 'baz' ]),
        { _ : [ 'foo', 'bar', 'baz' ], $0 : 'expresso' }
    );
};

exports['short group'] = function (assert) {
    assert.eql(
        optimist.parse([ '-cats' ]),
        { c : true, a : true, t : true, s : true, _ : [], $0 : 'expresso' }
    );
};

exports['short group next'] = function (assert) {
    assert.eql(
        optimist.parse([ '-cats', 'meow' ]),
        { c : true, a : true, t : true, s : 'meow', _ : [], $0 : 'expresso' }
    );
};
 
exports['short capture'] = function (assert) {
    assert.eql(
        optimist.parse([ '-h', 'localhost' ]),
        { h : 'localhost', _ : [], $0 : 'expresso' }
    );
};

exports['short captures'] = function (assert) {
    assert.eql(
        optimist.parse([ '-h', 'localhost', '-p', '555' ]),
        { h : 'localhost', p : 555, _ : [], $0 : 'expresso' }
    );
};

exports['long capture sp'] = function (assert) {
    assert.eql(
        optimist.parse([ '--pow', 'xixxle' ]),
        { pow : 'xixxle', _ : [], $0 : 'expresso' }
    );
};

exports['long capture eq'] = function (assert) {
    assert.eql(
        optimist.parse([ '--pow=xixxle' ]),
        { pow : 'xixxle', _ : [], $0 : 'expresso' }
    );
};

exports['long captures sp'] = function (assert) {
    assert.eql(
        optimist.parse([ '--host', 'localhost', '--port', '555' ]),
        { host : 'localhost', port : 555, _ : [], $0 : 'expresso' }
    );
};

exports['long captures eq'] = function (assert) {
    assert.eql(
        optimist.parse([ '--host=localhost', '--port=555' ]),
        { host : 'localhost', port : 555, _ : [], $0 : 'expresso' }
    );
};

exports['mixed short bool and capture'] = function (assert) {
    assert.eql(
        optimist.parse([ '-h', 'localhost', '-fp', '555', 'script.js' ]),
        {
            f : true, p : 555, h : 'localhost',
            _ : [ 'script.js' ], $0 : 'expresso',
        }
    );
};
 
exports['short and long'] = function (assert) {
    assert.eql(
        optimist.parse([ '-h', 'localhost', '-fp', '555', 'script.js' ]),
        {
            f : true, p : 555, h : 'localhost',
            _ : [ 'script.js' ], $0 : 'expresso',
        }
    );
};

exports.no = function (assert) {
    assert.eql(
        optimist.parse([ '--no-moo' ]),
        { moo : false, _ : [], $0 : 'expresso' }
    );
};
 
exports.multi = function (assert) {
    assert.eql(
        optimist.parse([ '-v', 'a', '-v', 'b', '-v', 'c' ]),
        { v : ['a','b','c'], _ : [], $0 : 'expresso' }
    );
};
 
exports.comprehensive = function (assert) {
    assert.eql(
        optimist.parse([
            '--name=meowmers', 'bare', '-cats', 'woo',
            '-h', 'awesome', '--multi=quux',
            '--key', 'value',
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
            key : 'value',
            multi : [ 'quux', 'baz' ],
            meep : false,
            name : 'meowmers',
            _ : [ 'bare', '--not-a-flag', 'eek' ],
            $0 : 'expresso'
        }
    );
};

exports.nums = function (assert) {
    var argv = optimist.parse([
        '-x', '1234',
        '-y', '5.67',
        '-z', '1e7',
        '-w', '10f',
        '--hex', '0xdeadbeef',
        '789',
    ]);
    assert.eql(argv, {
        x : 1234,
        y : 5.67,
        z : 1e7,
        w : '10f',
        hex : 0xdeadbeef,
        _ : [ 789 ],
        $0 : 'expresso'
    });
    assert.eql(typeof argv.x, 'number');
    assert.eql(typeof argv.y, 'number');
    assert.eql(typeof argv.z, 'number');
    assert.eql(typeof argv.w, 'string');
    assert.eql(typeof argv.hex, 'number');
    assert.eql(typeof argv._[0], 'number');
};

exports['flag boolean'] = function (assert) {
    var parse = optimist([ '-t', 'moo' ]).boolean(['t']).argv;
    assert.eql(parse, { t : true, _ : [ 'moo' ], $0 : 'expresso' });
    assert.eql(typeof parse.t, 'boolean');
};

exports['boolean groups'] = function (assert) {
    var parse = optimist([ '-x', '-z', 'one', 'two', 'three' ])
        .boolean(['x','y','z']).argv;
    
    assert.eql(parse, {
        x : true,
        y : false,
        z : true,
        _ : [ 'one', 'two', 'three' ],
        $0 : 'expresso',
    });
    
    assert.eql(typeof parse.x, 'boolean');
    assert.eql(typeof parse.y, 'boolean');
    assert.eql(typeof parse.z, 'boolean');
};

exports.strings = function () {
    var s = optimist([ '-s', '0001234' ]).string('s').argv.s;
    assert.eql(s, '0001234');
    assert.eql(typeof s, 'string');
    
    var x = optimist([ '-x', '56' ]).string('x').argv.x;
    assert.eql(x, '56');
    assert.eql(typeof x, 'string');
};
