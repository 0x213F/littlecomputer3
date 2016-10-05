//
// Joshua Schultheiss 2016
//

//////////////////////////////////////////////////////////////////////////////////////////////
//
// Pass One Compile
//
// TODO: Needs another look
// TODO: Soham's code example doesn't compile because of spacing issues
//

function is_assembly() {
  var set_pc = false, pc_temp, temp = 0;
  var text = editor.getValue();
  var lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    text = lines[i].trim();
    var parts = text.split(/\s/g);
    parts = clean_array(parts);
    if(parts[0]==undefined) continue;
    else if (parts[0].charAt(0)==";") continue;
    else if (parts[0].charAt(0)==".") return true;
    return false;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// Pass One Compile
//
// TODO: Needs another look
// TODO: Soham's code example doesn't compile because of spacing issues
//

function pass_one() {
  $('#dump_loc').prop("disabled", false);
  var set_pc = false, pc_temp, temp = 0;
  var text = editor.getValue();
  var lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    text = lines[i].trim();
    var parts = text.split(/\s/g);
    parts = clean_array(parts);
    //console.log(parts[1]);
    if(parts[1]!=undefined) {
    if(parts[1]==".STRINGZ") {
      // this is kinda bad but it should work
      if(valid_label(parts[0])) {
        var name = get_label(parts[0]).toUpperCase();
        labels[name] = pc_temp;
      }
      var x=0, step=1, ch;
      //console.log("UUU" + binary_to_decimal(pc_temp));
      for( x ; x<lines[i].length ; x++) {
        if((lines[i].charAt(x)==" "||lines[i].charAt(x)=="\t") && step==1) {
          step = 2;
          continue;
        } else if((lines[i].charAt(x)!=" "&&lines[i].charAt(x)!="\t") && step==2) {
          step = 3;
          continue;
        } else if((lines[i].charAt(x)=="'"||lines[i].charAt(x)=="\"") && step==3) {
          //console.log("AAA" + binary_to_decimal(pc_temp));
          var ch = lines[i].charAt(x);
          step = 4;
        } else if(step==4) {
          if(lines[i].charAt(x)==ch) break;
          if(lines[i].charAt(x)=="\\") x++;
          //console.log(lines[i].charAt(x));
          pc_temp = adder(pc_temp, "0000000000000001"); // TODO ACUTALY VALUE
        } else continue;
      }
      parts[2] = lines[i].substr(x, lines[i].length);
      //console.log("BBB" + binary_to_decimal(pc_temp));
      pc_temp = adder(pc_temp, "0000000000000001"); // TODO ACUTALY VALUE
      continue;
    } }
    if(set_pc==false) {
      if(valid_opcode(parts[0])) {
        pc_temp = hex_to_binary(parts[1]);
        set_pc = true;
        continue;
      } else if(valid_comment(parts[0])) {
        continue;
      }
      update("error");
      return;
    } else if(valid_comment(parts[0])) {
      continue;
    } else if(valid_label(parts[0])) {
      var name = get_label(parts[0]).toUpperCase();
      labels[name] = pc_temp;
      //console.log(name + " " + pc_temp );
      if(valid_opcode(parts[1])) {
        if(parts[1]==".STRINGZ") {
          var is_quote = parts[2].charAt(0)=="\"";
          for(var x=0 ; x < parts[2].length ; x++) {
            if((parts[2].charAt(x)=="\""&&is_quote) || (parts[2].charAt(x)=="'"&&!is_quote)) break;
            if(parts[2].charAt(x)=="\\") x++;
            pc_temp = adder(pc_temp, "0000000000000001");
          }
        } else if(parts[1]==".BLKW") {
          if(parts[2].charAt(0)=="#") {
            //console.log(binary_to_decimal(decimal_to_binary(parts[2])));
            for(var x=0 ; x < binary_to_decimal(decimal_to_binary(parts[2])) ; x++) {
              pc_temp = adder(pc_temp, "0000000000000001");
              //console.log("tick");
            }
          } else { // hex
            for(var x=0 ; x < binary_to_decimal(hex_to_binary(parts[2])) ; x++) pc_temp = adder(pc_temp, "0000000000000001");
          }
        } else pc_temp = adder(pc_temp, "0000000000000001");
      }
      continue;
    } else if(valid_opcode(parts[0])) {
      pc_temp = adder(pc_temp, "0000000000000001");
      continue;
    }
  }
  console.log("pass one done");
  pass_two();
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// Pass Two Compile
//
// TODO: Needs another look
//
function pass_two() {
  var set_pc = false, pc_temp, temp = 0;
  var text = editor.getValue();
  var lines = text.split('\n');
  for(i in lines) {
    //console.log(i);
    text = lines[i].trim();
    var parts = text.split(/\s/g);
    parts = clean_array(parts);
    if(parts[1]!=undefined) {
    if(parts[1]==".STRINGZ") {
      // this is kinda bad but it should work
      if(valid_label(parts[0])) {
        var name = get_label(parts[0]).toUpperCase();
        labels[name] = pc_temp;
      }
      var x=0, step=1, ch;
      //console.log("UUU" + binary_to_decimal(pc_temp));
      var n=0;
      //console.log(x, lines[i].length);
      for( x ; x<lines[i].length ; x++) {
        if((lines[i].charAt(x)==" "||lines[i].charAt(x)=="\t") && step==1) {
          step = 2;
          continue;
        } else if((lines[i].charAt(x)!=" "&&lines[i].charAt(x)!="\t") && step==2) {
          step = 3;
          continue;
        } else if((lines[i].charAt(x)=="'"||lines[i].charAt(x)=="\"") && step==3) {
          //console.log("AAA" + binary_to_decimal(pc_temp));
          var ch = lines[i].charAt(x);
          step = 4;
        } else if(step==4) {
          if(lines[i].charAt(x)==ch) break;
          if(lines[i].charAt(x)=="\\") {
            x++
            if(lines[i].charAt(x)=="a") storage[pc_temp] = "0000000000000111";
            else if(lines[i].charAt(x)=="b") storage[pc_temp] = "0000000000001000"; // TODO all other escape chars
            else if(lines[i].charAt(x)=="f") storage[pc_temp] = "0000000000001100";
            else if(lines[i].charAt(x)=="n") storage[pc_temp] = "0000000000001010";
            else if(lines[i].charAt(x)=="r") storage[pc_temp] = "0000000000001101";
            else if(lines[i].charAt(x)=="t") storage[pc_temp] = "0000000000001001";
            else if(lines[i].charAt(x)=="v") storage[pc_temp] = "0000000000001011";
            else if(lines[i].charAt(x)=="\\") storage[pc_temp] = "0000000001011100";
            else if(lines[i].charAt(x)=="''") storage[pc_temp] = "0000000000100111";
            else if(lines[i].charAt(x)=="\"") storage[pc_temp] = "0000000000100010";
            else if(lines[i].charAt(x)=="?") storage[pc_temp] = "0000000000111111";
            else storage[pc_temp] = decimal_to_binary(lines[i].charCodeAt(x));//decimal_to_binary(lines[i].charCodeAt(x)); //"0000000100010000";
          } else storage[pc_temp] = decimal_to_binary(lines[i].charCodeAt(x));//decimal_to_binary(lines[i].charCodeAt(x)); //"0000000100010000";
          //console.log(i);                                                       // what the fuck is happening here
          //console.log(decimal_to_binary(lines[i].charCodeAt(x)));
          //console.log(i);                                                       // well now it's working... TODO clean this up
          //storage[pc_temp] = decimal_to_binary(lines[i].charCodeAt(x));//decimal_to_binary(lines[i].charCodeAt(x)); //"0000000100010000";
          pc_temp = adder(pc_temp, "0000000000000001"); // TODO ACUTALY VALUE
        } else continue;
      }
      //console.log(x, lines[i]);
      parts[2] = lines[i].substr(x, lines[i].length);
      //console.log("BBB" + binary_to_decimal(pc_temp));
      storage[pc_temp] = "0000000000000000";//decimal_to_binary(lines[i].charCodeAt(x)); //"0000000100010000";
      pc_temp = adder(pc_temp, "0000000000000001"); // TODO ACUTALY VALUE
      continue;
    } }
    if(set_pc==false) {
      if(valid_comment(parts[0])) continue;
      if(valid_label(parts[0])) {
        update("error");
        return;
      }
      if(valid_opcode(parts[0])) {
        pc_temp = hex_to_binary(parts[1]);
        dump_location = pc_temp;
        orig_dump_location = dump_location;
        pc = adder(pc_temp, "1111111111111111");
        set_pc = true;
        continue;
      }
      update("error");
    } else if(valid_comment(parts[0])) {
     continue;
    } else if(valid_label(parts[0])) {
      if(valid_opcode(parts[1])) {
        if(parts[1]==".STRINGZ") {
          continue;
        } else if(parts[1]==".BLKW") {
          if(parts[2].charAt(0)=="#") {
            for(var x=0 ; x < binary_to_decimal(decimal_to_binary(parts[2])) ; x++) {
              storage[pc_temp] = "0000000000000000";
              pc_temp = adder(pc_temp, "0000000000000001");
            }
          } else { // hex
            for(var x=0 ; x < binary_to_decimal(hex_to_binary(parts[2])) ; x++) {
              storage[pc_temp] = "0000000000000000";
              pc_temp = adder(pc_temp, "0000000000000001");
            }
          }
        } else {
          opcode_parse(parts[1], parts[2], parts[3], parts[4], parts[5], pc_temp);
          pc_temp = adder(pc_temp, "0000000000000001");
        }
      }
      continue;
    } else if(valid_opcode(parts[0])) {
      opcode_parse(parts[0], parts[1], parts[2], parts[3], parts[4], pc_temp);
      pc_temp = adder(pc_temp, "0000000000000001");
      continue;
    }
  }
  is_on = true;
  update("passedtwo");
  console.log("pass two done");

  if(program=="play") {
    console.log("running program");
    exec();
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// Parse Opcodes
//
// TODO: This is probably the thing that is broken
//
function opcode_parse(in1, in2, in3, in4, in5, pc_pass) {
  var str2 = in1.substr(0,2);
  var str3 = in1.substr(0,3);
  var str4 = in1.substr(0,4);
  var str5 = in1.substr(0,5);
  var str = in1;
  if(in2!=undefined) str+= in2;
  if(in3!=undefined) str+= in3;
  if(in4!=undefined) str+= in4;
  if(in5!=undefined) str+= in5;
  var res = "0000000000000000";
  switch (str2) {
    case "BR": // DONE
      res = res.replaceAt(0, "0000");
      if(in1.indexOf("N")>-1||in1.indexOf("n")>-1) res = res.replaceAt(4, "1");
      if(in1.indexOf("Z")>-1||in1.indexOf("z")>-1) res = res.replaceAt(5, "1");
      if(in1.indexOf("P")>-1||in1.indexOf("p")>-1) res = res.replaceAt(6, "1");
      if(in1=="BR") {
        res = res.replaceAt(4, "1");
        res = res.replaceAt(5, "1");
        res = res.replaceAt(6, "1");
      }
      var label = get_label(in2);
      var diff = labels[label];
      diff = adder(twos(pc_pass), diff);
      diff = adder(diff, "1111111111111111");
      //if(diff.charAt(0)=="0") diff = adder(diff, "1111111111111111");
      //if(diff.charAt(0)=="1") diff = adder(diff, "1111111111111110");
      res = res.replaceAt(7, diff.substring(7,16));
      break;
    case "LD": // DONE
      if(str3=="LDR") break;
      res = res.replaceAt(0, "0010");
      res = res.replaceAt(4, reg_binary(str.substr(2,2)));
      var label = get_label(str.substr(5,str.length-4)).toUpperCase();
      //console.log(label);
      var diff = labels[label];
      diff = adder(twos(pc_pass), diff);
      res = res.replaceAt(7, diff.substring(7,16));
      break;
    case "ST": // DONE
      if(str3=="STR"||str3=="STI") break;
      res = res.replaceAt(0, "0011");
      res = res.replaceAt(4, reg_binary(str.substr(2,2)));
      var label = get_label(str.substr(5,str.length-4)).toUpperCase();
      var diff = labels[label];
      diff = adder(twos(pc_pass), diff);
      //diff = adder(diff, "1111111111111111");
      res = res.replaceAt(7, diff.substring(7,16));
      break;
    case "IN":
      res = res.replaceAt(0, "1111000000100011");
    default:
      break;
  }
  switch (str3) {
    case "ADD": // DONE
      res = res.replaceAt(0, "0001");
      res = res.replaceAt(4, reg_binary(str.substr(3,2)));
      res = res.replaceAt(7, reg_binary(str.substr(6,2)));
      if(str.charAt(9)=="x") {
        res = res.replaceAt(10, "1");
        var tempp = hex_to_binary(str.substr(9,str.length-9));
        if(tempp.length==4) tempp = "0" + temp;
        res = res.replaceAt(11, tempp.substr(tempp.length-5, 5));
        break;
      } else if (str.charAt(9)=="#"||str.charAt(9)!="R") {
        res = res.replaceAt(10, "1");
        var tempp = decimal_to_binary(str.substr(9,str.length-9));
        res = res.replaceAt(11, tempp.substr(tempp.length-5, 5));
        break;
      } else {
        res = res.replaceAt(10, "000");
        res = res.replaceAt(13, reg_binary(str.substr(9,2)));
        break;
      }
      update("error");
      return;
    case "JSR": // DONE
      if(str4=="JSRR") break;
      res = res.replaceAt(0, "01001"); // that extra 1 is there for a reason, don't delete it!
      var label = get_label(in2).toUpperCase();
      var diff = labels[label];
      diff = adder(twos(pc_pass), diff);
      //console.log(diff);
      diff = adder(diff, "1111111111111111");
      //console.log(diff);
      res = res.replaceAt(5, diff.substring(5,16));
      break;
    case "AND": // DONE
      res = res.replaceAt(0, "0101");
      res = res.replaceAt(4, reg_binary(str.substr(3,2)));
      res = res.replaceAt(7, reg_binary(str.substr(6,2)));
      if(str.charAt(9)=="x") {
        res = res.replaceAt(10, "1");
        var tempp = hex_to_binary(str.substr(9,str.length-9));
        if(tempp.length==4) tempp = "0" + tempp;
        res = res.replaceAt(11, tempp.substr(tempp.length-5, 5));
        break;
      } else if (str.charAt(9)=="#"||str.charAt(9)!="R") {
        res = res.replaceAt(10, "1");
        var tempp = decimal_to_binary(str.substr(9,str.length-9));
        res = res.replaceAt(11, tempp.substr(tempp.length-5, 5));
        break;
      } else {
        res = res.replaceAt(10, "000");
        res = res.replaceAt(13, reg_binary(str.substr(9,2)));
        break;
      }
      update("error");
      return;
    case "LDR": // TODO
      res = res.replaceAt(0, "0110");
      res = res.replaceAt(4, reg_binary(str.substr(3,2)));
      res = res.replaceAt(7, reg_binary(str.substr(6,2)));
      if(str.charAt(9)=="x") {
        var tempp = hex_to_binary(str.substr(9,str.length-9));
        if(tempp.length==4) tempp = "0" + temp;
        res = res.replaceAt(10, tempp.substr(tempp.length-6, 6));
        break;
      } else {
        var tempp = decimal_to_binary(str.substr(9,str.length-9));
        res = res.replaceAt(10, tempp.substr(tempp.length-6, 6));
        break;
      }
      update("error");
      break;
    case "STR": // TODO
      res = res.replaceAt(0, "0111");
      res = res.replaceAt(4, reg_binary(str.substr(3,2)));
      res = res.replaceAt(7, reg_binary(str.substr(6,2)));
      if(str.charAt(9)=="x") {
        var tempp = hex_to_binary(str.substr(9,str.length-9));
        if(tempp.length==4) tempp = "0" + temp;
        res = res.replaceAt(10, tempp.substr(tempp.length-6, 6));
        break;
      } else {
        var tempp = decimal_to_binary(str.substr(9,str.length-9));
        res = res.replaceAt(10, tempp.substr(tempp.length-6, 6));
        break;
      }
      update("error");
      break;
    case "RTI":
      res = res.replaceAt(0, "1000"); // TODO
      break;
    case "NOT": // DONE
      res = res.replaceAt(0, "1001");
      res = res.replaceAt(4, reg_binary(str.substr(3,2)));
      res = res.replaceAt(7, reg_binary(str.substr(6,2)));
      res = res.replaceAt(10, "111111");
      break;
    case "LDI":
      res = res.replaceAt(0, "1010");
      res = res.replaceAt(4, reg_binary(str.substr(3,2)));
      var label = get_label(str.substr(6,str.length-6));
      var diff = labels[label];
      diff = adder(twos(pc_pass), diff);
      res = res.replaceAt(7, diff.substring(7,16));
      break;
    case "STI": // DONE
      res = res.replaceAt(0, "1011");
      res = res.replaceAt(4, reg_binary(str.substr(3,2)));
      var label = get_label(str.substr(6,str.length-6));
      var diff = labels[label];
      diff = adder(twos(pc_pass), diff);
      res = res.replaceAt(7, diff.substring(7,16));
      break;
    case "JMP":
      res = res.replaceAt(0, "1100000000000000");
      res = res.replaceAt(7, reg_binary(str.substr(3,2)));
      break;
    case "LEA":
      res = res.replaceAt(0, "1110");
      res = res.replaceAt(4, reg_binary(str.substr(3,2)));
      var label = get_label(str.substr(6,str.length-6));
      var diff = labels[label];
      diff = adder(twos(pc_pass), diff);
      res = res.replaceAt(7, diff.substring(7,16));
      break;
    case "RET": // DONE
      res = "1100000111000000";
      break;
    case "OUT": // DONE
      res = "1111000000100001";
      break;
    default:
      break;
  }
  switch (str4) {
    case "TRAP":
      var tempp = in2.substr(0,3);
      if(tempp=="x20") res = "1111000000100000";
      if(tempp=="x21") res = "1111000000100001";
      if(tempp=="x22") res = "1111000000100010";
      if(tempp=="x23") res = "1111000000100011";
      if(tempp=="x24") res = "1111000000100100";
      if(tempp=="x25") res = "1111000000100101";
      break;
    case ".END": // DONE
      return;
    case "HALT":
      res = "1111000000101001";
      break;
    case "GETC": // DONE
      res = "1111000000100000";
      break;
    case "PUTS":
      res = "1111000000100010";
      break;
    case "JSRR":
      res = res.replaceAt(0, "0100000000000000");
      res = res.replaceAt(7, reg_binary(str.substr(3,2)));
      break;
      break;
    default:
      break;
  }
  switch (str5) {
    case ".ORIG": // DONE
      break;
    case ".FILL": // DONE
      //console.log(".FILL", in2, labels[in2]);
      if(labels[in2]!=undefined) res = labels[in2];
      else if(in2[0]=="x") {
        res = sext(hex_to_binary(in2));
      } else {
        res = sext(decimal_to_binary(in2));
      }
      break;
    case ".BLKW":
      // TODO
      break;
    case "PUTSP":
      res = "1111000000100100";
      break;
    default:

  }
  storage[pc_pass] = res;
}
