// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

module.exports = {
  env: {
    browser: true,
    jest: true,
    node: true,
    'jest/globals': true,
  },

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:import/recommended'],
  plugins: ['jest', 'tailwind', 'import'],
  ignorePatterns: ['**/coverage/*', `/node_modules/*`],
}

// [
//   {
//     name: 'demo/all',
//     languageOptions: {
//       sourceType: `module`,
//       parserOptions: {
//         ecmaFeatures: {
//           jsx: true,
//         },
//       },
//       globals: {
//         ...globals.browser,
//       },
//     },
//     files: [`**/*.{js,jsx}`],
//     rules: {
//       'no-unused-vars': 'warn',
//       'no-undef': 'warn',
//       'react/jsx-uses-react': 'error',
//       'react/jsx-uses-vars': 'error',
//     },
//     plugins: { react, tailwind },
//   },
//   // Rules for only test files
//   {
//     name: 'demo/tests',
//     files: ['tests/**.{mjs,js}'],
//     plugins: {
//       jest,
//     },
//   },
// ]
