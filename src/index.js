import { c } from 'erte'

/**
 * @type {_myNewPackage.myNewPackage}
 */
export default async function myNewPackage(config = {}) {
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
