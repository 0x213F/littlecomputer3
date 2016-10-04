//
// Joshua Schultheiss 2016
//

//////////////////////////////////////////////////////////////////////////////////////////////
//
// ADD subroutine
//
// This add subroutine adds two numbers. Depending on the select bit, this can either add two
// values stored in source registers or add a value stored in a source regsiter and a 5-bit
// value 2's compliment value. The result is stored in the destination register.
//
// DR <- SR1 + SR2
// DR <- SR1 + NUM
//
function add(inst) {
  var func = inst.charAt(10), dr = inst.substr(4,3), sr1 = reg_ld(inst.substr(7,3)), sr2;
  var stale = reg_ld(dr), scc = cc;
  cc = dr;
  if( func == "0" ) {
    sr2 = reg_ld(inst.substr(13,3));
  } else {
    sr2 = decimal_to_binary(binary_to_decimal(inst.substr(11,5)));
  }
  var c = "0", res = "0000000000000000", x = 15;
  while(x >= 0) {
    if( c == "0" ) {
      if       ( sr1.charAt(x) == "1" && sr2.charAt(x) == "1" ) {
        res = res.replaceAt(x, "0");
        c = "1";
      } else if( sr1.charAt(x) == "0" && sr2.charAt(x) == "0" ) {
        res = res.replaceAt(x, "0");
        c = "0";
      } else if( sr1.charAt(x) == "0" && sr2.charAt(x) == "1" ) {
        res = res.replaceAt(x, "1");
        c = "0";
      } else if( sr1.charAt(x) == "1" && sr2.charAt(x) == "0" ) {
        res = res.replaceAt(x, "1");
        c = "0";
      }
    } else {
      if       ( sr1.charAt(x) == "1" && sr2.charAt(x) == "1" ) {
        res = res.replaceAt(x, "1");
        c = "1";
      } else if( sr1.charAt(x) == "0" && sr2.charAt(x) == "0" ) {
        res = res.replaceAt(x, "1");
        c = "0";
      } else if( sr1.charAt(x) == "0" && sr2.charAt(x) == "1" ) {
        res = res.replaceAt(x, "0");
        c = "1";
      } else if( sr1.charAt(x) == "1" && sr2.charAt(x) == "0" ) {
        res = res.replaceAt(x, "0");
        c = "1";
      }
    }
    x--;
  }
  reg_st(dr, res);
  return([undefined, undefined, dr, stale, scc, undefined]);
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// AND subroutine
//
// This and subroutine logically ands two numbers. Depending on the select bit, this can
// either logically and two values stored in source registers or logically and a value stored
// in a source regsiter and a 5-bit value 2's compliment value. The result is stored in the
// destination register.
//
// DR <- SR1 & SR2
// DR <- SR1 & NUM
//
function and(inst) {
  var func = inst.charAt(10), dr = inst.substr(4,3), sr1 = inst.substr(7,3);
  var stale = reg_ld(dr), scc = cc;
  cc = dr;
  if( func == "0" ) {
    var sr2 = inst.substr(13,3), v1 = reg_ld(sr1), v2 = reg_ld(sr2), res = "0000000000000000";
    for( x=0 ; x<v1.length ; x++ ) {
      if( v1.charAt(x)=="1"&&v2.charAt(x)=="1" ) {
        res = res.replaceAt(x, "1");
      }
    }
    reg_st(dr,res);
  } else {
    var res = "0000000000000000", n = inst.substr(11,5), v1 = reg_ld(sr1);
    n = decimal_to_binary(binary_to_decimal(n));
    for( x=15 ; x>=0 ; x-- ) {
      if( v1.charAt(x)=="1"&&n.charAt(x)=="1" ) {
        res = res.replaceAt(x, "1");
      }
    }
    reg_st(dr,res);
  }
  return([undefined, undefined, dr, stale, scc, undefined]);
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// NOT subroutine
//
// The not subroutine takes a value in a source register and stores the logical not of the
// value and stores it in the desination register.
//
// DR <- ~SR1
//
function not(inst) {
  var dr = inst.substr(4,3), sr1 = inst.substr(7,3);
  var stale = reg_ld(dr), scc = cc;
  cc = dr;
  var res = reg_ld(sr1);
  for( x=0 ; x<16 ; x++ ) {
    if( res.charAt(x)=="0" ) {
      res = res.replaceAt(x, "1");
    } else {
      res = res.replaceAt(x, "0");
    }
  }
  reg_st(dr,res);
  return([undefined, undefined, dr, stale, scc, undefined]);
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// BR subroutine
//
// This branch subroutine branches to the respective label based off the select bits nzp
// compared to the value stored in the CC.
//
// BRnzp LABEL
//
function br(inst) {

    // TODO: error for if before x3000 or before

  var reg = reg_ld(cc);
  if(reg.charAt(0)=="1"&&"1"==inst.charAt(4)) {
    inst = inst.substr(7,9);
    pc = adder(sext(inst),pc);
    return([undefined, undefined, undefined, undefined, false, undefined]);
  } else if(inst.charAt(5)=="1"||inst.charAt(6)=="1") {
    var temp = 0;
    for( s=1 ; s<16 ; s++ ) {
      if( reg.charAt(s)=="1" ) {
        temp++;
      }
    }
    if(temp==0&&inst.charAt(5)=="1"&&reg.charAt(0)=="0") {
      inst = inst.substr(7,9);
      pc = adder(sext(inst),pc);
    } else if(temp>0&&inst.charAt(6)=="1"&&reg.charAt(0)=="0") {
      inst = inst.substr(7,9);
      pc = adder(sext(inst),pc);
    }
  }
  return([undefined, undefined, undefined, undefined, undefined, undefined]);
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// ST subroutine
//
// This and subroutine logically ands two numbers. Depending on the select bit, this can
// either logically and two values stored in source registers or logically and a value stored
// in a source regsiter and a 5-bit value 2's compliment value. The result is stored in the
// destination register.
//
// DR <- SR1 & SR2
// DR <- SR1 & NUM
//
function st(inst) {
  var sr = inst.substr(4,3), pc_off = inst.substr(7,9);
  var data = reg_ld(sr);
  var mem = adder(pc, sext(pc_off));
  var stale = storage[mem];
  storage[mem] = data;
  return([mem, stale, undefined, undefined, undefined, undefined]);
}

// FINISHED TESTED
function ld(inst) {
  var dr = inst.substr(4,3), pc_off = inst.substr(7,9);
  var stale = reg_ld(dr), scc = cc;
  cc = dr;
  var mem = adder(pc, sext(pc_off));
  if(storage[mem]!=undefined) {
    var data = storage[mem];
    reg_st(dr, data);
  } else {
    update("error");
  }
  return([undefined, undefined, dr, stale, scc, undefined]);
}

// FINISHED
function str(inst) {
  var sr = inst.substr(4,3), br = inst.substr(7,3), pc_off = inst.substr(10,6);
  var data = reg_ld(sr), br_off = reg_ld(br);
  var mem = adder(sext(br_off), sext(pc_off));
  var stale = storage[mem];
  storage[mem] = data;
  return([mem, stale, undefined, undefined, undefined, undefined]);
}

// FINISHED
function ldr(inst) {
  var dr = inst.substr(4,3), br = inst.substr(7,3), pc_off = inst.substr(10,6);
  var stale = reg_ld(dr), scc = cc;
  cc = dr;
  var br_off = reg_ld(br);
  var mem = adder(sext(br_off), sext(pc_off));
  if(storage[mem]!=undefined) {
    reg_st(dr, storage[mem]);
  } else {
    // ERROR
  }
  return([undefined, undefined, dr, stale, scc, undefined]);
}

// FINISHED
function jmp(inst) {
  var br = inst.substr(7,3);
  var data = adder(reg_ld(br),"1111111111111111");
  r7 = adder(pc,"0000000000000001");
  pc = data;
  return([undefined, undefined, undefined, undefined, undefined, undefined]);
}

// FINISHED
function jsr(inst) {
  console.log("JSR");
  if( inst.charAt(4) == "1" ) {
    var off = inst.substr(5,11);
    r7 = adder(pc,"0000000000000001");
    pc = adder(pc, sext(off));
  } else {
    var br = inst.substr(7,3);
    var data = reg_ld(br);
    r7 = adder(pc,"0000000000000001");
    pc = data;
  }
  return([undefined, undefined, undefined, undefined, undefined, undefined]);
}

// FINISHED TESTED
function ldi(inst) {
  var off = adder(pc, sext(inst.substr(7,11)));
  var dr = inst.substr(4,3);
  var stale = reg_ld(dr), scc = cc;
  cc = dr;
  reg_st(dr, storage[storage[off]]);
  return([undefined, undefined, dr, stale, scc, undefined]);
}

// FINISHED
function sti(inst) {
  var off = adder(pc, sext(inst.substr(7,11)));
  var sr = inst.substr(4,3);
  var stale = storage[storage[off]];
  storage[storage[off]] = sext(reg_ld(sr));
  return([storage[off], stale, undefined, undefined, undefined, undefined]);
}

// FINISHED
function lea(inst) {
  var off = adder(pc, sext(inst.substr(7,11)));
  var dr = inst.substr(4,3);
  var stale = reg_ld(dr), scc = cc;
  cc = dr;
  reg_st(dr, off);
  return([undefined, undefined, dr, stale, scc, undefined]);
}

// FINISHED
function trap_getc(v) {
  if(program == undefined) {
    polling = false;
    return;
  }
  if(polling==false) {
    polling = true;
    storage["1111111000000010"] = undefined;
  }
  //console.log("first", polling);
  if( storage["1111111000000010"]==undefined ) {
    setTimeout(function(){ trap_getc(); }, 1);    // TODO make this while() loop recusion
    return;
  }
  r0 = storage["1111111000000010"];
  polling = false;
  if(program=="play") exec();
}

// TODO kinda skips DDR/DSR - low priority
function trap_out() {
  if(binary_to_decimal(reg_ld("000"))==13||binary_to_decimal(reg_ld("000"))==10) {
    document.getElementById("terminal").innerHTML += "<br>";
    return 4;
  } else if(binary_to_decimal(reg_ld("000"))==7) {
    ping.play();
    return undefined;
  } else {
    document.getElementById("terminal").innerHTML += String.fromCharCode(binary_to_decimal(reg_ld("000")));
    return 1;
  }
}

// i think this is done
function trap_puts() {
  var loc = r0;
  var val = 0;
  while(storage[loc]!=undefined) {
    if(storage[loc]=="0000000000000000") return val;
    if(binary_to_decimal(storage[loc])==13||binary_to_decimal(storage[loc])==10) {
      document.getElementById("terminal").innerHTML += "<br>";
      val += 4;
    } else if(binary_to_decimal(reg_ld("000"))==7) {
      ping.play();
    } else {
      document.getElementById("terminal").innerHTML += String.fromCharCode(binary_to_decimal(storage[loc]));
      val++;
    }
    loc = adder(loc, "0000000000000001");
  }
  return val;
}

// FINISHED

function trap_in(v) {
  if(program == undefined) {
    polling = false;
    return;
  }
  if(polling==false) {
    console.log("in");
    document.getElementById("terminal").innerHTML += "Input a character> ";
    polling = true;
    storage["1111111000000010"] = undefined;
  }
  //console.log("first", polling);
  if( storage["1111111000000010"]==undefined ) {
    setTimeout(function(){ trap_in(); }, 1);    // TODO make this while() loop recusion
    return;
  }
  r0 = storage["1111111000000010"];
  polling = false;
  trap_out();
  document.getElementById("terminal").innerHTML += "<br>";
  if(program=="play") exec();
}

function trap_putsp() {
  var loc = r0;
  var ret = 0;
  while(storage[loc]!=undefined) {
    if(storage[loc]=="0000000000000000") return ret;
    var val = "0000000000000000";
    val = val.replaceAt(8,storage[loc].substr(8,8));
    console.log(val);
    if(binary_to_decimal(val)==13||binary_to_decimal(val)==10) {
      document.getElementById("terminal").innerHTML += "<br>";
      ret += 4;
    } else if(binary_to_decimal(reg_ld("000"))==7) {
      ping.play();
    } else {
      document.getElementById("terminal").innerHTML += String.fromCharCode(binary_to_decimal(val));
      ret++;
    }
    val = val.replaceAt(8,storage[loc].substr(0,8));
    console.log(val);
    if(val == "0000000000000000") {
      // nothing
    } else if(binary_to_decimal(val)==13||binary_to_decimal(val)==10) {
      document.getElementById("terminal").innerHTML += "<br>";
      ret +=4;
    } else if(binary_to_decimal(reg_ld("000"))==7) {
      ping.play();
    } else {
      document.getElementById("terminal").innerHTML += String.fromCharCode(binary_to_decimal(val));
      ret++;
    }
    loc = adder(loc, "0000000000000001");
  }
  return ret;
}

// TODO low priority
function trap_halt() {
  return;
}

// TODO
function trap(inst) {
  inst = inst.substr(8,15);
  var val = undefined;
  if(inst=="00100000") {
    update();
    trap_getc();
  }
  if(inst=="00100001") val = trap_out();
  if(inst=="00100010") val = trap_puts();
  if(inst=="00100011") {
    update();
    trap_in();
    val = 24;
  }
  if(inst=="00100100") trap_putsp();
  if(inst=="00100101") trap_halt();
  return([undefined, undefined, undefined, undefined,  undefined, val]); // TODO delete char
}

// TODO low priority
function rti(inst) {
  return([undefined, undefined, undefined, undefined,  undefined, undefined]);
}

// TODO low priority
function undefined(inst) {
  return([undefined, undefined, undefined, undefined,  undefined, undefined]);
}
