/*
 * `subr.h` declares all LC-3 subroutines
 */

#include "uint.h"

extern void and(uint i);
extern void not(uint i);
extern void br(uint i);
extern void st(uint i);
extern void ld(uint i);
extern void str(uint i);
extern void ldr(uint i);
extern void jmp(uint i);
extern void jsr(uint i);
extern void ldi(uint i);
extern void sti(uint i);
extern void lea(uint i);
extern void trap(uint i);
extern void rti(uint i);

