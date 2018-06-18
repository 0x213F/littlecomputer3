/*
 * `wasm.c` handles Wasm-specific tasks
 */

#include <stdint.h>
#include <emscripten/emscripten.h>
#include "core.h"
#include "mem.h"

// EMSCRIPTEN_KEEPALIVE
void init() {
	for(int i = 0; i < 8; ++i) {
		core.gpr[i] = 0;
	}
	core.pc = 0x3000; // to be set by .ORIG
	core.psr = 0x8000; // privilege mode: user
}

// EMSCRIPTEN_KEEPALIVE
uint16_t reg(uint16_t i) {
	return core.gpr[i];
}

// EMSCRIPTEN_KEEPALIVE
uint16_t pc() {
	return core.pc;
}

// EMSCRIPTEN_KEEPALIVE
uint16_t privilege() {
	return core.psr >> 15 & 0x1;
}

// EMSCRIPTEN_KEEPALIVE
uint16_t priority() {
	return core.psr >> 8 & 0x7;
}

// EMSCRIPTEN_KEEPALIVE
uint16_t* pass1(uint16_t *src);
	// handles labels and assembler directives
	// returns pointer to program in memory for second pass
	//    i.e. pass2(pass1( ... ));

// EMSCRIPTEN_KEEPALIVE
void pass2(uint16_t *src);
	// read at `src` and execute intructions

