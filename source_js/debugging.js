function test_func() {
  for(i in storage) {
    code[i] = binary_to_assembly(storage[i], i);
  }
}

function binary_to_assembly(bin, pc_pass) {
  // assumed to be a 16 char long string with 1s and 0s
  var s = bin.substr(0,4);
  var res = "";
  switch (s) {
    case "0001":
      res += "ADD ";
      res += binary_reg(bin.substr(4,3)) + ", " + binary_reg(bin.substr(7,3)) + ", ";
      if(bin.charAt(10)=="0") {
        res += binary_reg(bin.substr(13,3));
      } else {
        res += "#" + binary_to_decimal(bin.substr(11,5));
      }
      break;
    case "0101":
      res += "AND ";
      res += binary_reg(bin.substr(4,3)) + ", " + binary_reg(bin.substr(7,3)) + ", ";
      if(bin.charAt(10)=="0") {
        res += binary_reg(bin.substr(13,3));
      } else {
        res += "#" + binary_to_decimal(bin.substr(11,5));
      }
      break;
    case "1001":
      res += "NOT ";
      res += binary_reg(bin.substr(4,3)) + ", " + binary_reg(bin.substr(7,3)) + ", ";
      break;
    case "0000":
      res += "BR";
      if(bin.charAt(4)=="1") res += "n";
      if(bin.charAt(5)=="1") res += "z";
      if(bin.charAt(6)=="1") res += "p";
      console.log(adder(sext(bin.substr(7,9)),pc_pass));
      res += " " + labels[adder(sext(bin.substr(7,9)),pc_pass)];
      break;
    case "1100":
      if(binary_reg(bin.substr(7,3))=="R7") { res += "RET"; break; }
      res += "JMP ";
      res += binary_reg(bin.substr(7,3));
      break;
    case "0100":
      if(binary_reg(bin.substr(7,3))=="R7") { res += "RET"; break; }
      res += "JSR ";
      if(bin.charAt(4)=="0") {
        res += binary_reg(bin.substr(7,3));
      }
      break;
    case "1100":
      ret(inst);
      break;
    case "0010":
      ld(inst);
      break;
    case "1010":
      ldi(inst);
      break;
    case "0110":
      ldr(inst);
      break;
    case "1110":
      lea(inst);
      break;
    case "0011":
      //st(inst);
      return;
      break;
    case "1011":
      sti(inst);
      break;
    case "0111":
      str(inst);
      break;
    case "1111":
      //trap(inst);
      return;
      break;
    case "1000":
      rti(inst);
      break;
    default:
      break;
  }
  res += ";";
  console.log(res);
  return;
}
