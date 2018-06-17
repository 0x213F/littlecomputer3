/*
 * `core.h` defines the architecture of an LC-3 core.
 */

#include "uint.h"

typedef struct lc3 {
	// general purpose registers (R0-R7)
	uint gpr[8];

	// program counter
    uint pc;

	// processor status register
	// PSR[15]    privilege mode of executing process
	// PSR[10:8]  priority level of executing process
	// PSR[2:0]   condition codes (ordered: nzp)
	uint psr;
} lc3;

extern lc3 core;

