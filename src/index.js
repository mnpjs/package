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
  console.log('my-new-package called with %s', text)
  return text
}

/**
 * @typedef {import('..').Config} _myNewPackage.Config
 */
