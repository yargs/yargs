/* global describe, it */
const {objFilter} = require('../build/index.cjs');
const {expect} = require('chai');

describe('ObjFilter', () => {
  it('returns a new reference to the original object if no filter function is given', () => {
    const original = {foo: 'bar', baz: 'foo'};
    const result = objFilter(original);

    expect(original).to.eql(result);
    expect(original).to.deep.eql(result);
  });
});
