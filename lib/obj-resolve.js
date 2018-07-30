'use strict'
/**
 * Retrieve nested item from object
 * @param {String} path dot separated
 * @param {Object} obj
 * @returns {*|undefined} Nested value or undefined if inacessible
 */
module.exports = function resolveNestedValue (path, obj) {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : undefined
  }, obj)
}
