//
// Joshua Schultheiss 2016
//

var ping = new Audio("boop.wav");

// These are our eight registers used throughout the LC-3
var r0 = r1 = r2 = r3 = r4 = r5 = r6 = r7 = "0000000000000000";

// This is the program counter
var pc;

// This is the CC storing the value to be compared for the BR subroutine
var cc;

// A temporary solution for infinite loop programs
var oops = 0;

// A dictionary array holding the binary value of the program.
// i.e. storage["0011000000000000"] would hold the first subroutine in a program after .ORIG x3000
var storage = {};
storage["1111111000000000"] = "0000000000000000"; // KBSR
storage["1111111000000010"] = undefined; // KBDR
storage["1111111000000100"] = "0000000000000000"; // DSR
storage["1111111000000110"] = "0000000000000000"; // DDR
storage["1111111111111110"] = "1000000000000000"; // MCR (CE)

// A dictionary array storing the memory address associated with a label
// i.e. a label LOOP placed after the first subroutine would be called by labels["LOOP"] == "0011000000000001"
var labels = {};

// stores simplified code for simplified debugging for the user
var code = {};

// the starting location of the dump table
var dump_location;
var orig_dump_location;
var dump_type = "#hex";

// because JS and ASCII mismatch
var thirteen = 10;

// linked list reverser
var linked_list = null;

// type of program running
var program = undefined // or exec

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// a temporary variable used for KBSR
// TODO: remove this (low priority)
var polling = false;

// a temporary variable to display the value in the IR
// TODO: just change this to IR (low priority)
var ir_ui = "0000000000000000";
