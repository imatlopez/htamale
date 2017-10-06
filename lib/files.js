/*!
 * htamale: lib/files.js
 */

'use strict';

const mkdirp = require('mkdirp'),
  path = require('path'),
  fs = require('fs'),
  api = require('./index'),
  Notifier = require('./utils/notifier'),
  merge = require('./utils/merge'),
  cli = require('./utils/cli');

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
 * Preps call for file
 * 
 * @param {String} filepath 
 * @api private
 */
function prepareForHandoff(filepath, index) {
  let data = '',
    config = this.cfg,
    outfile = cli.outfile ? cli.outfile[index] : undefined;

  if (config.replace && process.stdout.isTTY) {
    outfile = filepath;
  }

  const writeFromAPI = handoffToAPI.bind(null, config, write.bind(null, outfile));

  if (filepath === '-') {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', str => data+=str)
      .on('end', () => writeFromAPI(data));
  } else {
    try {
      data = fs.readFileSync(filepath, 'utf8');
      writeFromAPI(data);
    } catch(err) {
      if (err.code === 'EACCES') {
        send.warn(`${err.path} is not readable. Skipping!`);
      } else {
        send.error(err);
      }
    }
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
    let result = api(data, config, send);

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
  send.info(`writing ${outfile || '...'}`);

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

/**
 * Main entry point
 */
function interpret() {
  if (cli.src.length === 0) {
    cli.help();
    return;
  } else if (cli.outfile && cli.outfile.length !== cli.src.length) {
    send.error('Number of inputs and outputs does not match.');
  }

  const configCustom = verifyExists(cli.config);
  const configRecursive = findRecursive(process.cwd(), '.htamalerc');

  let cfg;
  try {
    cfg = merge(configCustom, configRecursive);
  } catch (err) {
    send.error(err);
  }

  cli.src.forEach(prepareForHandoff, {
    cfg: cfg
  });
}

// main section
const send = new Notifier(cli.quiet || 
  (!process.stdout.isTTY && cli.outfile.length === 1));

// interpret cli immediately when called as executable
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

module.exports.interpret = interpret;