/*
 * `util.c` defines some utility functions
 */

#include "core.h"
#include "util.h"
#include "uint.h"

void setcc(uint rslt) {
	uint cc = 0x2;
	if(rslt > 0) {
		cc >>= 1;
	} else if(rslt < 0) {
		cc <<= 1;
	}

	core.psr = core.psr & ~0x7 | cc;
}

// sign extend val (which is w bits wide) to 16 bits
uint sext16(uint val, uint w) {
	return ~(~0<<w) & val | (1<<(w-1) & val ? ~(~(uint)0>>w) : 0);
}

uint trunc16(uint val) {
	return val & 0xffff;
}

