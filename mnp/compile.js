/** @type {import('mnp').Question} */
const compile = {
  text: 'Build or compile',
  getDefault() { return 'compile' },
  async afterQuestions({ rm, removeFile, packageJson, updatePackageJson, updateFiles, json, saveJson, renameFile, warn }, answer, { binary }) {
    const Compile = answer == 'compile'
    const build = answer != 'compile'
    if (!['compile', 'build'].includes(answer)) {
      warn('Only valid options are "compile" and "build". You answered: "%s"', answer)
      warn('Choosing "build".')
    }
    const { scripts } = packageJson
    delete scripts.d2 // manually run on the build
    // this should be reconsiled with @methodType regex in Typal on source
    const alamoderc = json('.alamoderc.json')
    if (Compile) {
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
        return !['build', 'stdlib', 'types/index.js'].includes(a)
      })
      await updateFiles({
        re: /if \(process\.env\.ALAMODE_ENV == 'test-build'\) {[\s\S]+?} else /,
        replacement() {
          return ''
        },
      }, 'test/context/index.js')
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
        re: / else if \(process\.env\.ALAMODE_ENV == 'test-compile'\) {[\s\S]+?}/,
        replacement() {
          return ''
        },
      }, 'test/context/index.js')
    }
    packageJson.scripts = scripts
    updatePackageJson(packageJson)
    saveJson('.alamoderc.json', alamoderc)
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
  if (bin) {
    Object.assign(dependencies, { argufy, indicatrix, usually })
    packageJson.bin.mnp = 'build/bin/mnp.js'
  }

  if (!bin) alamoderc.env.build.import.alamodeModules = ['erte']
  if (!bin) alamoderc.env.build.import.stdlib.packages = ['erte']
  delete alamoderc.env['test-compile']
  delete alamoderc.import
  delete scripts.template
  scripts.d = 'yarn-s d1 externs'
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

export default compile