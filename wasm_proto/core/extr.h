/*
 * `extr.h` defines macros for LC-3 instruction operand extraction.
 */

#define MASK_11(I) ((I) >> 0xb & 0x1)
#define MASK_11_9(I) ((I) >> 0x9 & 0x7)
#define MASK_8_6(I) ((I) >> 0x6 & 0x7)
#define MASK_5(I) ((I) >> 0x5 & 0x1)
#define MASK_2_0(I) ((I) & 0x7)

#define MASK_INS(I) ((I) >> 0xc & 0xf) // I[15:12]
#define MASK_DR(I) MASK_11_9(I)
#define MASK_BASER(I) MASK_8_6(I)
#define MASK_TRAP8(I) ((I) & 0xff)

#define MASK_N(I) ((I) >> 0xb & 0x1) // I[11]
#define MASK_Z(I) ((I) >> 0xa & 0x1) // I[10]
#define MASK_P(I) ((I) >> 0x9 & 0x1) // I[9]

#define MASK_OFF6(I) ((I) & 0x003f)  // I[5:0]
#define MASK_OFF9(I) ((I) & 0x01ff)  // I[8:0]
#define MASK_OFF11(I) ((I) & 0x07ff) // I[10:0]

#define MASK_IMM5(I) ((I) & 0x001f) // I[4:0]

