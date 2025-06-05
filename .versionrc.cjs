/**
 * Standard-version configuration
 *
 * Simple configuration for automatic version bumping and changelog generation
 * based on conventional commits.
 */

module.exports = {
  // Types of commits that will appear in the changelog
  types: [
    { type: 'feat', section: '✨ Features' },
    { type: 'fix', section: '🐛 Bug Fixes' },
    { type: 'perf', section: '⚡ Performance Improvements' },
    { type: 'revert', section: '⏪ Reverts' },
    { type: 'docs', section: '📚 Documentation', hidden: false },
    { type: 'style', section: '💄 Styles', hidden: true },
    { type: 'chore', section: '🔧 Maintenance', hidden: true },
    { type: 'refactor', section: '♻️ Code Refactoring', hidden: true },
    { type: 'test', section: '✅ Tests', hidden: true },
    { type: 'build', section: '📦 Build System', hidden: true },
    { type: 'ci', section: '👷 CI/CD', hidden: true }
  ],

  // GitHub URLs
  commitUrlFormat: 'https://github.com/sergerdn/vuetify-electron-starter/commit/{{hash}}',
  compareUrlFormat:
    'https://github.com/sergerdn/vuetify-electron-starter/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat: 'https://github.com/sergerdn/vuetify-electron-starter/issues/{{id}}',
  userUrlFormat: 'https://github.com/{{user}}',

  // Release commit message template
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',

  // Files to update with a new version
  bumpFiles: [
    {
      filename: 'package.json',
      type: 'json'
    },
    {
      filename: 'package-lock.json',
      type: 'json'
    }
  ],

  // Tag prefix
  tagPrefix: 'v',

  // Use angular preset for conventional commits
  preset: 'angular'
};
