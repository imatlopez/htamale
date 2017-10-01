/*!
 * htamale: lib/utils/merge.js
 */
'use strict';

const fs = require('fs'),
  deepEqual = require('lodash').isEqual;
  
  
/**
 * Creates empty structure to fill
 * 
 * @param {Object} obj
 * @returns {Object|Object[]}
 * @api private
 */
function makeSeed(obj) {
  // create empty object to fill
  return Array === obj.constructor ? obj.map(function (item) {
    if ('object' === typeof item && null !== item) {
      if (Array === item.constructor) {
        return makeSeed(item);
      }
      return {};
    }

    return item;
  }) : {};
}

  
/**
 * Merges two objects without overwriting properties
 * 
 * @param {Object} t 
 * @param {Object} s
 * @api private
 */
function deeperMerge(t, s) {
  if ('object' !== typeof t || undefined === t ||
      'object' !== typeof s || undefined === s ||
      deepEqual(t, s)) {
    return;
  }

  Object.keys(s).forEach(function (key) {
    const val = s[key];
  
    if ('object' === typeof val) {
      if (!t.hasOwnProperty(key)) {
        t[key] = makeSeed(val);
      }
      
      deepMerge(t[key], val);
    } else if (!t.hasOwnProperty(key)) {
      t[key] = val;
    }
  });
}

/**
 * Utility to also parse arrays
 * 
 * @param {(Object|Object[])} t 
 * @param {(Object|Object[])} s
 * @throws {Error}
 * @api private
 */
function deepMerge(t, s) {
  if (deepEqual(t, s)) {
    return;
  }

  if (Array === s.constructor) {
    if (Array !== t.constructor) {
      throw new Error('Source cannot be an array if target is not when deep merging.');
    } else if (t.length !== s.length) {
      throw new Error('Source array and target array length must match to deep merge.');
    }

    // merge element by element
    t.forEach(function(value, index) {
      deepMerge(t[index], s[index]);
    });

    return;
  } else if (Array === t.constructor) {
    t.forEach(function(value, index) {
      deepMerge(t[index], s);
    });
    return;
  }

  deeperMerge(t, s);
}


/**
 * Merge json files without replacing properties
 * 
 * @param {Object[]} args 
 * @throws {Error}
 * @returns {Object}
 */
function merge(...args) {
  if (0 === args.length) {
    return;
  }

  return args.reduce(function (prev, curr) {
    if (typeof curr !== 'object') {
      if (typeof curr !== 'string') {
        throw new Error('Cannot merge non-object.');
      }
      curr = JSON.parse(fs.readFileSync(curr));
    }

    deepMerge(prev, curr);
    return prev;
  }, makeSeed(args[0]));
}

module.exports = merge;