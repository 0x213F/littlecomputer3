/*
 * `subr.h` declares all LC-3 subroutines
 */

#include <stdint.h>

extern void and(uint16_t i);
extern void not(uint16_t i);
extern void br(uint16_t i);
extern void st(uint16_t i);
extern void ld(uint16_t i);
extern void str(uint16_t i);
extern void ldr(uint16_t i);
extern void jmp(uint16_t i);
extern void jsr(uint16_t i);
extern void ldi(uint16_t i);
extern void sti(uint16_t i);
extern void lea(uint16_t i);
extern void trap(uint16_t i);
extern void rti(uint16_t i);

