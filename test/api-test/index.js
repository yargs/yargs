'use strict'
/* global describe */

const path = require('path')
const fixturesRootPath = path.join(__dirname, 'fixtures')

/**
 * API tests common to both API (legacy and yargsa)
 *
 * @param apiName the API name
 * @param yargsLoadedApi the API, loaded through the main yargs module
 * @param yargsResolvePath the resolve path of the main yargs modules
 * @param directlyLoadedApi the API, loaded directly from its own module
 */
module.exports = function apiTests (apiName, yargsLoadedApi, yargsResolvePath, directlyLoadedApi) {
  describe(`${apiName} API`, () => {
    require('./command')(yargsLoadedApi)
    require('./completion')(yargsLoadedApi)
    require('./integration')(path.join(fixturesRootPath, apiName))
    require('./middleware')(yargsLoadedApi, yargsResolvePath)
    require('./parser')(directlyLoadedApi)
    require('./usage')(yargsLoadedApi, directlyLoadedApi)
    require('./validation')(yargsLoadedApi, yargsResolvePath)
    require('./yargs')(yargsLoadedApi, yargsResolvePath)
  })
}
