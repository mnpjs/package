export default {
  questions: {
    'wiki': {
      text: 'Init Github Wiki',
      confirm: true,
      async afterQuestions({ confirm, spawn }, answer, { name, org }) {
        if (answer) {
          const a = await confirm(`Please go to https://github.com/${org}/${name}/wiki/_new
to create the first page and press enter when done.`)
          if (!a) return
          const m = `git@github.com:${org}/${name}.wiki.git`
          await spawn('git', ['submodule', 'add', m, 'wiki'])
          return m
        }
      },
    },
    binary: {
      confirm: true,
      text: 'With binary',
      async afterQuestions({ rm, removeFile, removePackages, updateFiles, packageJson, updatePackageJson }, withBinary ) {
        if (withBinary) return
        await rm('src/bin')
        await rm('build/bin')
        removeFile('test/mask/bin.js')
        removeFile('test/result/bin')
        removeFile('types/arguments.xml')
        removeFile('documentary/2-CLI')
        await updateFiles({
          re: /## CLI[\s\S]+#/,
          replacement: '#',
        }, { file: 'README.md' })
        await removePackages(['indicatrix', 'usually', 'argufy'])
        delete packageJson.bin
        updatePackageJson(packageJson)
      },
    },
    compile: {
      text: 'Build or compile',
      getDefault() { return 'compile' },
      async afterQuestions({ rm, removeFile, packageJson, udpatePackageJson, updateFiles, json, saveJson }, answer) {
        const compile = answer == 'compile'
        const build = answer == 'build'
        const { scripts } = packageJson
        const alamoderc = json('.alamoderc.json')
        if (compile) {
          await rm('build/bin')
          delete scripts['test-build']
          await updateFiles({
            re: /\/\* typal types\/index.xml \*\/\n/,
            replacement: '',
          }, { file: 'src/index.js' })
          delete alamoderc.env['test-build']
          delete alamoderc.import // remove stdlib
          packageJson.files = packageJson.files.filter((a) => {
            return !['build', 'stdlib'].includes(a)
          })
        } else if (build) {
          removeCompile(alamoderc, scripts, packageJson)
          await rm('compile')
          removeFile('src/depack.js')
          await updateFiles({
            re: /\/\*\*\n \* @typedef[\s\S]+/,
            replacement: '',
          }, { file: 'src/index.js' })
        }
        packageJson.scripts = scripts
        udpatePackageJson(packageJson)
        saveJson('.alamoderc.json', alamoderc)
      },
    },
  },
  async preUpdate(sets, { github, updateFiles }) {
    const { org } = sets
    const { body } = await github._request(`/orgs/${org}`)
    if (body) {
      const { avatar_url } = body
      sets.avatar_url = avatar_url
      await updateFiles({
        re: 'https://avatars3.githubusercontent.com/u/38815725',
        replacement: avatar_url,
      }, { file: './documentary/index.jsx' })
    }
  },
  async afterInit({ name }, { renameFile, initManager }) {
    renameFile('compile/bin/mnp.js', `compile/bin/${name}.js`)
    renameFile('compile/mnp.js', `compile/${name}.js`)
    renameFile('compile/mnp.js.map', `compile/${name}.js.map`)
    renameFile('src/bin/mnp.js', `src/bin/${name}.js`)
    renameFile('build/bin/mnp.js', `build/bin/${name}.js`)
    await initManager()
  },
}

const removeCompile = async (alamoderc, scripts, packageJson) => {
  delete alamoderc.env['test-compile']
  delete alamoderc.import
  delete scripts.template
  scripts.d1 = 'typal src/index.js -c -t types/index.xml'
  delete scripts['test-compile']
  delete scripts['compile']
  delete scripts['lib']
  packageJson.main = 'build/index.js'
  packageJson.files = packageJson.files.filter((a) => {
    return a != 'compile'
  })
}