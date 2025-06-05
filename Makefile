# ----------------------------------------------------------------------------
# Testing and Quality
# ----------------------------------------------------------------------------

# Run all tests
tests_all:
		npm run test:all

# Format and check code quality
format_and_lint:
		npm run lint:format && npm run lint && npm run type-check

# ----------------------------------------------------------------------------
# Build and Package Management
# ----------------------------------------------------------------------------

# Clean build artifacts
clean:
		if [ -d "dist-electron" ]; then rm -rf dist-electron; fi
		if [ -d "coverage" ]; then rm -rf coverage; fi
		if [ -d "build-electron" ]; then rm -rf build-electron; fi
		$(MAKE) ensure_fsevents_dir

# Ensure Playwright fsevents directory exists
ensure_fsevents_dir:
	if [ ! -d "./node_modules/playwright/node_modules/fsevents" ]; then \
		mkdir -p "./node_modules/playwright/node_modules/fsevents"; \
	fi

# Build Electron application
electron_build:
		npm run electron:build

# Clean, build and package Electron application
clean_electron_build:
		$(MAKE) clean
		npm run build-only
		$(MAKE) electron_build
		$(MAKE) archive_electron_package
		$(MAKE) copy_fingerprints_to_electron_package

# Copy Playwright with fingerprints to the built application
copy_fingerprints_to_electron_package:
		VERSION=$$(jq -r .version package.json) && \
		if [ -d ".data_playwright_with_fingerprints" ]; then \
			cp -r ".data_playwright_with_fingerprints" \
			"./dist-electron/$$VERSION/win-unpacked/.data_playwright_with_fingerprints"; \
		else \
			echo "Warning: .data_playwright_with_fingerprints directory not found"; \
			exit 1; \
		fi

# Create distribution package only
archive_electron_package:
		VERSION=$$(jq -r .version package.json) && \
		powershell Compress-Archive -Force -Path "./dist-electron/$$VERSION/win-unpacked/*" \
			-DestinationPath "./dist-electron/$$VERSION/VuetifyElectronStarter-$$VERSION-x64.zip"


# ----------------------------------------------------------------------------
# Git Branch Management
# ----------------------------------------------------------------------------

# Switch to develop branch
switch_develop:
		git fetch && git checkout develop && git pull

# Switch to master branch
switch_master:
		git fetch && git checkout master && git pull

# ----------------------------------------------------------------------------
# Version and Release Management
# ----------------------------------------------------------------------------

# Create conventional commit
commit:
		npm run commit

# Dry run version bump
version_dry:
		npm run version:dry

# Auto version bump based on commits
version_auto:
		npm run version:auto

# Bump patch version (0.0.X)
version_patch:
		npm run version:patch

# Bump minor version (0.X.0)
version_minor:
		npm run version:minor

# Bump major version (X.0.0)
version_major:
		npm run version:major
