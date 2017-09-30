/*!
 * htamale: lib/utils/_html.js
 */
'use strict';

const cheerio = require('cheerio'),
  parser = require('./router');


/**
 * Parses html object to string
 * 
 * @param {Object} obj 
 * @param {Object|undefined} opts 
 * @returns {String}
 * @throws {Error}
 */
function parseHtml(obj, opts = {}) {
  const base = opts.html || `<${obj.tag}></${obj.tag}>`;
  const $ = cheerio.load(base);

  if ($.root().get(0).tagName !== opts.tag) {
    throw new Error(`HTML tag mismatch occurred, \
      expected ${opts.tag}, got ${$.root().get(0).tagName}.`);
  }

  if (obj.hasOwnProperty('attr')) {
    obj.attr.foreach((value, key) => {
      $.root().attr(key, value);
    });
  }

  if (obj.hasOwnProperty('class')) {
    obj.class.foreach((item) => {
      if (!$.root().hasClass(item)) {
        $.root().addClass(item);
      }
    });
  }
  
  if (obj.hasOwnProperty('html')) {
    $.root().html(parser(
      obj.html,
      { html: $.root().html() }
    ));
  }

  return $.root().html();
}


module.exports = parseHtml;