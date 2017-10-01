/*!
 * htamale: lib/utils/_interval.js
 */
'use strict';

/**
 * Get the delimeter or not
 * 
 * @param {Object} obj
 * @param {String} delim 
 * @returns {String}
 * @api private
 */
function getIntervalDelim(obj, delim) {
  if (!obj.hasOwnProperty('start') || !obj.hasOwnProperty('end')) {
    return;
  }

  return delim;
}


/**
 * Parses date interval object to string
 * 
 * @param {Object} obj 
 * @param {Object|undefined} opts
 * @returns {String}
 */
function parseInterval(obj, opts = {}) {

  const delim = opts.delim || obj.delim || ' - ';

  return [
    obj.start,
    getIntervalDelim(obj, delim),
    obj.end,
  ].join('');
}


module.exports = parseInterval;