// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    'vitest/env': true,
  },

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [`.ts`, `.tsx`],
    },
    'import/resolver': {
      // You will also need to install and configure the TypeScript resolver
      // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
      node: true,
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },

  parser: `@typescript-eslint/parser`,
  parserOptions: {
    ecmaVersion: 2018,
    sourcetype: `module`,
  },

  extends: [
    `eslint:recommended`,
    `plugin:@typescript-eslint/recommended`,
    `plugin:import/recommended`,
    `plugin:import/typescript`,
    `plugin:prettier/recommended`,
  ],

  plugins: [`simple-import-sort`, `import`, `@typescript-eslint`],

  ignorePatterns: [
    `/node_modules/*`,
    // Build artifacts
    `/dist/`,
    `/docs/`,
    `**pnpm-lock.yaml`,
    `**CHANGELOG.md`,
    // Test artifacts
    `**/coverage/*`,
  ],

  rules: {
    'simple-import-sort/imports': `error`,
    'simple-import-sort/exports': `error`,
    quotes: [
      `error`,
      `backtick`,
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    'react/prop-types': 0,
    'vitest/consistent-test-filename': [
      `error`,
      {
        pattern: `.*\\.unit\\.test\\.[tj]s?$`,
      },
    ],
    'vitest/consistent-test-it': [
      `error`,
      {
        fn: `it`,
      },
    ],
    'vitest/expect-expect': `error`,
    'vitest/no-commented-out-tests': `error`,
    'vitest/no-disabled-tests': `error`,
    'vitest/no-duplicate-hooks': `error`,
    'vitest/no-focused-tests': `error`,
    'vitest/no-identical-title': `error`,
    'vitest/no-standalone-expect': `error`,
    'vitest/no-test-return-statement': `error`,
    'vitest/prefer-called-with': `error`,
    'vitest/prefer-comparison-matcher': `error`,
    'vitest/prefer-each': `error`,
    'vitest/prefer-equality-matcher': `error`,
    'vitest/prefer-hooks-in-order': `error`,
    'vitest/prefer-hooks-on-top': `error`,
    'vitest/prefer-lowercase-title': `error`,
    'vitest/prefer-mock-promise-shorthand': `error`,
    'vitest/prefer-spy-on': `error`,
    'vitest/prefer-to-be-object': `error`,
    'vitest/prefer-to-be': `error`,
    'vitest/prefer-to-contain': `error`,
    'vitest/prefer-to-have-length': `error`,
    'vitest/require-to-throw-message': `error`,
    'vitest/valid-describe-callback': `error`,
    'vitest/valid-expect': `error`,
    'vitest/valid-title': `error`,
  },

  overrides: [
    {
      files: [`tests/**/*.js`],
      plugins: [`vitest`],
    },
  ],
}
