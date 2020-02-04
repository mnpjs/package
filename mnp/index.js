import preUpdate from './pre-update'
import compile from './compile'

export default {
  mnpQuestions: ['wiki', 'license', 'homepage', 'keywords'],
  questions: {
    binary: {
      confirm: true,
      text: 'With binary',
      async afterQuestions({ rm, removeFile, updateFiles, packageJson, updatePackageJson }, withBinary ) {
        if (withBinary) {
          await updateFiles({
            re: /\n?\/\* bin-(start|end) \*\//g,
            replacement() {
              return ''
            },
          }, { file: 'src/stdlib.js' })
          return
        }
        await updateFiles({
          re: /\n?\/\* bin-start \*\/[\s\S]+?\/\* bin-end \*\//g,
          replacement() {
            this.debug('Removing bin dependencies from stdlib.')
            return ''
          },
        }, { file: 'src/stdlib.js' })
        await Promise.all([
          rm('src/bin'),
          rm('build/bin'),
          rm('compile/bin'),
          rm('test/result/bin'),
          rm('documentary/2-CLI'),
        ])
        removeFile('test/mask/bin.js')
        removeFile('types/arguments.xml')
        await updateFiles({
          re: /## CLI[\s\S]+?##/,
          replacement: '##',
        }, { file: 'README.md' })
        const { devDependencies } = packageJson
        delete devDependencies.indicatrix
        delete devDependencies.usually
        delete devDependencies.argufy

        delete packageJson.scripts.dev
        delete packageJson.scripts.compile
        delete packageJson.scripts.args

        delete packageJson.bin
        packageJson.files = packageJson.files.filter((a) => {
          return !['src/bin/index.js'].includes(a)
        })
        updatePackageJson(packageJson)

        await updateFiles({
          re: /\nlet BIN[\s\S]+/,
          replacement: '',
        }, { file: 'test/context/index.js' })
        await updateFiles({
          re: /\s+static get BIN\(\) {[\s\S]+?}/,
          replacement: '',
        }, { file: 'test/context/index.js' })
      },
    },
    compile,
  },
  preUpdate,
  async afterInit({ name }, { renameFile, initManager }) {
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
}
