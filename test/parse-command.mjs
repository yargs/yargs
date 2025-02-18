/* global describe, it */
const {expect} = require('chai');
const {parseCommand} = require('../build/index.cjs');

describe('parseCommand', () => {
  it('should throw if no command is specified', () => {
    expect(() => parseCommand('')).to.throw('No command found in: ');
  });
});
