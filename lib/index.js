/*!
 * htamale: lib/index.js
 */
'use strict';

const cheerio = require('cheerio'),
  parse = require('./utils/router');


/**
 * Traverses config object
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

  let cache = '';
  let _config = config;
  params.target.split('.').forEach((value) => {
    // store target progressed
    cache += `${!cache ? '' : '.'}${value}`;

    if (!_config.hasOwnProperty(value)) {
      throw new Error(`${cache} has no key ${value}`);
    }

    _config = _config[value];
  });

  return _config;
}


/**
 * Obtains DOM params
 * 
 * @param {CheerioElement} $e
 * @returns {Object}
 * @api private
 */
function extractParams($e) {
  const target = $e.attr('ht-target');
  if (!target) {
    return {
      append: false
    };
  }

  const append = undefined !== $e.attr('ht-append');

  return {
    target: target,
    append: append
  };
}


/**
 * Remove parameter trace
 * 
 * @param {CheerioElement} $e
 * @api private
 */
function wipeParams($e) {
  [
    'ht-target',
    'ht-append'
  ].forEach(function(param) {
    $e.removeAttr(param);
  });
}


/**
 * Navegate the DOM
 * 
 * @param {CheerioElement} $e
 * @param {Object} config
 * @api private
 */
function navegate($e, config) {
  const params = extractParams($e);
  const _config = reduce(config, params);

  // dead ends
  if ('object' !== typeof _config || null === _config || _config.hasOwnProperty('type')) {
    if (params.append) {
      parse(_config, { append: $e });
    } else {
      $e.html(parse(_config));
    }
    wipeParams($e);
    return;
  }

  // Handle multi unit information
  if (Array === _config.constructor) {
    if (!params.append) {
      _config.forEach(function(value) {
        $e.append(parse(value));
      });
      wipeParams($e);
      return;
    }

    _config.forEach(function(value) {
      const _$e = $e.clone();
      _$e.attr('ht-target', '_ht_array');
      _$e.attr('ht-append', '_ht_array');

      navegate(_$e, { _ht_array: value });
      $e.before(_$e);
    });

    $e.remove();
    return;
  }

  // Traverse down the line
  $e.children().each(function(i, $ne) {
    navegate($($ne), _config);
  });  
}

/**
 * Entry point
 * 
 * @param {String} data 
 * @param {Object} config
 * @returns {String}
 */
function index(data, config) {
  if (!data || !config) {
    return;
  }

  $ = cheerio.load(data);
  navegate($('html'), config);

  return $.html();
}

let $;
module.exports = index;