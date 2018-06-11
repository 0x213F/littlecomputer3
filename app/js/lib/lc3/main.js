const NUMBER_OF_REGISTERS = 8;

var LC3 = function() {

  this.registers = new Uint16Array(NUMBER_OF_REGISTERS);
  this.storage = {}; // TODO
  this.pc = 0x0000; // TODO
  this.ir = 0x0000; // TODO

  this.init = function(id) {
    // TODO
    //
    // 1: setup CodeMirror
    // 2: setup debugger
  }

  this.destroy = function() {
    // TODO
  }

};
