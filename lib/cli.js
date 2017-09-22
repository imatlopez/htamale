/*!
 * htamale: lib/cli.js
 */

const cli = require('commander'),
  path = require('path'),
  fs = require('fs'),
  Notifier = require('./notifier'),
  npm = require('../package.json');

const send = new Notifier(getOpts);

cli.version(npm.version)
  .usage('[options] <file ...>')
  .option('-r, --replace', 'Write output in-place, replacing input')
  .option('-o, --output [file]', 'Write output to file (default stdout)')
  .option('-c, --config [file]', 'Path to config file')
  .option('-q, --quiet', 'Suppress logging to stdout');

/**
 * Get object of cli options
 * 
 * @returns {Object}
 * @api private
 */
function getOpts() {
  return {
    src: cli.args,
    output: cli.output,
    config: cli.config,
    quiet: cli.quiet
  };
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

    cfg = JSON.parse(fs.readFileSync(cfg));
    for (let prop in cfg) {
      if (!this.hasOwnProperty(prop)) {
        this[prop] = cfg[prop];
      }
    }
  }, union);
  return union;
}

const interpret = exports.interpret = function () {
  cli.parse(process.argv);

  const configCustom = verifyExists(cli.config);
  const configRecursive = findRecursive(process.cwd(), '.htamalerc');

  let cfg;
  try {
    cfg = merge(configCustom, configRecursive);
  } catch (err) {
    send.error(err);
  }

  cli.args.forEach(processInputSync, {
    cfg: cfg,
    opts: getOpts
  });

};

// interpret args immediately when called as executable
if (require.main === module) {
  interpret();
}

/**
 * Preps call for file
 * 
 * @param {String} filepath 
 * @api private
 */
function processInputSync(filepath) {
  let data = '',
    config = this.cfg,
    output = config.output;

  if (config.replace) {
    output = filepath;
  }

  send.log(output);

  if (filepath === '-') {
    const input = process.stdin;
    input.resume();
    input.setEncoding('utf8');

    input.on('data', function (chunk) {
      data += chunk;
    });

    input.on('end', function () {
      send.log(data);
      // makePretty(data, config, output, writePretty);
    });
  } else {
    data = fs.readFileSync(filepath, 'utf8');
    send.log(data);
    //makePretty(data, config, output, writePretty);
  }
}