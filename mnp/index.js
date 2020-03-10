import preUpdate from './pre-update'
import compile from './compile'
import binary from './binary'

export default {
  mnpQuestions: ['wiki', 'license', 'homepage', 'keywords'],
  questions: {
    binary,
    compile,
  },
  preUpdate,
  /**
   * @param {Object} settings
   * @param {import('mnp').API} api
   */
  async afterInit({ name }, api) {
    const { renameFile, initManager } = api
    renameFile('compile/bin/mnp.js', `compile/bin/${name}.js`)
    renameFile('compile/mnp.js', `compile/${name}.js`)
    renameFile('compile/mnp.js.map', `compile/${name}.js.map`)
    renameFile('src/bin/mnp.js', `src/bin/${name}.js`)
    renameFile('build/bin/mnp.js', `build/bin/${name}.js`)
    await initManager()
  },
  async afterCommit(_, { git }) {
    const i = 'initialise package'
    await git('tag', '-a', 'v0.0.0-pre', '-m', process.platform == 'win32' ? `"${i}"` : i)
  },
  api: '1.2.0',
}
