export default {
  branches: [{ name: `main` }, { name: `alpha`, prerelease: true }],
  plugins: [
    [
      `@semantic-release/commit-analyzer`,
      {
        preset: `conventionalcommits`,
      },
    ],
    [
      `@semantic-release/release-notes-generator`,
      {
        preset: `conventionalcommits`,
        parserOpts: {
          noteKeywords: [`BREAKING CHANGE`, `BREAKING CHANGES`, `BREAKING`],
        },
        writerOpts: {
          commitsSort: [`subject`, `scope`],
        },
      },
    ],
    [
      `@semantic-release/changelog`,
      {
        changelogFile: `CHANGELOG.md`,
      },
    ],
    `@semantic-release/npm`,
    [
      `@semantic-release/git`,
      {
        assets: [`CHANGELOG.md`, `package.json`],
      },
    ],
    `@semantic-release/github`,
  ],
}
