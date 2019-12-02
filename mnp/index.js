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
      async afterQuestions({ rm, removeFile, updateFiles, packageJson, updatePackageJson }, withBinary ) {
        if (withBinary) return
        await rm('src/bin')
        await rm('build/bin')
        removeFile('test/mask/bin.js')
        await rm('test/result/bin')
        removeFile('types/arguments.xml')
        await rm('documentary/2-CLI')
        await updateFiles({
          re: /## CLI[\s\S]+?##/,
          replacement: '##',
        }, { file: 'README.md' })
        const { devDependencies } = packageJson
        delete devDependencies.indicatrix
        delete devDependencies.usually
        delete devDependencies.argufy

        delete packageJson.bin
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
      async afterQuestions({ rm, removeFile, packageJson, updatePackageJson, updateFiles, json, saveJson }, answer, { binary }) {
        const compile = answer == 'compile'
        const build = answer == 'build'
        const { scripts } = packageJson
        const alamoderc = json('.alamoderc.json')
        if (compile) {
          await rm('build')
          delete scripts['test-build']
          delete scripts['stdlib']
          delete scripts['b']
          delete alamoderc.env['test-build']
          delete alamoderc.env['build'] // remove stdlib
          packageJson.files = packageJson.files.filter((a) => {
            return !['build', 'stdlib', 'types/index.js'].includes(a)
          })
          await updateFiles({
            re: /if (process.env.ALAMODE_ENV == 'test-build') {[\s\S]+?} else /,
            replacement: '',
          }, { file: 'test/context/index.js' })
        } else if (build) {
          removeCompile(alamoderc, scripts, packageJson, binary)
          await rm('compile')
          removeFile('src/depack.js')
          removeFile('build/depack.js')
          await updateFiles({
            re: '@typedef {import(\'../types\').Config}',
            replacement: '@typedef {import(\'..\').Config}',
          }, { files: ['src/index.js', 'build/index.js'] })
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
  async preUpdate(sets, { github, updateFiles }) {
    const { org } = sets
    const { body } = await github._request({ endpoint: `/orgs/${org}` })
    if (body) {
      const { avatar_url } = body
      sets.avatar_url = avatar_url
      await updateFiles({
        re: 'https://avatars3.githubusercontent.com/u/38815725?v=4',
        replacement: avatar_url,
      }, { file: '.documentary/index.jsx' })
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

const removeCompile = async (alamoderc, scripts, packageJson, bin) => {
  const { devDependencies, dependencies = {} } = packageJson
  const {
    argufy, indicatrix, usually,
  } = devDependencies
  if (bin) Object.assign(dependencies, { argufy, indicatrix, usually })

  if (!bin) alamoderc.env.build.alamodeModules = []
  delete alamoderc.env['test-compile']
  delete alamoderc.import
  delete scripts.template
  scripts.d1 = 'typal types/index.js src -u -t types/index.xml'
  delete scripts['test-compile']
  delete scripts['compile']
  delete scripts['lib']
  packageJson.main = 'build/index.js'
  packageJson.files = packageJson.files.filter((a) => {
    return a != 'compile'
  })
  Object.assign(packageJson, {
    devDependencies, dependencies,
  })
}