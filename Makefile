VERSION ?= $(shell versionn -i)

all: 0.8 0.10 0.12

version: caps_device_type.yaml
	@echo $(VERSION)
	@sed "s/@version:.*$//@version: $(VERSION)/" $< > tmp.tmp
	@mv tmp.tmp $<

%:
	n $@ && npm test

.PHONY: all version
