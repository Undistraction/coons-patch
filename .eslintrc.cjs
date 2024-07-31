// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

module.exports = {
  env: {
    browser: true,
    jest: true,
    node: true,
    es6: true,
    'jest/globals': true,
  },

  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },

  settings: {
    react: {
      version: '18',
    },
  },

  extends: ['eslint:recommended', 'plugin:import/recommended'],

  plugins: ['import'],

  ignorePatterns: ['**/coverage/*', `/node_modules/*`, `/dist/`],

  rules: {
    'react/prop-types': 0,
  },

  overrides: [
    {
      files: [`tests/**/*.js`],
      plugins: [`jest`],
      extends: [`plugin:jest/recommended`],
    },
  ],
}
