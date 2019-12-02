import { c } from 'erte'
/**
 * {{ description }}
 * @param {!_myNewPackage.Config} [config] Options for the program.
 */
export default async function myNewPackage(config = {}) {
  const {
    shouldRun = true,
    text,
  } = config
  if (!shouldRun) return
  console.log('my-new-package called with %s', c(text, 'yellow'))
  return text
}

/* typal types/index.xml */

/**
 * @typedef {import('..').Config} _myNewPackage.Config
 */
