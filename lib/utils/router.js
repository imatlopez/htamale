/*!
 * htamale: lib/utils/router.js
 */
'use strict';

const route_handler = {
  datetime: require('./_datum').datetime,
  interval: require('./_datum').interval,
  html: require('./_html')
};

/**
 * Route object to correct parser
 * 
 * @param {*} obj 
 * @param {Object} opts 
 * @returns {String} 
 * @throws {Error}
 */
function route(obj, opts) {
  if (typeof obj === 'function') {
    throw new Error('Cannot parse functions.');
  }
  
  if ( typeof obj !== 'object' || !obj.hasOwnProperty('type') ) {
    return String(obj);
  }

  return route_handler[obj.type](obj, opts);
}

module.exports = route; // TODO