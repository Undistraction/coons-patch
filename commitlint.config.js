// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export default {
  // config-conventional is based on Conventional Commit:
  // https://conventionalcommits.org/
  extends: [`@commitlint/config-conventional`],
  rules: {
    'type-enum': [
      2,
      `always`,
      [
        `build`,
        `ci`,
        `chore`,
        `content`,
        `debug`,
        `deps`,
        `docs`,
        `feat`,
        `fix`,
        `hotfix`,
        `merge`,
        `perf`,
        `refactor`,
        `revert`,
        `style`,
        `test`,
      ],
    ],
    // Scope can be any case.
    'scope-case': [0, `always`],
    // Subject should be sentence case.
    'subject-case': [2, `always`, `sentence-case`],
    'body-max-line-length': [0, `always`, `Infinity`],
  },
}
