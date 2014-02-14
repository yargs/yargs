var should = require('chai').should(),
    yargs = require('../');

describe('parse', function () {

    describe('boolean modifier function', function () {

        it('should prevent yargs from sucking in the next option as the value of the first option', function () {
            var argv = yargs().boolean('b').parse([ '-b', '123' ]);
            argv.should.have.property('b', true);
            argv.should.have.property('_').and.deep.equal([123]);
        });

    });

});
