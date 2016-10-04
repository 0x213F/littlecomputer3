/*

function reg_st(reg, value);
function reg_ld(reg);

////////////////////////////////////////

function binary_to_decimal(bin);
function decimal_to_binary(dec);
function hex_to_binary(hex);
function binary_to_hex(bin);

////////////////////////////////////////

function adder(v1, v2);
function twos(v1);
function sext(v);

*/

function reg_st(reg, value) {
  switch (reg) {
    case "000":
      r0 = value;
      break;
    case "001":
      r1 = value;
      break;
    case "010":
      r2 = value;
      break;
    case "011":
      r3 = value;
      break;
    case "100":
      r4 = value;
      break;
    case "101":
      r5 = value;
      break;
    case "110":
      r6 = value;
      break;
    case "111":
      r7 = value;
      break;
    default:
      update("error");
  }
}

function reg_ld(reg) {
  switch (reg) {
    case "000":
      return r0;
      break;
    case "001":
      return r1;
      break;
    case "010":
      return r2;
      break;
    case "011":
      return r3;
      break;
    case "100":
      return r4;
      break;
    case "101":
      return r5;
      break;
    case "110":
      return r6;
      break;
    case "111":
      return r7;
      break;
    default:
      update("error");
  }
}

////////////////////////////////////////

function binary_to_decimal(bin) {
  var res = 0, len = bin.length, fac = 0;
  if(bin.charAt(0)=="0") {
    for( x=0 ; x<len ; x++ ) {
      if(bin.charAt(len-x-1)=="1") {
        res += 1*Math.pow(2,fac);
      }
      fac++;
    }
  } else {
    var res = 0, len = bin.length, fac = 0;
    for( x=0 ; x<len-1 ; x++ ) {
      if(bin.charAt(len-x-1)=="1") {
        res += 1*Math.pow(2,fac);
      }
      fac++;
    }
    if(bin.charAt(0)=="1") {
      res -= Math.pow(2,len-1);
    }
    return res;
  }
  return res;
}

function decimal_to_binary(dec) {
  if(dec!=NaN) dec = dec.toString();

  // TODO: correct overflow value
  // NOTE: this probably is not an issue with LC-3 implementation

  var res = "0000000000000000", fac = 15;
  if(dec>=0) {
    for ( x=0 ; x<16 ; x++ ) {
      if(dec-Math.pow(2,fac)>=0){
        res = res.replaceAt(x, "1");
        dec -= Math.pow(2,fac);
      }
      fac--;
    }
  } else {
    var neg = -65536;
    fac = 15;
    res = res.replaceAt(0, "1");
    for ( x=0 ; x<16 ; x++ ) {
      if(neg+Math.pow(2,fac)<=dec){
        res = res.replaceAt(x, "1");
        neg += Math.pow(2,fac);
      }
      fac--;
    }
  }
  return res;
}

function hex_to_binary(hex) {
  // format x123456789
  var len = hex.length;
  var res = new String();
  for( i=0 ; i<hex.length ; i++) {
    if(hex[i]=="x"||hex[i]=="X") continue;
    switch (hex[i]) {
      case "0":
        res += "0000";
        break;
      case "1":
        res += "0001";
        break;
      case "2":
        res += "0010";
        break;
      case "3":
        res += "0011";
        break;
      case "4":
        res += "0100";
        break;
      case "5":
        res += "0101";
        break;
      case "6":
        res += "0110";
        break;
      case "7":
        res += "0111";
        break;
      case "8":
        res += "1000";
        break;
      case "9":
        res += "1001";
        break;
      case "a":
        res += "1010";
        break;
      case "A":
        res += "1010";
        break;
      case "b":
        res += "1011";
        break;
      case "B":
        res += "1011";
        break;
      case "c":
        res += "1100";
        break;
      case "C":
        res += "1100";
        break;
      case "d":
        res += "1101";
        break;
      case "D":
        res += "1101";
        break;
      case "e":
        res += "11110";
        break;
      case "E":
        res += "1110";
        break;
      case "f":
        res += "1111";
        break;
      case "F":
        res += "1111";
        break;
      case ";":
        return res;
        break;
      default:
        update("error");
    }
  }
  return res;
}

