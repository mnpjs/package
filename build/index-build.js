const { c } = require('../stdlib');

/**
 * {{ description }}
 * @param {!_myNewPackage.Config} [config] Options for the program.
 * @param {boolean} [config.shouldRun=true] A boolean option. Default `true`.
 * @param {string} [config.text] A text to return.
 */
async function myNewPackage(config = {}) {
  const {
    shouldRun = true,
    text = '',
  } = config
  if (!shouldRun) return ''
  console.log('my-new-package called with %s', c(text, 'yellow'))
  return text
}

/* typal types/index.xml namespace */
/**
 * @typedef {_myNewPackage.Config} Config `＠record` Options for the program.
 * @typedef {Object} _myNewPackage.Config `＠record` Options for the program.
 * @prop {boolean} [shouldRun=true] A boolean option. Default `true`.
 * @prop {string} [text] A text to return.
 */


module.exports = myNewPackage