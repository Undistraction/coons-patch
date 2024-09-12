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

  plugins: [
    `unused-imports`,
    `simple-import-sort`,
    `import`,
    `@typescript-eslint`,
  ],

  ignorePatterns: [
    // Packages
    `/node_modules/*`,
    `**pnpm-lock.yaml`,
    // Build artifacts
    `/dist/`,
    `/docs/`,
    `**CHANGELOG.md`,
    // Test artifacts
    `**/coverage/*`,
  ],

  rules: {
    // -------------------------------------------------------------------------
    // Unused imports
    // -------------------------------------------------------------------------

    '@typescript-eslint/no-unused-vars': `off`,
    'unused-imports/no-unused-imports': `error`,
    'unused-imports/no-unused-vars': [
      `warn`,
      {
        vars: `all`,
        varsIgnorePattern: `^_`,
        args: `after-used`,
        argsIgnorePattern: `^_`,
      },
    ],

    // -------------------------------------------------------------------------
    // Generic
    // -------------------------------------------------------------------------
    quotes: [
      `error`,
      `backtick`,
      { avoidEscape: true, allowTemplateLiterals: true },
    ],

    // -------------------------------------------------------------------------
    // Imports
    // -------------------------------------------------------------------------
    'simple-import-sort/imports': `error`,
    'simple-import-sort/exports': `error`,
  },

  overrides: [
    // Use vitest when running on files in the tests directory
    {
      files: [`tests/**/*.js`],
      plugins: [`vitest`],
      rules: {
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
    },
  ],
}
