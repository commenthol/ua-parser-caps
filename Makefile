VERSION ?= $(shell versionn -i)

all: caps v0.8 v0.10 v0.12

caps: js/caps.js

version: caps_device_type.yaml
	@echo $(VERSION)
	@sed "s/version:.*$//version: $(VERSION)/" $< > tmp.tmp
	@mv tmp.tmp $<

clean:
	rm -rf node_modules

test:
	node js/test/sample.js
	node js/test/perf.js

v%: node_modules
	n $@ && npm test

js/caps.js: caps_*.yaml
	js/bin/caps2js.js -c

node_modules:
	npm i

.PHONY: all caps test clean version
