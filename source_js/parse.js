//
// Joshua Schultheiss 2016
//

/* FOR MACHINE */

function valid_binary(inst) {
  inst = inst.replace(/\s/g,''); // removes all spaces
  if(inst.length<16) return false;
  for(i=0;i<16;i++) {
    if(inst.charAt(i)!="0"&&inst.charAt(i)!="1") return false;
  }
  if(inst.length!=16) {
    if(inst.charAt(16)!=";") return false;
  }
  return true;
}

function valid_binary_comment(inst) {
  inst = inst.replace(/\s/g,''); // removes all spaces
  if(inst.length==0) return true;
  if(inst.charAt(0)==";") return true;
  return false;
}

function trim_binary(inst) {
  inst = inst.replace(/\s/g,''); // removes all spaces
  var res = "0000000000000000";
  for(i=0;i<16;i++) {
    if(inst.charAt(i)=="1") res = res.replaceAt(i, "1");
  }
  return res;
}

/* FOR ASSEMBLY */

function valid_opcode(opcode) {
  if(opcode==undefined) return false;
  opcode = opcode.toUpperCase(); // redundant possibly
  if(opcode=="BR"||opcode=="ST"||opcode=="LD"||opcode=="IN") return true;
  if(opcode=="ADD"||opcode=="JSR"||opcode=="AND"||opcode=="LDR"||opcode=="STR"||opcode=="RTI"||opcode=="NOT"||opcode=="LDI"||opcode=="STI"||opcode=="JMP"||opcode=="LEA"||opcode=="OUT"||opcode=="BRN"||opcode=="BRZ"||opcode=="BRP"||opcode=="RET") return true;
  if(opcode=="TRAP"||opcode==".END"||opcode=="HALT"||opcode=="GETC"||opcode=="PUTS"||opcode=="BRNZ"||opcode=="BRNP"||opcode=="BRZP"||opcode=="JSRR") return true;
  if(opcode==".ORIG"||opcode==".FILL"||opcode==".BLKW"||opcode=="BRNZP"||opcode=="PUTSP") return true;
  if(opcode==".STRINGZ") return true;
  if(opcode.length<3) return false;
  var l3 = opcode.substr(0,3);
  if(l3=="IN;") return true;
  if(opcode.length<4) return false;
  var l4 = opcode.substr(0,4);
  if(l4=="OUT;"||l4=="RET;") return true;
  if(opcode.length<5) return false;
  var l5 = opcode.substr(0,5);
  if(l5==".END;"||l5=="HALT;"||l5=="GETC;"||l5=="PUTS;") return true;
  return false;
}

function valid_comment(comment) {
  if(comment==undefined) return true;
  comment = comment.replace(/\s/g,''); // removes all spaces
  comment = comment.toUpperCase();
  if(comment.charAt(0)=="") return true;
  if(comment.charAt(0)==";") return true;
  return false;
}

function valid_label(label) {
  if(label==undefined) return false;
  label = label.toUpperCase();
  if(valid_opcode(label)) return false;
  if(label.charAt(0)==";") return false;
  return true;
}

// returns binary representation of register
function reg_binary(reg) {
  reg = reg.toUpperCase(); // redundant possibly
  reg = reg.substr(0,2);
  switch (reg) {
    case "R0":
      return "000";
    case "R1":
      return "001";
    case "R2":
      return "010";
    case "R3":
      return "011";
    case "R4":
      return "100";
    case "R5":
      return "101";
    case "R6":
      return "110";
    case "R7":
      return "111";
    default:
      update("error");
  }
}

function binary_reg(reg) {
  switch (reg) {
    case "000":
      return "R0";
    case "001":
      return "R1";
    case "010":
      return "R2";
    case "011":
      return "R3";
    case "100":
      return "R4";
    case "101":
      return "R5";
    case "110":
      return "R6";
    case "111":
      return "R7";
    default:
      update("error");
  }
}

// returns label value
function get_label(str) {
  if(str.indexOf(";")>-1) {
    str = str.substring(0, str.indexOf(";"));
  }
  return str;
}

function clean_array(arr) {
  var pos = arr.indexOf("");
  if(pos==-1) return arr;
  arr.splice(pos, 1);
  return clean_array(arr);
}

/* loads kbdr with latest value */

function binary_to_assembly(inst) {
  var func = inst.substr(0,4);
  switch (func) {
    case "0001":
      data = add(inst);
      break;
    case "0101":
      data = and(inst);
      break;
    case "1001":
      data = not(inst);
      break;
    case "0000":
      data = br(inst);
      break;
    case "1100":
      data = jmp(inst);
      break;
    case "0100":
      data = jsr(inst);
      break;
    case "1100":
      data = ret(inst);
      break;
    case "0010":
      data = ld(inst);
      break;
    case "1010":
      data = ldi(inst);
      break;
    case "0110":
      data = ldr(inst);
      break;
    case "1110":
      data = lea(inst);
      break;
    case "0011":
      data = st(inst);
      break;
    case "1011":
      data = sti(inst);
      break;
    case "0111":
      data = str(inst);
      break;
    case "1111":
      data = trap(inst);
      break;
    case "1000":
      data = rti(inst);
      break;
    default:
      break;
  }
}

function string_reg(x) {
  switch (x) {
    case "000": return "R0";
    case "001": return "R1";
    case "010": return "R2";
    case "011": return "R3";
    case "100": return "R4";
    case "101": return "R5";
    case "110": return "R6";
    case "111": return "R7";
    default: return "will never reach this";
  }
}

/* from http://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript */
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}
