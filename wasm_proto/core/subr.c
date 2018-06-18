/*
 * `subr.c` defines all LC-3 subroutines
 */

#include <stdint.h>
#include "core.h"
#include "subr.h"
#include "extr.h"
#include "util.h"
#include "mem.h"

void add(uint16_t i) {
	uint16_t dr = MASK_DR(i);
	uint16_t sr1 = MASK_8_6(i);

	uint16_t rslt;
	if(MASK_5(i)) { // ADD  DR, SR1, imm5
		uint16_t imm5 = MASK_IMM5(i);
		rslt = core.gpr[dr] = trunc(core.gpr[sr1] + sext16(imm5, 5);
	} else { // ADD  DR, SR1, SR2
		uint16_t sr2 = MASK_2_0(i);
		rslt = core.gpr[dr] = trunc(core.gpr[sr1] + core.gpr[sr2]);
	}

	setcc(rslt);
}

void and(uint16_t i) {
	uint16_t dr = MASK_DR(i);
	uint16_t sr1 = MASK_8_6(i);

	uint16_t rslt;
	if(MASK_5(i)) { // AND  DR, SR1, imm5
		uint16_t imm5 = MASK_IMM5(i);
		rslt = core.gpr[dr] = core.gpr[sr1] & sext16(imm5, 5);
	} else { // AND  DR, SR1, SR2
		uint16_t sr2 = MASK_2_0(i);
		rslt = core.gpr[dr] = core.gpr[sr1] & core.gpr[sr2];
	}

	setcc(rslt);
}

void br(uint16_t i) { // BR___  LABEL
	uint16_t n = MASK_N(i), z = MASK_Z(i), p = MASK_P(i);
	uint16_t off9 = MASK_OFF9(i);

	if(n && core.n || z && core.z || p && core.p) {
		core.pc += sext16(off9); // SUS: incremented PC?
	}
}

// `ret` is a special case of `jmp`
void jmp(uint16_t i) { // JMP  BaseR  (RET = JMP  R7)
	uint16_t baser = MASK_BASER(i);
	core.pc = core.gpr[baser];
}

// `jsrr` is a special case of `jsr`
void jsr(uint16_t i) {
	uint16_t temp = core.pc; // SUS: incremented PC? directly into R7?
	if(MASK_11(i)) { // JSR  LABEL
		uint16_t off11 = MASK_OFF11(i);
		core.pc += sext16(off11, 11);
	} else { // JSRR  BaseR
		uint16_t baser = MASK_BASER(i);
		core.pc = core.gpr[baser];
	}
	core.gpr[7] = temp;
}

void ld(uint16_t i) { // LD  DR, LABEL
	uint16_t dr = MASK_DR(i);
	uint16_t off9 = MASK_OFF9(i);
	uint16_t rslt = core.gpr[dr] = mem[core.pc + sext16(off9, 9)]; // SUS: incremented PC?

	setcc(l, rslt);
}

void ldi(uint16_t i) { // LDI  DR, LABEL
	uint16_t dr = MASK_DR(i);
	uint16_t off9 = MASK_OFF9(i);
	uint16_t rslt = core.gpr[dr] = mem[mem[core.pc + sext16(off9, 9)]]; // SUS: incremented PC?

	setcc(l, rslt);
}

void ldr(uint16_t i) { // LDR  DR, BaseR, offset6
	uint16_t dr = MASK_DR(i);
	uint16_t baser = MASK_BASER(i);
	uint16_t off6 = MASK_OFF6(i);
	uint16_t rslt = core.gpr[dr] = mem[core.gpr[baser] + sext16(off6, 6)];

	setcc(l, rslt);
}

void lea(uint16_t i) { // LEA  DR, LABEL
	uint16_t dr = MASK_DR(i);
	uint16_t off9 = MASK_OFF9(i);
	uint16_t rslt = core.gpr[dr] = core.pc + sext16(off9, 9); // SUS: incremented PC?
	setcc(l, rslt);
}

void not(uint16_t i) { // NOT  DR, SR
	uint16_t dr = MASK_DR(i);
	uint16_t sr = MASK_8_6(i);
	uint16_t rslt = core.gpr[dr] = ~core.gpr[sr];

	setcc(l, rslt);
}

void rti(uint16_t i) { // RTI
	// TODO
}

void st(uint16_t i) { // ST  SR, LABEL
	uint16_t sr = MASK_11_9(i);
	uint16_t off9 = MASK_OFF9(i);
	mem[core.pc + sext16(off9, 9)] = core.gpr[sr]; // SUS: incremented PC?
}

void sti(uint16_t i) { // STI  SR, LABEL
	uint16_t sr = MASK_11_9(i);
	uint16_t off9 = MASK_OFF9(i);
	mem[mem[core.pc + sext16(off9, 9)]] = core.gpr[sr]; // SUS: incremented PC?
}

void str(uint16_t i) { // STR  SR, BaseR, offset6
	uint16_t sr = MASK_11_9(i);
	uint16_t baser = MASK_BASER(i);
	uint16_t off6 = MASK_OFF6(i);
	mem[core.gpr[baser] + sext16(off6, 6)];
}

void trap(uint16_t i) { // TRAP trapvector8
	uint16_t vect8 = MASK_TRAP8(i);
	// TODO
}

