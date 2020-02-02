import preUpdate from './pre-update'

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
    compile: {
      text: 'Build or compile',
      getDefault() { return 'compile' },
      async afterQuestions({ rm, removeFile, packageJson, updatePackageJson, updateFiles, json, saveJson, renameFile }, answer, { binary }) {
        const compile = answer == 'compile'
        const build = answer == 'build'
        const { scripts } = packageJson
        delete scripts.d2 // manually run on the build
        // this should be reconsiled with @methodType regex in Typal on source
        const alamoderc = json('.alamoderc.json')
        if (compile) {
          await rm('build')
          await rm('stdlib')
          removeFile('src/index-build.js')
          removeFile('src/stdlib.js')
          delete scripts['test-build']
          delete scripts['stdlib']
          delete scripts['b']
          delete alamoderc.env['test-build']
          delete alamoderc.env['build'] // remove stdlib
          packageJson.files = packageJson.files.filter((a) => {
            return !['build', 'stdlib'].includes(a)
          })
          await updateFiles({
            re: /if (process.env.ALAMODE_ENV == 'test-build') {[\s\S]+?} else /,
            replacement: '',
          }, { file: 'test/context/index.js' })
          // import types from compile/index.js
          // await updateFiles({
          //   re: /import\('\.\.\/types'\)/g,
          //   replacement: 'import(\'..\')',
          // }, { file: 'src/index.js' })
        } else if (build) {
          await rm('src/index.js')
          await rm('build/index.js')
          renameFile('src/index-build.js', 'src/index.js')
          renameFile('build/index-build.js', 'build/index.js')
          removeCompile(alamoderc, scripts, packageJson, binary)
          await rm('compile')
          removeFile('src/depack.js')
          removeFile('build/depack.js')
          await updateFiles({
            re: / else if (process.env.ALAMODE_ENV == 'test-compile') {[\s\S]+?}/,
            replacement: '',
          }, { file: 'test/context/index.js' })
        }
        packageJson.scripts = scripts
        updatePackageJson(packageJson)
        saveJson('.alamoderc.json', alamoderc)
      },
    },
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
    await git('tag', '-a', 'v0.0.0-pre', '-m', 'initialise package')
  },
}

/**
 * 1. Since building, move dev-deps to deps.
 */
const removeCompile = async (alamoderc, scripts, packageJson, bin) => {
  const { devDependencies, dependencies = {} } = packageJson
  const {
    argufy, indicatrix, usually, ...restDevDependencies
  } = devDependencies
  if (bin) Object.assign(dependencies, { argufy, indicatrix, usually })

  if (!bin) alamoderc.env.build.import.alamodeModules = ['erte']
  if (!bin) alamoderc.env.build.import.stdlib.packages = ['erte']
  delete alamoderc.env['test-compile']
  delete alamoderc.import
  delete scripts.template
  scripts.d1 = 'typal src -u -t types/index.xml'
  delete scripts['test-compile']
  delete scripts['compile']
  delete scripts['lib']
  packageJson.main = 'build/index.js'
  packageJson.files = packageJson.files.filter((a) => {
    return a != 'compile'
  })
  Object.assign(packageJson, {
    devDependencies: restDevDependencies,
  })
  if (Object.keys(dependencies).length) Object.assign(packageJson, { dependencies })
}