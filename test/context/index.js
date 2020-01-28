import { join } from 'path'
import { debuglog } from 'util'

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
   * @param {string} file
   * @example
   * fixture`input.txt` // -> test/fixture/input.txt
   */
  fixture(file) {
    const f = file.raw[0]
    return join('test/fixture', f)
  }
  async _destroy() {
    LOG('destroy context')
  }
  static get BIN() {
    return BIN
  }
}

let BIN = 'src/BIN'
if (process.env.ALAMODE_ENV == 'test-build') {
  console.log('Testing build bin...')
  BIN = 'build/bin/mnp'
} else if (process.env.ALAMODE_ENV == 'test-compile') {
  console.log('Testing compile bin...')
  BIN = 'compile/bin/mnp'
}

/** @typedef {Object<string, Test & TestSuite4>} TestSuite */
/** @typedef {Object<string, Test & TestSuite3>} TestSuite4 */
/** @typedef {Object<string, Test & TestSuite2>} TestSuite3 */
/** @typedef {Object<string, Test & TestSuite1>} TestSuite2 */
/** @typedef {Object<string, Test & TestSuite0>} TestSuite1 */
/** @typedef {Object<string, Test>} TestSuite0 */
/** @typedef {(c: Context)} Test */
