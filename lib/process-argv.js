function getProcessArgvBinIndex () {
  // Built Electron app: app argv1 argv2 ... argvn
  // (process.defaultApp is set to false by electron for built app for this purpose,
  // see https://github.com/electron/electron/issues/4690#issuecomment-217435222)
  if (process.defaultApp === false) return 0
  // Default: node app.js argv1 argv2 ... argvn
  return 1
}

function getProcessArgvWithoutBin () {
  return process.argv.slice(getProcessArgvBinIndex() + 1)
}

function getProcessArgvBin () {
  return process.argv[getProcessArgvBinIndex()]
}

module.exports = {
  getProcessArgvBin,
  getProcessArgvWithoutBin
}
