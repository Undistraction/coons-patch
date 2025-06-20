import { defineConfig } from 'vitest/config'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export default defineConfig({
  test: {
    globals: true,
    include: [`**/*.test.{js,ts}`],
    exclude: [`**/node_modules/**`, `**/.dist/**`],
    setupFiles: [`./tests/setup.ts`],
    // Use a test-specific tsconfig
    typecheck: {
      tsconfig: `./tsconfig.test.json`,
    },
    coverage: {
      provider: `v8`,
      reporter: [`text`],
      reportOnFailure: true,
      include: [`src/**`],
    },
  },
})
