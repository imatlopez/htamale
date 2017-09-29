/*!
 * htamale: lib/utils/_html.js
 */
'use strict';


/**
 * Parses html object to string
 * 
 * @param {Object} obj 
 * @param {Object} opts 
 * @returns {String}
 */
function parseHtml(obj) {

  const attributes = (!obj.hasOwnProperty('attr') ?
    obj.attr.foreach((item, key) => {
      attributes.push(`${key}="${item}"`);
    }) : []).join(' ');

  const classes = (!obj.hasOwnProperty('class') ?
    obj.class.foreach((item) => {
      classes.push(item);
    }) : []).join(' ');

  const ids = (!obj.hasOwnProperty('id') ?
    obj.id.foreach((item) => {
      ids.push(item);
    }) : []).join(' ');

  const properties = [ ids, classes, attributes ].join(' ');
  
  if (!obj.hasOwnProperty('content')) {
    return `<${obj.tag} ${properties} />`;
  }

  return `<${obj.tag} ${properties}>${obj.content}</${obj.tag}>`;
}


module.exports = parseHtml;