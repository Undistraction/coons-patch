import { resolve } from 'path'
// eslint-disable-next-line
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      minify: false,
      sourcemap: true,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'coons-patch',
        formats: ['es', 'cjs'],
        fileName: (format, entryAlias) => {
          console.log('>>', format, entryAlias)
          if (format === 'es') {
            return 'index.mjs'
          }
          if (format === 'cjs') {
            return 'index.common.js'
          }
        },
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
