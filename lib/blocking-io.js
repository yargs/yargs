module.exports = function () {
  if (typeof process.stdout._handle.setBlocking === 'function') {
    process.stdout._handle.setBlocking(true)
    process.stderr._handle.setBlocking(true)
  }
}
