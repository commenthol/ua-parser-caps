VERSION  := $(shell versionn -i)
CAPSYAML := $(wildcard caps_*.yaml)
CAPSJS    = js/caps.js

all: version caps v0.12

caps: $(CAPSJS)

version: $(CAPSYAML)

$(CAPSYAML): package.json
	@echo $(VERSION) $@
	@sed "s/version:.*$//version: $(VERSION)/" $@ > tmp.tmp
	@mv tmp.tmp $@

clean:
	rm -rf node_modules

test:
	node js/test/sample.js
	node js/test/perf.js

v%: node_modules
	n $@ && npm test

$(CAPSJS): $(CAPSYAML)
	js/bin/caps2js.js -c

node_modules:
	npm i

.PHONY: all caps test clean version
#$(CAPSYAML)
