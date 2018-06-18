/*
 * `util.c` defines some utility functions
 */

#include <stdint.h>
#include "core.h"
#include "util.h"

void setcc(uint16_t rslt) {
	uint16_t cc = 0x2;
	if(rslt > 0) {
		cc >>= 1;
	} else if(rslt < 0) {
		cc <<= 1;
	}

	core.psr = core.psr & ~0x7 | cc;
}

// sign extend val (which is w bits wide) to 16 bits
uint16_t sext16(uint16_t val, uint16_t w) {
	return ~(~0<<w) & val | (1<<(w-1) & val ? ~(~(uint16_t)0>>w) : 0);
}

