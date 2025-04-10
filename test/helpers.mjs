/* global describe, it */

import {expect} from 'chai';
import {applyExtends} from '../helpers/helpers.mjs';

describe('applyExtends', () => {
  it('loads a JSON file if one is referenced by "extends" key', () => {
    const conf = applyExtends(
      {
        extends: './test/fixtures/config.json',
        batman: 'Caped Crusader',
      },
      process.cwd()
    );
    expect(conf.batman).to.equal('Caped Crusader');
    expect(conf.version).to.equal('1.0.2');
  });
});
