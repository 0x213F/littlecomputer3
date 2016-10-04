function Node() {
  this.memory = [undefined, undefined];
  this.register = [undefined, undefined];
  this.pc = undefined;
  this.cc = undefined;
  this.char = undefined
  this.next = null;
}

function go_back() {
  if(polling==true) return;
  if(linked_list==null) return;
  if(linked_list.memory[0]!=undefined) {
    storage[linked_list.memory[0]] = linked_list.memory[1];
  }
  if(linked_list.register[0]!=undefined) {
    reg_st(linked_list.register[0], linked_list.register[1])
  }
  if(linked_list.char!=undefined) {
    var ss = document.getElementById("terminal").innerHTML;
    document.getElementById("terminal").innerHTML = ss.substr(0, ss.length - linked_list.char);
  }
  cc = cc;
  pc = linked_list.pc;
  linked_list = linked_list.next;
  update();
}

function pulse_backward(int) {
  if(polling==true||int>10) return;
  go_back();
  setTimeout(function(){pulse_backward(int+1);}, 20);
}


function add_node(mem, mem_value, reg, reg_value, cc, char, old_pc) {
  var current_node = new Node();
  current_node.memory = [mem, mem_value];
  current_node.register = [reg, reg_value];
  current_node.cc = cc;
  if(char==true) {
    // TODO delete a char from the monitor
    // NOTE for new line we backspace 4 places
  }
  current_node.char = char;
  current_node.pc = old_pc;
  current_node.next = linked_list;
  linked_list = current_node;
}

function print_ll() {
  var temp = linked_list;
  while(temp!=null) {
    console.log(temp.pc);
    temp = temp.next;
  }
}
