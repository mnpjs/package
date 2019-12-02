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
      async afterQuestions({ removeFiles, removePackages, updateFiles }, withBinary ) {
        if (withBinary) return
        removeFiles('src/bin')
        removeFiles('build/bin')
        removeFiles('test/mask/bin.js')
        removeFiles('test/result/bin')
        removeFiles('types/arguments.xml')
        removeFiles('documentary/2-CLI')
        await updateFiles({
          re: /## CLI[\s\S]+#/,
          replacement: '#',
        }, { file: 'README.md' })
        await removePackages(['erte', 'indicatrix', 'usually', 'argufy'])
      },
    },
    // compile: {
    //   text: 'Build or compile',
    //   getDefault() { return 'compile' },
    //   async afterQuestions({}, answer) {
    //     const compile = answer == 'compile'
    //     const build = answer == 'build'
    //     if (compile) {

    //     }
    //   },
    // },
  },
  async afterInit({ renameFile, name, initManager }) {
    renameFile('src/bin/mnp.js', `src/bin/${name}.js`)
    renameFile('compile/bin/mnp.js', `compile/bin/${name}.js`)
    renameFile('compile/mnp.js', `compile/${name}.js`)
    renameFile('compile/mnp.js.map', `compile/${name}.js.map`)
    await initManager()
  },
}