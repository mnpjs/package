import { equal } from '@zoroaster/assert'
import Context from '../context'
import myNewPackage from '../../src'

/** @type {TestSuite} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof myNewPackage, 'function')
  },
  async 'calls package without error'() {
    await myNewPackage()
  },
  async 'gets a link to the fixture'({ fixture, readFile }) {
    const path = fixture`test.txt`
    const text = readFile(path)
    const res = await myNewPackage({
      text,
    })
    equal(res, text)
  },
}

/**
 * @typedef {import('../context').TestSuite} TestSuite
 */

export default T