
clean:
		if [ -d "dist-electron" ]; then rm -rf dist-electron; fi
		if [ -d "coverage" ]; then rm -rf coverage; fi
		if [ -d "build-electron" ]; then rm -rf build-electron; fi

switch_develop:
		git fetch && git checkout develop && git pull

switch_master:
		git fetch && git checkout master && git pull

format_and_lint:
		npm run lint:format && npm run lint && npm run type-check

clean_electron_build:
		$(MAKE) clean
		$(MAKE) electron_build

electron_build:
		npm run electron:build
