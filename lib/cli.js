/*!
 * htamale: lib/cli.js
 */

'use strict';

const cli = require('commander'),
  mkdirp = require('mkdirp'),
  path = require('path'),
  fs = require('fs'),
  Notifier = require('./notifier'),
  api = require('./index'),
  npm = require('../package.json');

cli.version(npm.version)
  .usage('[options] <file ...>')
  .option('-r, --replace', 'Write output in-place, replacing input')
  .option('-o, --outfile [file,...]', 'Write output to files in order', listToArray)
  .option('-c, --config [file]', 'Path to config file')
  .option('-q, --quiet', 'Suppress logging to stdout')
  .parse(process.argv);

/**
 * Parses lists in cli
 * 
 * @param {String} list 
 * @returns {String[]}
 * @api private
 */
function listToArray(list) {
  if (typeof list !== 'string') {
    return [];
  }
  return list.split(',');
}

/**
 * Path exists
 * 
 * @param {String} fullPath 
 * @returns {(String|null)}
 * @api private
 */
function verifyExists(fullPath) {
  return fs.existsSync(fullPath) ? fullPath : null;
}

/**
 * Find file recursively
 * 
 * @param {String} dir 
 * @param {String} fileName 
 * @returns {(String|null)}
 * @api private
 */
function findRecursive(dir, fileName) {
  let fullPath = path.join(dir, fileName);
  let nextDir = path.dirname(dir);
  let result = verifyExists(fullPath);

  if (!result && (nextDir !== dir)) {
    result = findRecursive(nextDir, fileName);
  }

  return result;
}

/**
 * Merge json files without replacing properties
 * 
 * @param {Strings} args 
 * @returns {Object}
 * @api private
 */
function merge(...args) {
  let union = {};
  args.forEach(function (cfg) {
    if (!cfg) {
      return;
    }

    if (typeof cfg !== 'object' ) {
      cfg = JSON.parse(fs.readFileSync(cfg));
    }
    for (let prop in cfg) {
      if (!this.hasOwnProperty(prop)) {
        this[prop] = cfg[prop];
      }
    }
  }, union);
  return union;
}

/**
 * Preps call for file
 * 
 * @param {String} filepath 
 * @api private
 */
function prepareForHandoff(filepath, index) {
  let data = '',
    config = this.cfg,
    outfile = cli.outfile[index];

  if (config.replace && process.stdout.isTTY) {
    outfile = filepath;
  }

  const writeFromAPI = handoffToAPI.bind(null, config, write.bind(null, outfile));

  if (filepath === '-') {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', str => data+=str)
      .on('end', writeFromAPI.bind(null, data));
  } else {
    try {
      data = fs.readFileSync(filepath, 'utf8');
    } catch(err) {
      if (err.code === 'EACCES') {
        send.warn(`${err.path} is not readable. Skipping!`);
      } else {
        send.error(err);
      }
    }

    writeFromAPI(data);
  }
}

/**
 * Handoff call for file
 * 
 * @param {Object} config 
 * @param {Function} next 
 * @param {String} data 
 * @api private
 */
function handoffToAPI(config, next, data) {
  try {
    let result = api(data, config) || '';

    next(result);
  } catch(err) {
    send.error(err);
  }
}

/**
 * Output to prefered method
 * 
 * @param {String} output 
 * @param {String} result 
 * @api private
 */
function write(outfile, result) {
  send.info(`writing ${outfile || 'stdout'}`);

  if (!outfile || outfile === '-') {
    process.stdout.write(result);
    return;
  }

  mkdirp.sync(path.dirname(outfile));

  if (!isFileDifferent(outfile, result)) {
    send.info(`parsed ${path.relative(process.cwd(), outfile)} - unchanged`);
    return;
  }

  try {
    fs.writeFileSync(outfile, result, 'utf8');
    send.info(`parsed ${path.relative(process.cwd(), outfile)}`);
  } catch (err) {
    if (err.code === 'EACCES') {
      send.warn(`${err.path} is not writable. Skipping!`);
    } else {
      send.error(err);
    }
  }
}

/**
 * Avoid overwriting file
 * 
 * @param {String} filePath 
 * @param {String} expected 
 * @returns {Boolean}
 * @api private
 */
function isFileDifferent(filePath, expected) {
  try {
    return fs.readFileSync(filePath, 'utf8') !== expected;
  } catch (ex) {
    // failing to read is the same as different
    return true;
  }
}

// main section
const send = new Notifier(cli.quiet || 
  (!process.stdout.isTTY && cli.outfile.length === 1));

const interpret = exports.interpret = function () {  
  const configCustom = verifyExists(cli.config);
  const configRecursive = findRecursive(process.cwd(), '.htamalerc');

  let cfg;
  try {
    cfg = merge(configCustom, configRecursive);
  } catch (err) {
    send.error(err);
  }

  cli.args.forEach(prepareForHandoff, {
    cfg: cfg
  });

};

// interpret args immediately when called as executable
if (require.main === module) {
  interpret();
}

if (process.stdout.isTTY) {
  process.stdout.on('error', (err) => {
    if (err.code === 'EPIPE') {
      send.error('Error writing to pipe, stream was closed prematurely.');
    }
  });
}