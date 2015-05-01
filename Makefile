VERSION ?= $(shell versionn -i)

all: v0.8 v0.10 v0.12

clean:
	rm -rf node_modules

version: caps_device_type.yaml
	@echo $(VERSION)
	@sed "s/@version.*$//@version $(VERSION)/" $< > tmp.tmp
	@mv tmp.tmp $<

v%: node_modules
	n $@ && npm test

node_modules:
	npm i

.PHONY: all clean version
