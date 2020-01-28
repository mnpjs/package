const { c } = require('../stdlib');

/**
 * @type {_myNewPackage.myNewPackage}
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

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').myNewPackage} _myNewPackage.myNewPackage
 */


module.exports = myNewPackage