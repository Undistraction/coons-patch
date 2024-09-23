import { defineConfig } from 'vitest/config'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export default defineConfig({
  test: {
    globals: true,
    include: [`**/*.test.{js,ts}`],
    setupFiles: [`./tests/setup.js`],
    coverage: {
      provider: `v8`,
      reporter: [`text`],
      reportOnFailure: true,
      include: [`src/**`],
    },
  },
})
