.PHONY: all build

all: build

build: node_modules lib 
	npm run lessc

dist: build src requirejs.conf.js tools
	mkdir -p dist
	./node_modules/requirejs/bin/r.js -o ./tools/build.conf.js	

# if package.json changes, install
node_modules: package.json
	npm install
	touch $@

lib: node_modules
	./node_modules/bower/bin/bower install
	cd lib/activity-mocks && make dist

server: build
	npm start


clean:
	rm -rf node_modules
	rm -rf lib
	rm -rf dist

package: build

env=dev
deploy:
	./node_modules/.bin/lfcdn -e $(env)
