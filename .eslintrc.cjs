// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
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

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourcetype: 'module',
  },

  extends: [
    'eslint:recommended',
    `plugin:@typescript-eslint/recommended`,
    'plugin:import/recommended',
    `plugin:import/typescript`,
  ],

  plugins: ['import', '@typescript-eslint'],

  ignorePatterns: ['**/coverage/*', `/node_modules/*`, `/dist/`, '/docs/'],

  rules: {
    'react/prop-types': 0,
  },

  overrides: [
    {
      files: [`tests/**/*.js`],
      plugins: [`vitest`],
    },
  ],
}
