/*!
 * htamale: lib/index.js
 */
'use strict';

const cheerio = require('cheerio'),
  merge = require('./utils/merge');


/**
 * Traverses object
 * 
 * @param {Object} config 
 * @param {String} params 
 * @returns {Object}
 * @throws {Error}
 * @api private
 */
function reduce(config, params) {
  if (!params.target) {
    return config;
  }

  let _config = config;
  let cache = '';
  params.target.split('.').forEach((value) => {
    cache += `${!cache ? '' : '.'}${value}`;

    if (!_config.hasOwnProperty(value)) {
      throw new Error(`${cache} has no key ${value}`);
    }

    _config = _config[value];
  });

  if (!params.custom) {
    return _config;
  }

  return merge(_config, params.custom);
}


/**
 * Obtains DOM params
 * 
 * @param {CheerioElement} $ 
 * @returns {Object}
 * @api private
 */
function extractParams($) {
  const target = $.attr('ht-target');
  if (target === null) {
    return {
      append: false
    };
  }

  const append = $.attr('ht-append') !== null;

  let custom = $.attr('ht-custom');
  custom = custom !== null ? JSON.parse(custom) : undefined;

  return {
    target: target,
    append: append,
    custom: custom
  };
}

/**
 * Navegate the DOM
 * 
 * @param {CheerioElement} $
 * @param {Object} config
 * @api private
 */
function traverse($, config) {
  const params = extractParams($);
  const _config = reduce(config, params);


  if (_config.constructor === Array) {
    const $append = cheerio.load('');
    _config.forEach(function($, $append, value) {
      const $clone = $.clone();
      $clone.attr('ht-source','');

      traverse($clone, value);
    }.bind(undefined, $, $append));

    $.replaceWith($append);
    return;
  }

  $.children().each(function(_config, index, $elem) {
    traverse($elem, _config);
  }.bind(undefined, _config));
}

/**
 * Entry point
 * 
 * @param {String} data 
 * @param {Object} config
 * @returns {String}
 */
function index(data, config) {
  const $ = cheerio.load(data);

  traverse($, config);

  return $.html();
}

module.exports = index;