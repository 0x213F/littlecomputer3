/*
 * `mem.c` defines the LC-3 memory map
 */

#include <stdint.h>
#include "mem.h"

uint16_t *trp_vect_tbl;
uint16_t trp_vect_tbl_limit = 0x00ff;

uint16_t *int_vect_tbl;
uint16_t int_vect_tbl_limit = 0x00ff;

uint16_t *sup_stack;
uint16_t sup_stack_limit = 0x2dff;

uint16_t *usr_stack;
uint16_t sup_stack_limit = 0xcdff;

uint16_t *io_dev;
uint16_t io_dev_limit = 0x01ff;

