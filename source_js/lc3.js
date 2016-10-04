//
// Joshua Schultheiss 2016
//

//////////////////////////////////////////////////////////////////////////////////////////////
//
// Execute Program
//
// TODO: Needs another look
//
function exec() {
  if(program==undefined) return;
  ir = storage[adder(pc,"0000000000000001")];
  if(ir=="1111000000101001") {
    $('#play').removeClass('fa-stop-circle');
    $('#play').addClass('fa-play-circle');
    document.getElementById('terminal').innerHTML += "<br>================<br>Halting the LC-3<br>================";
    program = undefined;
    update();
    return;
    // this return statement actually worked...
    update("halt");
    stop();
    $(this).removeClass('fa-stop-circle');
    $(this).addClass('fa-play-circle');
    return;
  }
  if(oops>100000) {
    update("error");
    return;
  }
  if(polling==true) {
    oops = 0;
    //setTimeout(function(){ exec(); }, 20);   // TODO: polling at a quicker rate (low priority)
    return;
  }
  pc = adder(pc,"0000000000000001");
  ir_ui = ir;
  subr(ir);                                 // TODO: see below (threading issues)
  oops++;
  //console.log("second");
  if(oops%2000==0) {
    //update("step");
    setTimeout(function(){exec();},1);
  } else exec();      // TODO: see above (threading issues)
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// Step Program
//
// TODO: Needs another look
//
function step() {
  if(program==undefined) return;
  if(polling==true) return;
  var ir = storage[adder(pc,"0000000000000001")];
  if(ir!="1111000000101001"&&oops<10000) {
    pc = adder(pc,"0000000000000001");
    ir_ui = ir;
    subr(ir);
    ir = storage[pc];
    update("step");
    oops++;
  } else if(oops<10000000) {
    document.getElementById('terminal').innerHTML += "<br>================<br>Halting the LC-3<br>================";
    add_node(undefined, undefined, undefined, undefined, undefined, 60, pc);
    program = undefined;
    update("halt");
  } else {
    update("error");
  }
}

function pulse_forward() {
  if(program==undefined) return;
  if(polling==true) return;
  var c = 0;
  while(c<10) {
    if(polling==true) break;
    var ir = storage[adder(pc,"0000000000000001")];
    if(ir!="1111000000101001"&&oops<10000) {
      pc = adder(pc,"0000000000000001");
      ir_ui = ir;
      subr(ir);
      ir = storage[pc];
      update("step");
      oops++;
    } else if(oops<10000000) {
      document.getElementById('terminal').innerHTML += "<br>================<br>Halting the LC-3<br>================";
      add_node(undefined, undefined, undefined, undefined, undefined, 60, pc);
      program = undefined;
      update("halt");
      return;
    } else {
      update("error");
      return;
    }
    c++;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// Show Program
//
// TODO: Needs another look
//
function show() {
  if(polling==true) {
    setTimeout(function(){show();},150);
    return;
  }
  var ir = storage[adder(pc,"0000000000000001")];
  if(ir!="1111000000111001"&&oops<10000) {
    pc = adder(pc,"0000000000000001");
    ir_ui = ir;
    subr(ir);
    ir = storage[pc];
    update("step");
    oops++;
    setTimeout(function(){show();},150);
  } else if(oops<10000000) {
    update("halt");
  } else {
    update("error");
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
// Reset Program
//
// TODO: Needs another look
//
function reset() {
  $('#dump_loc').prop("disabled", true);
  dump_location = undefined;
  //storage = {};
  storage["1111111000000000"] = "0000000000000000";
  storage["1111111000000010"] = "0000000000000000";
  storage["1111111000000100"] = "0000000000000000";
  storage["1111111000000110"] = "0000000000000000";
  storage["1111111000000100"] = "0000000000000000";
  storage["1111111111111110"] = "1000000000000000";
  r0 = r1 = r2 = r3 = r4 = r5 = r6 = r7 = "0000000000000000";
  oops = 0;
  is_on = false;
  document.getElementById("terminal").innerHTML = "";
  update("reset");
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// Store Binary
//
// Should be all set
//
function store() {
  var set_pc = false, pc_temp, temp = 0;
  var text = editor.getValue();
  var lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if(set_pc==false) {
      if(valid_binary(lines[i])) {
        pc_temp = trim_binary(lines[i]);
        pc = adder(trim_binary(lines[i]),"1111111111111111");
        set_pc = true;
        continue;
      } else if(!valid_binary_comment(lines[i])) {
        update("error");
        return;
      }
    }
    if(valid_binary(lines[i])) {
      storage[pc_temp] = trim_binary(lines[i]);
      pc_temp = adder(pc_temp,"0000000000000001");
    } else if(!valid_binary_comment(lines[i])) {
      update("error");
      return;
    }
  }
  update("stored");
  exec();
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
// Subroutine Branch
//
// Should be all set
//
function subr(inst) {
  var func = inst.substr(0,4);
  var old_pc = adder(pc,"1111111111111111");
  var data = [undefined,undefined,undefined,undefined,undefined,undefined]
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
  //console.log(data);
  //console.log(old_pc, pc)
  if(program=="step") add_node(data[0],data[1],data[2],data[3],data[4],data[5],old_pc);
}
