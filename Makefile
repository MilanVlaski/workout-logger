.PHONY: demo-build demo-run pro-build pro-run cloud-build cloud-run

# --- Variables ---
SRC      := src
DIST     := dist
JS_DIR   := assets/js
RSYNC_EX := --exclude='$(JS_DIR)'

# --- Logic Factory ---

define sync
	mkdir -p $(DIST)/$(1)
	rsync -av $(RSYNC_EX) $(SRC)/ $(DIST)/$(1)
endef

# --- The Build Logic ---
# $(1) = flavor
define build
	$(call sync,$(1))
	bun build $(SRC)/$(JS_DIR)/index-$(1).js --outfile $(DIST)/$(1)/$(JS_DIR)/index.js --minify
endef

# --- The Run Logic ---
# $(1) = flavor
define run
	$(call sync,$(1))
	(bun build $(SRC)/$(JS_DIR)/index-$(1).js --outfile $(DIST)/$(1)/$(JS_DIR)/index.js --watch & \
	 bun watch.js $(DIST)/$(1) & \
	 bunx live-server $(DIST)/$(1))
endef

# --- Targets ---

demo-build:
	$(call build,demo)

demo-run:
	$(call run,demo)

pro-build:
	$(call build,pro)

pro-run:
	$(call run,pro)

cloud-build:
	$(call build,cloud)

cloud-run:
	$(call run,cloud)

test:
	deno test test/fast/**

ci-test: test
	deno run --allow-net --allow-read jsr:@std/http/file-server src/ --port 8000 & \
	SERVER_PID=$$!; \
	echo "Waiting for server..."; \
	until curl -s localhost:8000 > /dev/null; do sleep 1; done; \
	(PAGE_URL=http://localhost:8000 $(MAKE) slow-test; EXIT_CODE=$$?; \
	 kill $$SERVER_PID; \
	 exit $$EXIT_CODE)

everything-test: test slow-test

serve:
	deno run --allow-net --allow-read jsr:@std/http/file-server src/ --port 8000

slow-test:
	PAGE_URL=$(PAGE_URL) deno test -A test/slow/automation.test.js

run: 
	bun x browser-sync start --server "src" --files "src/**/*" --no-cache

build:
	# JS files will be minified, so no need to include them
	rsync -av --exclude='assets/js/' src/ dist/
	bun build ./src/assets/js/index.js --outdir ./dist/assets/js --minify --sourcemap

clean:
	rm -rf ./dist
