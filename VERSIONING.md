# 🚀 Developer Release Workflow

This guide shows how to use **Commitizen** for better commits and **automatic version bumping** for GitHub releases.

**Current Branch**: `develop` (will switch to `master` in the future)

## 📝 Making Commits with Commitizen

Instead of regular `git commit`, use the interactive commit tool:

```bash
npm run commit
```

This will guide you through:

1. **Type**: Select commit type (feat, fix, docs, etc.)
2. **Scope**: Optional area of change (auth, ui, api, etc.)
3. **Description**: Short description of the change
4. **Body**: Optional longer description
5. **Breaking Changes**: If this breaks existing functionality
6. **Issues**: Reference any GitHub issues

### Commit Types

| Type       | Description   | Example                              |
|------------|---------------|--------------------------------------|
| `feat`     | New feature   | `feat(auth): add login system`       |
| `fix`      | Bug fix       | `fix(ui): resolve button alignment`  |
| `docs`     | Documentation | `docs(readme): update install guide` |
| `chore`    | Maintenance   | `chore(deps): update electron`       |
| `refactor` | Code cleanup  | `refactor(api): simplify auth logic` |
| `test`     | Tests         | `test(auth): add login tests`        |
| `perf`     | Performance   | `perf(ui): optimize rendering`       |

## 🏷️ Creating Releases

### Option 1: Automatic Version Bumping (Recommended)

1. **Make sure all changes are committed**
   ```bash
   git status  # Should be clean
   ```

2. **Preview what will happen**
   ```bash
   npm run version:dry
   ```

3. **Create release automatically**
   ```bash
   # Auto-detect version bump based on commits
   npm run version:auto

   # Or force specific version bump
   npm run version:patch   # 0.0.1 → 0.0.2
   npm run version:minor   # 0.1.0 → 0.2.0
   npm run version:major   # 1.0.0 → 2.0.0
   ```

4. **Push to GitHub**
   ```bash
   git push --follow-tags origin develop
   ```

5. **Create GitHub Release**
    - Go to GitHub → Releases → "Create a new release"
    - Select the new tag (e.g., `v0.1.0`)
    - Copy content from generated CHANGELOG.md
    - Publish release

### Option 2: Manual Release Process

1. **Make sure all changes are committed**
   ```bash
   git status  # Should be clean
   ```

2. **Update version in package.json manually**
   ```bash
   # Edit package.json, change version from "0.0.1" to "0.1.0"
   ```

3. **Create a git tag**
   ```bash
   git add package.json package-lock.json
   git commit -m "chore(release): v0.1.0"
   git tag v0.1.0
   ```

4. **Push to GitHub**
   ```bash
   git push origin develop
   git push origin v0.1.0
   ```

5. **Create GitHub Release**
    - Go to GitHub → Releases → "Create a new release"
    - Select tag `v0.1.0`
    - Write release notes based on your commits
    - Create a changelog manually if needed
    - Publish release

## 🔄 Complete Development Workflow

### Feature Development

1. **Create a feature branch from develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-auth
   ```

2. **Make changes and commit**
   ```bash
   # Make your changes
   npm run commit  # Use commitizen
   # Select: feat
   # Scope: auth
   # Description: add user authentication system
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/new-auth
   # Create PR to merge into develop
   ```

### Bug Fixes

1. **Create a fix branch from develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b fix/button-alignment
   ```

2. **Make changes and commit**
   ```bash
   # Fix the bug
   npm run commit  # Use commitizen
   # Select: fix
   # Scope: ui
   # Description: resolve button alignment issue
   ```

3. **Push and create PR**
   ```bash
   git push origin fix/button-alignment
   # Create PR to merge into develop
   ```

### Release Process

1. **Prepare release on `develop` branch**
   ```bash
   git checkout develop
   git pull origin develop
   
   # Make sure all features/fixes are merged
   # Run tests to ensure everything works
   npm run ci
   ```

2. **Create release**
   ```bash
   # Edit package.json version manually (e.g., 0.0.1 → 0.1.0)
   git add package.json package-lock.json
   git commit -m "chore(release): v0.1.0"
   git tag v0.1.0
   ```

3. **Push to GitHub**
   ```bash
   git push origin develop
   git push origin v0.1.0
   ```

4. **Create GitHub Release**
    - Go to GitHub → Releases → "Create a new release"
    - Select tag `v0.1.0`
    - Title: `v0.1.0`
    - Description: Write release notes based on your commits since the last release
    - Attach build files if needed (from `dist-electron/`)
    - Publish release

### Hotfixes

1. **Create `hotfix branch` from `develop`**
   ```bash
   git checkout develop
   git checkout -b hotfix/critical-bug
   # Fix the critical bug
   npm run commit  # Type: fix
   ```

2. **Merge and release**
   ```bash
   git checkout develop
   git merge hotfix/critical-bug
   # Bump patch version (0.1.0 → 0.1.1)
   # Edit package.json manually
   git add package.json package-lock.json
   git commit -m "chore(release): v0.1.1"
   git tag v0.1.1
   git push origin develop
   git push origin v0.1.1
   ```

3. **Create GitHub Release** (same process as above)

## 🤖 What Automatic Versioning Does

When you run `npm run version:auto`, it will:

1. **Analyze commits** since the last release
2. **Determine version bump**:
    - `feat:` commits → Minor version bump (0.1.0 → 0.2.0)
    - `fix:` commits → Patch version bump (0.1.0 → 0.1.1)
    - `BREAKING CHANGE:` → Major version bump (1.0.0 → 2.0.0)
3. **Update version** in package.json and package-lock.json
4. **Generate CHANGELOG.md** with categorized changes
5. **Create git commit** with message `chore(release): vX.Y.Z`
6. **Create git tag** `vX.Y.Z`

## 🛠️ Available Commands

| Command                 | Description                                 |
|-------------------------|---------------------------------------------|
| `npm run commit`        | Interactive commit with commitizen          |
| `npm run version:dry`   | Preview next version without making changes |
| `npm run version:auto`  | Auto-detect version bump based on commits   |
| `npm run version:patch` | Force patch bump (0.0.1 → 0.0.2)            |
| `npm run version:minor` | Force minor bump (0.1.0 → 0.2.0)            |
| `npm run version:major` | Force major bump (1.0.0 → 2.0.0)            |
| `make commit`           | Makefile shortcut for commit                |
| `make version_dry`      | Makefile shortcut for dry run               |
| `make version_auto`     | Makefile shortcut for auto version          |

## 📋 Quick Checklist

Before creating a release:

- [ ] All features/fixes are merged to develop
- [ ] All tests pass (`npm run ci`)
- [ ] Version number is updated in package.json
- [ ] Commit messages follow conventional format
- [ ] No uncommitted changes (`git status`)

For GitHub release:

- [ ] Tag is pushed to GitHub
- [ ] Release notes describe main changes
- [ ] Build artifacts attached if needed
- [ ] Release is published

## 💡 Tips

- **Use descriptive commit messages**: They become your release notes
- **Keep commits focused**: One feature/fix per commit
- **Test before releasing**: Run `npm run ci` to ensure quality
- **Version semantically**:
    - Patch (0.0.1 → 0.0.2): Bug fixes
    - Minor (0.1.0 → 0.2.0): New features
    - Major (1.0.0 → 2.0.0): Breaking changes
