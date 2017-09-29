/*!
 * htamale: lib/utils/_datum.js
 */
'use strict';

const Moment = require('moment'),
  parser = require('./router');


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
 * @param {Object} opts 
 * @return {String}
 */
function parseDatetime(obj, opts) {
  const moment = (new Moment()).set(obj);
  const format = getDatetimeFormat(obj, opts.format);

  return moment.format(format);
}


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
 * @param {Object} opts
 * @returns {String}
 */
function parseInterval(obj, opts) {

  // Get defaults if not available
  const delim = opts.delim || obj.delim || ' - ';
  const format = opts.format || obj.format; // no default

  return [
    parser(obj.start, { format: format }),
    getIntervalDelim(obj, delim),
    parser(obj.end, { format: format }),
  ].join('');
}


module.exports = {
  datetime: parseDatetime,
  interval: parseInterval
};