export default {
  confirm: true,
  text: 'With binary',
  async afterQuestions({ rm, removeFile, updateFiles, packageJson, updatePackageJson }, withBinary ) {
    if (withBinary) {
      await updateFiles({
        re: /(\r?\n)?\/\* bin-(start|end) \*\//g,
        replacement() {
          return ''
        },
      }, { files: ['src/stdlib.js', 'test/context/index.js'] })
      return
    }
    await updateFiles({
      re: /(\r?\n)?\/\* bin-start \*\/[\s\S]+?\/\* bin-end \*\//g,
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

    await updateFiles([{
      re: /(\r?\n)?\/\* bin-start \*\/[\s\S]+?\/\* bin-end \*\//g,
      replacement() {
        this.debug('Removing bin from context.')
        return ''
      },
    }, {
      re: /\s+static get BIN\(\) {[\s\S]+?}/,
      replacement: '',
    }], { file: 'test/context/index.js' })
  },
}