function RegisterSet(num_gpr) {
  if(num_gpr === undefined) {
    num_gpr = 8
  } else if(num_gpr > 8 || num_gpr < 0) {
    return null;
  }

  if(!(this instanceof RegisterSet)) {
    return new RegisterSet(num_gpr);
  }

  this.gp_reg_count = num_gpr;

  this.register_data = new Uint16Array(
    this.sys_reg_count +
    this.io_reg_count +
    this.gp_reg_count
  );

  // Initialize GPRs.
  let idx = this.gpr_offset, reg = 0;
  while(num_gpr-- > 0) {
    this.register_data[
      this.register_map["R" + (reg++).toString()] = idx++ // map name to index
    ] = 0; // initialize value at index to zero
  }
}

RegisterSet.prototype.register_map = {
  // System registers.
  "PC": 0,
  "IR": 1,
  "CC": 2,

  // I/O registers.
  "KBSR": 3,
  "KBDR": 4,
  "DSR":  5,
  "DDR":  6,
  "MCR":  7,
};

RegisterSet.prototype.sys_reg_count = 3; // PC, IR, CC
RegisterSet.prototype.io_reg_count = 5; // see table A.3
RegisterSet.prototype.gp_reg_count = 0;

// Index of first GPR in register_data.
RegisterSet.prototype.gpr_offset = RegisterSet.prototype.sys_reg_count +
                                   RegisterSet.prototype.io_reg_count;

// Returns index mapped to by register or null if invalid register name.
RegisterSet.prototype.lookup = function(reg) {
  if(typeof reg === "number" && reg < this.gp_reg_count && reg >= 0) {
    return this.gpr_offset + reg;
  }
  if(typeof reg === "string" && reg in this.register_map) {
    return this.register_map[reg];
  }
  return null;
};

// Returns value stored in register or null if invalid register name.
RegisterSet.prototype.get = function(reg) {
  let r = this.lookup(reg);
  if(r != null) {
    return this.register_data[r];
  }
  return null;
};

RegisterSet.prototype.set = function(reg, val) {
  let r = this.lookup(reg);
  if(r != null) {
    this.register_data[r] = val;
  }
};

// Returns a closure that returns the value of a predetermined register.
RegisterSet.prototype.getter = function(reg) {
  let that = this;
  return function() {
    return that.get(reg);
  };
};

// Returns a closure that can be called with an argument to set the value of a
// predetermined register to said argument.
RegisterSet.prototype.setter = function(reg) {
  let that = this;
  return function(val) {
    that.set(reg, val);
  };
};
