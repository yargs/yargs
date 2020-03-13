'use strict';
module.exports = function objFilter(original, filter) {
  const obj = {};
  filter = filter || (() => true);
  Object.keys(original || {}).forEach(key => {
    if (filter(key, original[key])) {
      obj[key] = original[key];
    }
  });
  return obj;
};
