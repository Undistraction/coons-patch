import { resolve } from 'path'
// eslint-disable-next-line
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import packageJson from './package.json'

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
        entry: resolve(__dirname, `src/index.ts`),
        name: `Coons Patch`,
        formats: [`es`, `cjs`],
        // Choose names for build artifacts
        fileName: (format) => {
          if (format === `es`) {
            return `index.js`
          }
          if (format === `cjs`) {
            return `index.cjs`
          }
        },
      },
      rollupOptions: {
        // Pull a list of externals from package.json's dependencies
        external: Object.keys(packageJson.dependencies),
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
