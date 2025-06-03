
switch_develop:
	git fetch && git checkout develop && git pull

switch_master:
	git fetch && git checkout develop && git pull

format_and_lint:
	npm run lint:format && npm run lint && npm run type-check
