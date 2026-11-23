/* global describe, it */

import * as fs from 'fs';
import * as path from 'path';
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

  it('does not allow prototype pollution via __proto__', () => {
    const polluted = JSON.parse('{"__proto__": {"polluted": true}}');
    const conf = applyExtends(polluted, process.cwd(), true);
    expect(conf.polluted).to.equal(undefined);
    expect({}.polluted).to.equal(undefined);
  });

  it('resolves relative extends inside a module or file-URL config', () => {
    const tmpDir = fs.mkdtempSync(path.resolve('yargs-extends-'));
    try {
      fs.writeFileSync(
        path.join(tmpDir, 'base.json'),
        JSON.stringify({c: 3})
      );
      const entryFile = path.join(tmpDir, 'index.cjs');
      fs.writeFileSync(
        entryFile,
        'module.exports = { extends: "./base.json", b: 2 };\n'
      );

      const conf = applyExtends(
        {a: 1, extends: entryFile.replace(/\\/g, '/')},
        process.cwd(),
        false
      );
      expect(conf).to.deep.equal({a: 1, b: 2, c: 3});
    } finally {
      fs.rmSync(tmpDir, {recursive: true, force: true});
    }
  });
});
