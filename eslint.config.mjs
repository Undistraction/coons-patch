import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import vitestPlugin from '@vitest/eslint-plugin'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  // Global ignores
  {
    ignores: [`coverage/*`, `node_modules/*`, `dist/*`, `docs/*`],
  },
  // Default config
  {
    files: [`**/*.{ts,tsx,mjs,cjs,js}`],
    linterOptions: {
      reportUnusedDisableDirectives: `error`,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: `module`,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      // Recommended to disable on TypeScript projects. See:
      // https://shorturl.at/7aewp
      'no-undef': `off`,
      quotes: [
        `error`,
        `backtick`,
        { avoidEscape: true, allowTemplateLiterals: true },
      ],

      // Unused imports
      'unused-imports/no-unused-imports': `error`,
      'unused-imports/no-unused-vars': [
        `error`,
        {
          vars: `all`,
          varsIgnorePattern: `^_`,
          args: `after-used`,
          argsIgnorePattern: `^_`,
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Unit tests
  // ---------------------------------------------------------------------------
  {
    files: [`tests/unit/**/*.unit.test.{ts,js}`, `tests/unit/setup.{ts,js}`],
    languageOptions: {
      globals: {
        ...vitestPlugin.environments.env.globals,
      },
    },
    plugins: {
      vitest: vitestPlugin,
    },
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
      'vitest/no-commented-out-tests': `warn`,
      'vitest/no-disabled-tests': `warn`,
      'vitest/no-duplicate-hooks': `error`,
      'vitest/no-focused-tests': `warn`,
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
  }
)
