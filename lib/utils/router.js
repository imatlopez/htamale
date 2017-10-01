/*!
 * htamale: lib/utils/router.js
 */
'use strict';

const datetime = require('./_datetime'),
  interval = require('./_interval'),
  html = require('./_html');


/**
 * Avoids circular dependencies while still allowing
 * recursive parsing
 * 
 * @param {String} type 
 * @param {Object} obj 
 * @param {Object} opts 
 * @returns {String}
 * @api private
 */
function handler(obj, opts = {}) {
  const dest = {
    html: {
      fun: html,
      prop: ['html']
    },
    datetime: {
      fun: datetime,
      prop: []
    },
    interval: {
      fun: interval,
      prop: ['start', 'delim', 'end']
    }
  };

  dest[obj.type].prop.forEach(function (prop) {
    if (obj.hasOwnProperty(prop) && typeof obj[prop] !== 'string') {
      obj[prop] = route(obj[prop]);
    }
    if (opts.hasOwnProperty(prop) && typeof opts[prop] !== 'string') {
      opts[prop] = route(opts[prop]);
    }
  });
  
  return dest[obj.type].fun(obj, opts);
}


/**
 * Route object to correct parser
 * 
 * @param {*} obj 
 * @param {Object} opts 
 * @returns {String|null} 
 * @throws {Error}
 */
function route(obj, opts) {
  if (!obj) {
    return;
  }

  if (typeof obj === 'function') {
    throw new Error('Cannot parse functions.');
  }
  
  if ( typeof obj !== 'object' ) {
    return String(obj);
  } else if ( obj.constructor === Array ) {
    return obj.map(function(item) {
      return route(item, opts);
    }).join('\n');
  } else if ( !obj.hasOwnProperty('type') ) {
    return null;
  }

  return handler(obj, opts);
}


module.exports = route;