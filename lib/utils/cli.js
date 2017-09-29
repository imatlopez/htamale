/*!
 * htamale: lib/utils/cli.js
 */

'use strict';

const cli = require('commander'),
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

module.exports = {
  src: cli.args,
  replace : cli.replace,
  outfile: cli.outfile,
  quiet: cli.quiet || !process.stdout.isTTY
};