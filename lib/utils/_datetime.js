/*!
 * htamale: lib/utils/_datetime.js
 */
'use strict';

const Moment = require('moment');


/**
 * Generates a datetime format
 * 
 * @param {Object} query
 * @param {(Boolean|undefined)} full
 * @return {String}
 * @api private
 */
function generateDatetimeFormat(query, full = true) {
  const fullMonth = full ? 'MMMM ' : 'MMM ';
  return `${ query.month ? fullMonth : '' }Y`;
}


/**
 * Route datetime format
 * 
 * @param {Object} obj 
 * @param {(String|undefined)} override 
 * @returns {String}
 */
function getDatetimeFormat(obj, override) {

  const format = override || obj.format || 'gen1';

  // try to guess 
  const guess = {
    gen1: (x) => generateDatetimeFormat(x),
    gen2: (x) => generateDatetimeFormat(x, false)
  }[format];

  // execute the guess
  if (typeof guess === 'function') {
    return guess(obj);
  } else if (typeof guess === 'string') {
    return guess;
  }

  // hope for the best
  return format;
}


/**
 * Parses date object to string
 * 
 * @param {Object} obj 
 * @param {Object|undefined} opts 
 * @return {String}
 */
function parseDatetime(obj, opts = {}) {
  const moment = (new Moment()).set(obj);
  const format = getDatetimeFormat(obj, opts.format);

  return moment.format(format);
}


module.exports = parseDatetime;