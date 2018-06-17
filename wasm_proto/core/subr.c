/*
 * `subr.c` defines all LC-3 subroutines
 */

#include "core.h"
#include "subr.h"
#include "extr.h"
#include "util.h"
#include "uint.h"
#include "mem.h"

void add(uint i) {
	uint dr = MASK_DR(i);
	uint sr1 = MASK_8_6(i);

	uint rslt;
	if(MASK_5(i)) { // ADD  DR, SR1, imm5
		uint imm5 = MASK_IMM5(i);
		rslt = core.gpr[dr] = trunc(core.gpr[sr1] + sext16(imm5, 5);
	} else { // ADD  DR, SR1, SR2
		uint sr2 = MASK_2_0(i);
		rslt = core.gpr[dr] = trunc(core.gpr[sr1] + core.gpr[sr2]);
	}

	setcc(rslt);
}

void and(uint i) {
	uint dr = MASK_DR(i);
	uint sr1 = MASK_8_6(i);

	uint rslt;
	if(MASK_5(i)) { // AND  DR, SR1, imm5
		uint imm5 = MASK_IMM5(i);
		rslt = core.gpr[dr] = core.gpr[sr1] & sext16(imm5, 5);
	} else { // AND  DR, SR1, SR2
		uint sr2 = MASK_2_0(i);
		rslt = core.gpr[dr] = core.gpr[sr1] & core.gpr[sr2];
	}

	setcc(rslt);
}

void br(uint i) { // BR___  LABEL
	uint n = MASK_N(i), z = MASK_Z(i), p = MASK_P(i);
	uint off9 = MASK_OFF9(i);

	if(n && core.n || z && core.z || p && core.p) {
		core.pc += sext16(off9); // SUS: incremented PC?
	}
}

// `ret` is a special case of `jmp`
void jmp(uint i) { // JMP  BaseR  (RET = JMP  R7)
	uint baser = MASK_BASER(i);
	core.pc = core.gpr[baser];
}

// `jsrr` is a special case of `jsr`
void jsr(uint i) {
	uint temp = core.pc; // SUS: incremented PC? directly into R7?
	if(MASK_11(i)) { // JSR  LABEL
		uint off11 = MASK_OFF11(i);
		core.pc += sext16(off11, 11);
	} else { // JSRR  BaseR
		uint baser = MASK_BASER(i);
		core.pc = core.gpr[baser];
	}
	core.gpr[7] = temp;
}

void ld(uint i) { // LD  DR, LABEL
	uint dr = MASK_DR(i);
	uint off9 = MASK_OFF9(i);
	uint rslt = core.gpr[dr] = mem[core.pc + sext16(off9, 9)]; // SUS: incremented PC?

	setcc(l, rslt);
}

void ldi(uint i) { // LDI  DR, LABEL
	uint dr = MASK_DR(i);
	uint off9 = MASK_OFF9(i);
	uint rslt = core.gpr[dr] = mem[mem[core.pc + sext16(off9, 9)]]; // SUS: incremented PC?

	setcc(l, rslt);
}

void ldr(uint i) { // LDR  DR, BaseR, offset6
	uint dr = MASK_DR(i);
	uint baser = MASK_BASER(i);
	uint off6 = MASK_OFF6(i);
	uint rslt = core.gpr[dr] = mem[core.gpr[baser] + sext16(off6, 6)];

	setcc(l, rslt);
}

void lea(uint i) { // LEA  DR, LABEL
	uint dr = MASK_DR(i);
	uint off9 = MASK_OFF9(i);
	uint rslt = core.gpr[dr] = core.pc + sext16(off9, 9); // SUS: incremented PC?
	setcc(l, rslt);
}

void not(uint i) { // NOT  DR, SR
	uint dr = MASK_DR(i);
	uint sr = MASK_8_6(i);
	uint rslt = core.gpr[dr] = ~core.gpr[sr];

	setcc(l, rslt);
}

void rti(uint i) { // RTI
	// TODO
}

void st(uint i) { // ST  SR, LABEL
	uint sr = MASK_11_9(i);
	uint off9 = MASK_OFF9(i);
	mem[core.pc + sext16(off9, 9)] = core.gpr[sr]; // SUS: incremented PC?
}

void sti(uint i) { // STI  SR, LABEL
	uint sr = MASK_11_9(i);
	uint off9 = MASK_OFF9(i);
	mem[mem[core.pc + sext16(off9, 9)]] = core.gpr[sr]; // SUS: incremented PC?
}

void str(uint i) { // STR  SR, BaseR, offset6
	uint sr = MASK_11_9(i);
	uint baser = MASK_BASER(i);
	uint off6 = MASK_OFF6(i);
	mem[core.gpr[baser] + sext16(off6, 6)];
}

void trap(uint i) { // TRAP trapvector8
	uint vect8 = MASK_TRAP8(i);
	// TODO
}

