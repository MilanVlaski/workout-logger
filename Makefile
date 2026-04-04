.PHONY: serve test test-all slow-test

# Default URL for local development (Live Server)
PAGE_URL ?= http://127.0.0.1:5500

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
