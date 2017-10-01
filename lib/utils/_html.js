/*!
 * htamale: lib/utils/_html.js
 */
'use strict';

const cheerio = require('cheerio');


/**
 * Add attributes to DOM element
 * 
 * @param {CheerioElement} $ 
 * @param {Object|undefined} attr 
 * @api private
 * @throws {Error}
 */
function addAttributes($, attr) {
  if (!attr) {
    return;
  }

  if (typeof attr !== 'object') {
    throw new Error('"attr" must be of type Object');
  } else if (attr.constructor === Array) {
    throw new Error('"attr" cannot be an array.');
  }

  for (let key in attr) {
    $.attr(key, attr[key]);
  }
}


/**
 * Add classes to DOM element
 * 
 * @param {CheerioElement} $ 
 * @param {String[]} arr 
 * @throws {Error}
 */
function addClasses($, arr) {
  if (!arr) {
    return;
  }

  if (typeof arr !== 'object' ||
      arr.constructor !== Array) {
    throw new Error('"class" must be of type Array');
  }

  arr.forEach(function (item) {
    if (!$.hasClass(item)) {
      $.addClass(item);
    }
  });
}


/**
 * Add html to DOM element
 * 
 * @param {CheerioElement} $ 
 * @param {String} html 
 */
function addHtml($, html) {
  if (!html) {
    return;
  }

  $.html(html);
}


/**
 * Parses html object to string
 * 
 * @param {Object} obj 
 * @param {Object|undefined} opts 
 * @returns {String}
 * @throws {Error}
 */
function parseHtml(obj, opts = {}) {
  const $ = opts.html || cheerio.load(`<${obj.tag}></${obj.tag}>`)(obj.tag);

  if ($[0].tagName !== obj.tag) {
    throw new Error([
      'HTML tag mismatch occurred.',
      `Expected ${obj.tag}, got ${$[0].tagName}.`
    ].join('\n'));
  }

  addClasses($, obj.class);
  addAttributes($, obj.attr);
  addHtml($, obj.html);
  
  return cheerio.load('').html($);
}


module.exports = parseHtml;