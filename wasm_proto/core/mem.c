/*
 * `mem.c` defines the LC-3 memory map
 */

#include "uint.h"
#include "mem.h"

uint *trp_vect_tbl;
uint trp_vect_tbl_limit = 0x00ff;

uint *int_vect_tbl;
uint int_vect_tbl_limit = 0x00ff;

uint *sup_stack;
uint sup_stack_limit = 0x2dff;

uint *usr_stack;
uint sup_stack_limit = 0xcdff;

uint *io_dev;
uint io_dev_limit = 0x01ff;

