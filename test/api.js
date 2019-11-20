'use strict'

const apiTests = require('./api-test')

apiTests('legacy', require('..'), require.resolve('..'), require('../yargs'))
apiTests('yargsa', require('..').yargsa, require.resolve('..'), require('../yargsa'))
