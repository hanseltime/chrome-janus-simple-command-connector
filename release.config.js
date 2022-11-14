module.exports = {
  branches: ['main', { name: 'develop', prerelease: true }, { name: 'rc', prerelease: true }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message: 'docs(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    // This creates a release on github - you can decide if you want to mirror the files in package.json
    '@semantic-release/github',
  ],
  ci: true,
}
