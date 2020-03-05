/**
 * @type {import('mnp').Question}
 */
const binary = {
  confirm: true,
  text: 'With binary',
  async afterQuestions({ rm, removeFile, updateFiles, packageJson, updatePackageJson, keepBlocks, removeBlocks }, withBinary) {
    if (withBinary) {
      await keepBlocks('bin', [
        'src/stdlib.js', 'test/context/index.js',
      ])
      return
    }
    await removeBlocks('bin', 'src/stdlib.js')
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
    }, 'README.md')
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

    await removeBlocks('bin', 'test/context/index.js')
    await updateFiles({
      re: /\s+static get BIN\(\) {[\s\S]+?}/,
      replacement: '',
    }, 'test/context/index.js')
  },
}
export default binary