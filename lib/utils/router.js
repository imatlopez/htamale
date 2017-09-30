/*!
 * htamale: lib/utils/router.js
 */
'use strict';

const route_handler = {
  datetime: require('./_datetime'),
  interval: require('./_interval'),
  html: require('./_html')
};

/**
 * Route object to correct parser
 * 
 * @param {*} obj 
 * @param {Object} opts 
 * @returns {String|null} 
 * @throws {Error}
 */
function route(obj, opts) {
  if (typeof obj === 'function') {
    throw new Error('Cannot parse functions.');
  }
  
  if ( typeof obj !== 'object' ) {
    return String(obj);
  } else if ( !obj.hasOwnProperty('type') ) {
    return null;
  }

  return route_handler[obj.type](obj, opts);
}

module.exports = route; // TODO