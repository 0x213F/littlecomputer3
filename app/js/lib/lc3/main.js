const NUMBER_OF_REGISTERS = 8;

var LC3 = function(node) {

  this.registers = new Uint16Array(NUMBER_OF_REGISTERS);
  this.storage = {}; // TODO is this the right way to store this value?
  this.pc = 0x0000; // TODO is this the right way to store this value?
  this.ir = 0x0000; // TODO is this the right way to store this value?

  this.run = function() {
    // TODO runs the program
  }

  this.destroy = function() {
    // TODO destroys the LC3 instance
  }

  const init = function(id) {
    // TODO intializes the LC3 instance
    //
    // 1: setup CodeMirror
    // 2: setup debugger
  }

  init(node);

};
