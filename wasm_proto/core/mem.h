/*
 * `mem.h` declares the LC-3 memory map
 */

#include <stdint.h>

extern uint16_t *trp_vect_tbl;
extern uint16_t trp_vect_tbl_limit;

extern uint16_t *int_vect_tbl;
extern uint16_t int_vect_tbl_limit;

extern uint16_t *sup_stack;
extern uint16_t sup_stack_limit;

extern uint16_t *usr_stack;
extern uint16_t sup_stack_limit;

extern uint16_t *io_dev;
extern uint16_t io_dev_limit;

