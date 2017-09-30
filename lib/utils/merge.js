/*!
 * htamale: lib/utils/merge.js
 */
'use strict';

const fs = require('fs');


/**
 * Merges two objects without overwriting properties
 * 
 * @param {Object} t 
 * @param {Object} s 
 * @throws {Error}
 * @api private
 */
function deeperMerge(t, s) {
  if (t === s) {
    return;
  }

  Object.keys(s).forEach(function(key) {
    const val = s[key];

    if (val !== null && typeof val === 'object') {
      if (!t.hasOwnProperty(key)) {
        t[key] = {};
      }

      deeperMerge(t[key], val);
    } else if (!t.hasOwnProperty(key)) {
      t[key] = val;
    }
  });
}

/**
 * 
 * @param {(Object|Object[])} t 
 * @param {(Object|Object[])} s
 */
function deepMerge(t, s) {
  if (t === s) {
    return;
  }

  if (t.constructor === Array) {
    if (s.constructor === Array) {
      if (t.length !== s.length) {
        throw new Error('Source and target length must match to deep merge.');
      }
      return t.map(function(source, value, index, array) {
        deeperMerge(array[index], source[index]);
      }.bind(undefined, s));
    }
    return t.map(function(source, value, index, array) {
      deeperMerge(array[index], source);
    }.bind(undefined, s));
  } else if (s.constructor === Array) {
    throw new Error('Source cannot be an array if target is not when deep merging.');
  }

  deeperMerge(t, s);
}


/**
 * Merge json files without replacing properties
 * 
 * @param {(String|Object)[]} args 
 * @returns {Object}
 */
function merge(...args) {
  let seed = {};
  if (args[0].constructor === Array) {
    seed = args[0].map(() => ({}));
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
  }, seed);
}

module.exports = merge;

/*

TODO:

test empty objects
test one empty one not
test both not empty
test depth
test copy vs ref

*/