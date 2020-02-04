import { EOL } from 'os'
import makeTestSuite from '@zoroaster/mask'
import Context from '../context'

export default makeTestSuite('test/result/bin', {
  fork: {
    module: Context.BIN,
    preprocess(string) {
      if (process.platform != 'win32') return string
      // node will console.log only with \n
      // whereas mask output is with \r\n
      return string.replace(/([^\r])\n/g, `$1${EOL}`)
    },
  },
})