import { rollup } from 'rollup'
import ts from 'rollup-plugin-ts'

import { mapObjectValues, PackageJson, readJson, writeJson } from './utilities'
import { packages } from '../packages'

type Pkg = typeof packages[number]

const bundlePackage = async (pkg: Pkg) => {
  const input = `${pkg.path}\\index.ts`
  const output = `${pkg.path}\\dist\\index.mjs`

  console.log(`[bundle-package] Bundling \`${input}\``)

  const bundle = await rollup({
    input,
    external: [
      'vue',
      '@asyncref/core'
    ],
    plugins: [
      ts()
    ]
  })

  await bundle.write({
    file: output,
    format: 'es'
  })

  console.log(`[bundle-package] Bundle written to \`${output}\``)
}

const adjustPackageJson = async (pkg: Pkg) => {
  const inputPath = `${pkg.path}\\package.json`
  const outputPath = `${pkg.path}\\dist\\package.json`

  console.log(`[adjust-package-json] Adjusting \`${inputPath}\``)

  const packageJson = await readJson<PackageJson>(inputPath)

  const version = packageJson.version ?? '*'

  const adjustedPackageJson = {
    ...packageJson,
    dependencies: mapObjectValues(
      packageJson.dependencies,
      (dependencyVersion) => dependencyVersion === 'workspace:*' ? version : dependencyVersion
    ),
    devDependencies: undefined
  }

  await writeJson(outputPath, adjustedPackageJson)

  console.log(`[adjust-package-json] \`${outputPath}\` created`)
}

const buildPackage = async (pkg: typeof packages[number]) => {
  console.log(`[build-package] Building \`${pkg.name}\``)

  await bundlePackage(pkg)
  await adjustPackageJson(pkg)

  console.log(`[build-package] \`${pkg.name}\` built`)
}

const build = async () => {
  console.log('[build] Starting build')

  for (const pkg of packages) {
    await buildPackage(pkg)
    console.log()
  }

  console.log('[build] Build complete')
}

build()
  .catch((err) => {
    console.error('[build] Error:', err)
    process.exit(1)
  })
