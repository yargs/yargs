// CJS import shim for older versions of Node.js.
// this can be removed once all supported Node.js versions support
// export maps:
const Yargs = require('./build/index.cjs')
console.info(Yargs)
module.exports = Yargs
