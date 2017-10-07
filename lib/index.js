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
 * Creates a copy of the root with individual value
 * 
 * @param {Object} config 
 * @param {Object} value 
 * @returns {Object}
 * @api private
 */
function arrayReduce(config, value) {
  if (Array === config.constructor) {
    return undefined !== value ? { _value: value } : {};
  }

  const _config = JSON.parse(JSON.stringify(config));
  if(value) {
    _config._value = value;
  } else {
    delete _config._value;
  }
  return _config;
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
  const _value = _config.hasOwnProperty('_value') ?  _config._value : _config;

  // Handle multi unit information
  if (Array === _value.constructor) {
    _value.map(function(item) {
      if (params.append) {
        const _$e = $e.clone();
        _$e.attr('ht-target', '_ht_array');
        _$e.attr('ht-append', '_ht_array');

        navegate(_$e, { _ht_array: arrayReduce(_config, item) });
        wipeParams(_$e);
        return _$e;
      } else if (!item.hasOwnProperty('type') || 'html' !== item.type) {
        return parse(item);
      }

      const _$e = $(parse(item));
      navegate(_$e, arrayReduce(_config));
      wipeParams(_$e);
      return _$e;

    }).forEach(function (_$e) {
      return params.append ? $e.before(_$e) : $e.append(_$e); // .append should be .insert
    });

    return params.append ? $e.remove() : wipeParams($e);
  }

  // Traverse down the line
  $e.children().each(function(i, $ne) {
    navegate($($ne), _config);
  });

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