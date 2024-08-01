import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [`**/*.test.{js,ts}`],
    setupFiles: [`./tests/setup.js`],
    coverage: {
      provider: `v8`, // or 'v8'
      reporter: [`text`],
      reportOnFailure: true,
      include: [`src/**`],
    },
  },
})
