/*!
 * htamale: lib/logger.js
 */

const Emitter = require('events').EventEmitter;

module.exports = function(opts) {
  let emitter = new Emitter();
  
  emitter.on('error', err => {
    console.error(err);
    process.exit(1);
  });
  
  emitter.on('warn', data => {
    if (opts().quiet) {
      console.warn(data);
    }
  });
  
  emitter.on('info', data => console.info(data));
  
  emitter.on('log', data => console.info(data));

  this.error = emitter.emit.bind(emitter, 'error');
  this.warn =  emitter.emit.bind(emitter, 'warn');
  this.info =  emitter.emit.bind(emitter, 'info');
  this.log = emitter.emit.bind(emitter, 'log');
};