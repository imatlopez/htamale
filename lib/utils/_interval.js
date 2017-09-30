/*!
 * htamale: lib/utils/_interval.js
 */
'use strict';

const parser = require('./router');


/**
 * Get the delimeter or not
 * 
 * @param {Object} obj
 * @param {(String|Object)} delim 
 * @returns {String}
 * @api private
 */
function getIntervalDelim(obj, delim) {
  if (!obj.hasOwnProperty('start') || !obj.hasOwnProperty('end')) {
    return '';
  }

  return parser(delim);
}


/**
 * Parses date interval object to string
 * 
 * @param {Object} obj 
 * @param {Object|undefined} opts
 * @returns {String}
 */
function parseInterval(obj, opts = {}) {

  // Get defaults if not available
  const delim = opts.delim || obj.delim || ' - ';
  const format = opts.format || obj.format; // no default

  return [
    parser(obj.start, {
      format: format
    }),
    getIntervalDelim(obj, delim),
    parser(obj.end, {
      format: format
    })
  ].join('');
}


module.exports = parseInterval;