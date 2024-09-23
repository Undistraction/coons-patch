import { resolve } from 'path'
// eslint-disable-next-line
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import packageJson from './package.json'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

enum FileExtension {
  ES = `es`,
  CJS = `cjs`,
}

const entry = resolve(__dirname, `src/index.ts`)

if (!entry) {
  throw new Error(`Entry file not found`)
}

// Pull a list of externals from package.json's dependencies
const external = Object.keys(packageJson.dependencies)

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    logLevel: `info`,
    build: {
      minify: false,
      sourcemap: true,
      lib: {
        entry,
        name: `Coons Patch`,
        formats: [FileExtension.ES, FileExtension.CJS],
        // Choose names for build artifacts
        fileName: (format) => {
          if (format === FileExtension.ES) {
            return `index.js`
          }
          if (format === FileExtension.CJS) {
            return `index.cjs`
          }
          throw new Error(`Unknown format: '${format}'`)
        },
      },
      rollupOptions: {
        external,
      },
    },
    plugins: [
      // Generate a single types file for all our types
      dts({
        rollupTypes: true,
      }),
    ],
  }
})
