'use strict';
/* global it */

import {Parser} from '../helpers/helpers.mjs';
import * as parser from 'yargs-parser';
import {should} from 'chai';

should();

it('should expose yargs-parser as Parser', () => {
  Parser.should.equal(parser.default);
});
