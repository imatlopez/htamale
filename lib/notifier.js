/*!
 * htamale: lib/logger.js
 */
'use strict';

const Emitter = require('events').EventEmitter,
  chalk = require('chalk');

/**
 * Create custom emitter
 * 
 * @param {Boolean} quiet 
 * @returns {Object}
 */
function send(quiet) {
  let emitter = new Emitter();

  emitter.on('error', err => {
    console.error(chalk.red(err));
    process.exit(1);
  });

  emitter.on('warn', data => {
    if (!quiet) {
      console.warn(chalk.yellow(data));
    }
  });
  
  emitter.on('info', data => {
    if (!quiet) {
      console.info(chalk.green(data));
    }
  });
  
  emitter.on('log', data => console.log(data));

  this.error = emitter.emit.bind(emitter, 'error');
  this.warn =  emitter.emit.bind(emitter, 'warn');
  this.info =  emitter.emit.bind(emitter, 'info');
  this.log = emitter.emit.bind(emitter, 'log');
}

module.exports = send;