function binary_to_hex(bin) {
  var hex = [
    bin.substr(0,4),
    bin.substr(4,4),
    bin.substr(8,4),
    bin.substr(12,4)
  ];
  var i = 0;
  var res = "";
  while(i<4) {
    switch (hex[i]) {
      case "0000":
        res += "0";
        break;
      case "0001":
        res += "1";
        break;
      case "0010":
        res += "2";
        break;
      case "0011":
        res += "3";
        break;
      case "0100":
        res += "4";
        break;
      case "0101":
        res += "5";
        break;
      case "0110":
        res += "6";
        break;
      case "0111":
        res += "7";
        break;
      case "1000":
        res += "8";
        break;
      case "1001":
        res += "9";
        break;
      case "1010":
        res += "A";
        break;
      case "1011":
        res += "B";
        break;
      case "1100":
        res += "C";
        break;
      case "1101":
        res += "D";
        break;
      case "1110":
        res += "E";
        break;
      case "1111":
        res += "F";
        break;
      default:
    }
    i++;
  }
  return res;
}

////////////////////////////////////////

function adder(v1, v2) {
  var c = "0", res = "0000000000000000", x = 15;
  while(x >= 0) {
    if( c == "0" ) {
      if       ( v1.charAt(x) == "1" && v2.charAt(x) == "1" ) {
        res = res.replaceAt(x, "0");
        c = "1";
      } else if( v1.charAt(x) == "0" && v2.charAt(x) == "0" ) {
        res = res.replaceAt(x, "0");
        c = "0";
      } else if( v1.charAt(x) == "0" && v2.charAt(x) == "1" ) {
        res = res.replaceAt(x, "1");
        c = "0";
      } else if( v1.charAt(x) == "1" && v2.charAt(x) == "0" ) {
        res = res.replaceAt(x, "1");
        c = "0";
      }
    } else {
      if       ( v1.charAt(x) == "1" && v2.charAt(x) == "1" ) {
        res = res.replaceAt(x, "1");
        c = "1";
      } else if( v1.charAt(x) == "0" && v2.charAt(x) == "0" ) {
        res = res.replaceAt(x, "1");
        c = "0";
      } else if( v1.charAt(x) == "0" && v2.charAt(x) == "1" ) {
        res = res.replaceAt(x, "0");
        c = "1";
      } else if( v1.charAt(x) == "1" && v2.charAt(x) == "0" ) {
        res = res.replaceAt(x, "0");
        c = "1";
      }
    }
    x--;
  }
  return res;
}

function twos(v1) {
  for( x=0 ; x<16 ; x++ ) {
    if( v1.charAt(x)=="0" ) {
      v1 = v1.replaceAt(x, "1");
    } else {
      v1 = v1.replaceAt(x, "0");
    }
  }
  v1 = adder(v1,"0000000000000001");
  return v1;
}

function sext(v) {
  var res;
  if( v.charAt(0)=="1" ) {
    res = "1111111111111111";
  } else {
    res = "0000000000000000";
  }
  for(x=0;x<v.length;x++) {
    res = res.replaceAt(15-x, v.charAt(v.length-x-1));
  }
  return res;
}

////////////////////////////////////////

function binary_to_assembly_2(inst) {
  var temp = inst.substr(0,4);
  switch (temp) {
    case "0001":
      return "ADD";
      break;
    case "0101":
      return "AND";
      break;
    case "1001":
      return "NOT";
      break;
    case "0000":
      return "BR";
      break;
    case "1100":
      return "JMP";
      break;
    case "0100":
      return "JSR";
      break;
    case "1100":
      return "RET";
      break;
    case "0010":
      return "LD";
      break;
    case "1010":
      return "LDI";
      break;
    case "0110":
      return "LDR";
      break;
    case "1110":
      return "LEA";
      break;
    case "0011":
      return "ST";
      break;
    case "1011":
      return "STI";
      break;
    case "0111":
      return "STR";
      break;
    case "1111":
      return "TRAP";
      break;
    case "1000":
      return "RTI";
      break;
    default:
      return "~";
      break;
  }
}
