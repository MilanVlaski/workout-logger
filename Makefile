.PHONY: clean build run ci-test everything-test test fast-test slow-test demo-build demo-run local-build local-run cloud-build cloud-run

# --- Variables ---
SRC      := src
DIST     := dist
JS_DIR   := assets/js

# --- Logic Factory ---

define sync
	mkdir -p $(DIST)/$(1)
	rsync -av --exclude='$(JS_DIR)' $(SRC)/ $(DIST)/$(1)
	rsync -av pwa-manifest/$(1)/ $(DIST)/$(1)/
	rsync -av pwa-manifest/screenshot* $(DIST)/$(1)/
endef

# --- The Build Logic ---
# $(1) = flavor
define build
	$(call sync,$(1))
	bun build $(SRC)/$(JS_DIR)/index-$(1).js --outfile $(DIST)/$(1)/$(JS_DIR)/index.js --define "APP_PROFILE='$(1)'" --minify
endef

# --- The Run Logic ---
# $(1) = flavor
# No service workers while debugging
define run
	$(call sync,$(1))
	rm -f $(DIST)/$(1)/sw.js
	(bun build $(SRC)/$(JS_DIR)/index-$(1).js --outfile $(DIST)/$(1)/$(JS_DIR)/index.js --watch --define "APP_PROFILE='$(1)'" & \
	 bun watch.js $(DIST)/$(1) & \
	 bun x browser-sync start --server "$(DIST)/$(1)" --files "$(DIST)/$(1)/**/*" --no-cache)
endef

# --- Targets ---

demo-build:
	$(call build,demo)

demo-run:
	$(call run,demo)

local-build:
	$(call build,local)

local-run:
	$(call run,local)

cloud-build:
	$(call build,cloud)

cloud-run:
	$(call run,cloud)

dev-build:
	$(call build,dev)

dev-run:
	$(call run,dev)
	
	

test:
	bun test test/fast/

ci-test: test
	bun run src/serve.js & \
	SERVER_PID=$$!; \
	echo "Waiting for server..."; \
	until curl -s localhost:8000 > /dev/null; do sleep 1; done; \
	(PAGE_URL=http://localhost:8000 $(MAKE) slow-test; EXIT_CODE=$$?; \
	 kill $$SERVER_PID; \
	 exit $$EXIT_CODE)

everything-test: test slow-test

serve:
	bun run src/serve.js

slow-test:
	PAGE_URL=$(PAGE_URL) bun test test/slow/automation.test.js

run: 
	bun x browser-sync start --server "src" --files "src/**/*" --no-cache


clean:
	rm -rf ./dist
