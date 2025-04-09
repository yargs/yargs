/* global describe, it */
import {expect} from 'chai';
import {parseCommand} from '../build/lib/parse-command.js';

describe('parseCommand', () => {
  it('should throw if no command is specified', () => {
    expect(() => parseCommand('')).to.throw('No command found in: ');
  });
});
