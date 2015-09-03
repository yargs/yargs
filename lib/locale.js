// port of https://github.com/sindresorhus/os-locale
// that only looks at environment variables.
module.exports = function () {
  return getEnvLocale()
}

function getEnvLocale () {
  var env = process.env
  var ret = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE
  return getLocale(ret)
}

function getLocale (str) {
  return (str && str.replace(/[.:].*/, '')) || fallback()
}

function fallback () {
  return 'en_US'
}
