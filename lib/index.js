/*!
 * htamale: lib/index.js
 */
'use strict';

const cheerio = require('cheerio');

/**
 * 
 * @param {String} data 
 * @param {Object} config
 * @returns {String}
 */
function index(data, config) {
  const $ = cheerio.load(data);
  $('body').html(data);
  return $.html();
}

module.exports = index;