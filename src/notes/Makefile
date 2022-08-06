# https://blog.cloudflare.com/cloudflare-worker-with-webassembly-and-haskell/
CFLAGS=-O2 -Wall

# dummy headers in '/stubs'
NO_STANDARD_LIBS=-nostdlib -nostdinc -isystemstubs

# import WebAssembly.Memory in worker.js or DurableObjectExample.mjs
WASM_LINKER_FLAGS=-Wl,--no-entry -Wl,--import-memory -Wl,--export-dynamic

# 86' bootstrap.h use Emscripten full C library, but Emscripten requires -s TEXTDECODER=0
backbank.wasm: exec.c
	clang $(CFLAGS) --target=wasm32-unknown-unknown-wasm \
	    $(NO_STANDARD_LIBS) $(WASM_LINKER_FLAGS) \
	    exec.c -o backbank.wasm

clean:
	rm -f backbank.wasm

CF_KEYFILE=.cf-keys
upload: backbank.wasm
	(. $(CF_KEYFILE) && curl -X PUT -H "X-Auth-Email: $$API_EMAIL" -H "X-Auth-Key: $$API_KEY" \
	  "https://api.cloudflare.com/client/v4/accounts/$$ACCOUNT_ID/workers/scripts/wasm-demo" \
		-F metadata=@shim-metadata.json \
		-F script=@shim.js \
		-F wasm=@backbank.wasm)
