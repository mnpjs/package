import { existsSync, readFileSync } from 'fs'

export default async function preUpdate(
  // settings
  { repo: { owner: { avatar_url } }, manager, license_spdx, compile, binary },
  // api
  { updateFiles, packageJson, updatePackageJson, resolve }) {
  await updateFiles({
    re: /https:\/\/avatars3\.githubusercontent\.com\/u\/38815725\?v=4/,
    replacement() {
      return avatar_url
    },
  }, { file: '.documentary/index.jsx' })
  if (manager == 'npm') {
    delete packageJson.devDependencies['yarn-s']
    packageJson.scripts.d = packageJson.scripts.d.replace('yarn-s', 'npm-s')
    packageJson.scripts = {
      ...packageJson.scripts,
      alanode: 'alanode',
    }
  } else {
    delete packageJson.devDependencies['@artdeco/npm-s']
  }
  packageJson.repository.url = '{{ repo.git_url }}'
  updatePackageJson(packageJson)
  if (manager == 'npm') {
    await updateFiles({
      re: /yarn /g,
      replacement() {
        return 'npm run '
      },
    }, { file: 'package.json' })
  }
  const l = resolve(`mnp/licenses/${license_spdx}.js`)
  const e = existsSync(l)
  const files = []
  if (compile == 'compile') files.push('src/depack.js')
  else if (compile == 'build') files.push('src/index.js')
  if (binary) files.push('src/bin/mnp.js')

  if (e) {
    await updateFiles({
      re: /\/\* license-copyright \*\//g,
      replacement() {
        return readFileSync(l)
      },
    }, { files })
  } else {
    await updateFiles({
      re: /\/\* license-copyright \*\/\n\n/g,
      replacement() {
        return ''
      },
    }, { files })
  }
}