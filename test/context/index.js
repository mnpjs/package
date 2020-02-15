import { join } from 'path'
import { debuglog } from 'util'
import { readFileSync } from 'fs'

const LOG = debuglog('my-new-package')

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    LOG('init context')
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  /**
   * A tagged template that returns the relative path to the fixture.
   * @example
   * fixture`input.txt` // -> test/fixture/input.txt
   */
  fixture(strings, ...args) {
    const f = strings.raw.reduce((acc, s, i) => {
      acc.push(s)
      const a = args[i]
      if (a) acc.push(a)
      return acc
    }, []).join('')
    return join('test/fixture', f)
  }
  /**
   * Read the file as a string.
   * @param {string} path
   */
  readFile(path) {
    return readFileSync(path, 'utf8')
  }
  async _destroy() {
    LOG('destroy context')
  }
  static get BIN() {
    return BIN
  }
}

/* bin-start */
let BIN = 'src/BIN'
if (process.env.ALAMODE_ENV == 'test-build') {
  console.log('Testing build bin...')
  BIN = 'build/bin/mnp'
} else if (process.env.ALAMODE_ENV == 'test-compile') {
  console.log('Testing compile bin...')
  BIN = 'compile/bin/mnp'
}
/* bin-end */

/** @typedef {Object<string, Test & TestSuite4>} TestSuite */
/** @typedef {Object<string, Test & TestSuite3>} TestSuite4 */
/** @typedef {Object<string, Test & TestSuite2>} TestSuite3 */
/** @typedef {Object<string, Test & TestSuite1>} TestSuite2 */
/** @typedef {Object<string, Test & TestSuite0>} TestSuite1 */
/** @typedef {Object<string, Test>} TestSuite0 */
/** @typedef {(c: Context)} Test */
