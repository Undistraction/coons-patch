import { resolve } from 'path'
// eslint-disable-next-line
import { defineConfig } from 'vite'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, 'src/getCoonsPatch.js'),
        name: 'coons-patch',
        // the proper extensions will be added
        fileName: 'coons-patch',
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ['bezier-easing'],
        output: {},
      },
    },
  }
})
