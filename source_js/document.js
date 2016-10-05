//
// Joshua Schultheiss 2016
//

function test_func_13() {
    var key = window.event.keyCode;

    console.log(key);
}
//////////////////////////////////////////////////////////////////////////////////////////////
function update(status) {

/* sets dump to last data type */

  if(dump_location!=undefined) {
    var temp = $('.active').html();
    switch (temp) {
      case "hex":
        dump_hex();
        break;
      case "ascii":
        dump_ascii();
        break;
      case "decimal":
        dump_decimal();
        break;
      case "binary":
        dump_binary();
        break;
      case "assembly":
        dump_assembly();
        break;
      default:
    }
  }

/* update dump location */

  if(dump_location==undefined) {
    document.getElementById("dump_loc").value = "";
    var i;
    for(i=0; i<32 ; i++) {
      document.getElementById("d" + i).innerHTML = "&#9900";
    }
  }
  else document.getElementById("dump_loc").value = binary_to_hex(dump_location);

/* update register contents */

  $('#r0').find('.reg_binary').html(r0);
  $('#r1').find('.reg_binary').html(r1);
  $('#r2').find('.reg_binary').html(r2);
  $('#r3').find('.reg_binary').html(r3);
  $('#r4').find('.reg_binary').html(r4);
  $('#r5').find('.reg_binary').html(r5);
  $('#r6').find('.reg_binary').html(r6);
  $('#r7').find('.reg_binary').html(r7);
  $('#pc').find('.reg_binary').html(pc);
  $('#ir').find('.reg_binary').html(ir_ui);

  $('#r0').find('.reg_hex').html("0x"+binary_to_hex(r0));
  $('#r1').find('.reg_hex').html("0x"+binary_to_hex(r1));
  $('#r2').find('.reg_hex').html("0x"+binary_to_hex(r2));
  $('#r3').find('.reg_hex').html("0x"+binary_to_hex(r3));
  $('#r4').find('.reg_hex').html("0x"+binary_to_hex(r4));
  $('#r5').find('.reg_hex').html("0x"+binary_to_hex(r5));
  $('#r6').find('.reg_hex').html("0x"+binary_to_hex(r6));
  $('#r7').find('.reg_hex').html("0x"+binary_to_hex(r7));
  $('#pc').find('.reg_hex').html("0x"+binary_to_hex(pc));
  $('#ir').find('.reg_hex').html("0x"+binary_to_hex(ir_ui));

  $('#r0').find('.reg_decimal').html("#"+binary_to_decimal(r0));
  $('#r1').find('.reg_decimal').html("#"+binary_to_decimal(r1));
  $('#r2').find('.reg_decimal').html("#"+binary_to_decimal(r2));
  $('#r3').find('.reg_decimal').html("#"+binary_to_decimal(r3));
  $('#r4').find('.reg_decimal').html("#"+binary_to_decimal(r4));
  $('#r5').find('.reg_decimal').html("#"+binary_to_decimal(r5));
  $('#r6').find('.reg_decimal').html("#"+binary_to_decimal(r6));
  $('#r7').find('.reg_decimal').html("#"+binary_to_decimal(r7));
  $('#pc').find('.reg_decimal').html("#"+binary_to_decimal(pc));
  $('#ir').find('.reg_decimal').html("#"+binary_to_decimal(ir_ui));

}

//////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

////////////////////////////////////////////////
/* on load */

  $('#dump_loc').prop("disabled", true);

////////////////////////////////////////////////
/* polling */

  $("textarea").keyup(function(e) {
    //console.log(program);
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 13) {  // Enter keycode
      document.getElementById('terminal').innerHTML = "";
      if(!$('#sidebar_help').hasClass("hide")) {
        $('#sidebar_help').addClass("hide");
      } else if(!$('#sidebar_github').hasClass("hide")) {
        $('#sidebar_github').addClass("hide");
      } else if(!$('#sidebar_styles').hasClass("hide")) {
        $('#sidebar_styles').addClass("hide");
      }
      $("#sidebar_debugger").removeClass("hide");
      $(dump_type).addClass('active');             // change for default memory dump representation
      if(is_assembly()) {
        pass_one();
      } else {
        store();
      }
      $('#hex').addClass('enabled');
      $('#ascii').addClass('enabled');
      $('#decimal').addClass('enabled');
      $('#binary').addClass('enabled');
      $('#assembly').addClass('enabled');

      $('#button_left').addClass('active');
      $('#button_right').addClass('active');
    }
  });

  $("body").keypress(function(e){
    var press = e.which;

    console.log(press + " - key code pressed");
    storage["1111111000000010"] = decimal_to_binary(press);
    storage["1111111000000000"] = "1000000000000000";
    setTimeout(function(){storage["1111111000000000"] = "0000000000000000";}, 8);
    // TODO KBSR
  });

////////////////////////////////////////////////
/* listeners */

  // HEADER

  $('.tab_add').click(function() {
    document.getElementById("tabs").innerHTML += "<div class=\"tab\"><input class=\"tab_name\" placeholder=\"file name\" value=\"example.bin\"></input></div>"
    // TODO impliment tabs
  });

  $('.tab').click(function() {
    console.log("oh");
    if($(this).hasClass('tab_focus')) return;
    $('.tab').removeClass('tab_focus');
    $(this).addClass('tab_focus');
    // TODO impliment tabs
  });

  $('#play').click(function() {
    if($(this).hasClass('fa-play-circle')) {
      play(this);
      $(this).removeClass('fa-play-circle');
      $(this).addClass('fa-stop-circle');
    } else {
      stop();
      $(this).removeClass('fa-stop-circle');
      $(this).addClass('fa-play-circle');
    }
  });

  $('#step').click(function() {
    if($(this).hasClass('fa-arrow-circle-down')) {
      // reveal accordian down view
      play(this);
      $(this).removeClass('fa-arrow-circle-down');
      $(this).addClass('fa-stop-circle');
      $('#stepper').removeClass('hide');
    } else {
      // TODO stop any program and accordian up view ... just clearing the UI might work, memory might be a concern()?)
      $(this).removeClass('fa-stop-circle');
      $(this).addClass('fa-arrow-circle-down');
      $('#stepper').addClass('hide');
    }
  });

  $('#pulse-backward').click(function() {
    pulse_backward(0);
  });

  $('#step-backward').click(function() {
    go_back();
  });

  $('#step-forward').click(function() {
    step();
  });

  $('#pulse-forward').click(function() {
    pulse_forward(0);
  });

  $( "#debugger" ).click(function() {
    if(!$('#sidebar_help').hasClass("hide")) {
      $('#sidebar_help').addClass("hide");
    } else if(!$('#sidebar_github').hasClass("hide")) {
      $('#sidebar_github').addClass("hide");
    } else if(!$('#sidebar_styles').hasClass("hide")) {
      $('#sidebar_styles').addClass("hide");
    }
    $("#sidebar_debugger").removeClass("hide");
  });

  $( "#github" ).click(function() {
    if(!$('#sidebar_debugger').hasClass("hide")) {
      $('#sidebar_debugger').addClass("hide");
    } else if(!$('#sidebar_help').hasClass("hide")) {
      $('#sidebar_help').addClass("hide");
    } else if(!$('#sidebar_styles').hasClass("hide")) {
      $('#sidebar_styles').addClass("hide");
    }
    $("#sidebar_github").removeClass("hide");
  });

  $( "#styles" ).click(function() {
    if(!$('#sidebar_debugger').hasClass("hide")) {
      $('#sidebar_debugger').addClass("hide");
    } else if(!$('#sidebar_github').hasClass("hide")) {
      $('#sidebar_github').addClass("hide");
    } else if(!$('#sidebar_help').hasClass("hide")) {
      $('#sidebar_help').addClass("hide");
    }
    $("#sidebar_styles").removeClass("hide");
  });

  $( "#help" ).click(function() {
    if(!$('#sidebar_debugger').hasClass("hide")) {
      $('#sidebar_debugger').addClass("hide");
    } else if(!$('#sidebar_github').hasClass("hide")) {
      $('#sidebar_github').addClass("hide");
    } else if(!$('#sidebar_styles').hasClass("hide")) {
      $('#sidebar_styles').addClass("hide");
    }
    $("#sidebar_help").removeClass("hide");
  });

  // TABLE for MEMORY DUMP

  $('.dump_table').hover(function() {
    if(dump_location==undefined) return;
    var number;
    if(this.id.length==2) number = this.id.substr(1,1);
    else number = this.id.substr(1,2);
    number = parseInt(number);
    this.innerHTML = binary_to_hex(adder(decimal_to_binary(number),dump_location));
    $(this).css('color','#DDD');
    $(this).css('font-weight','700');
    $(this).css("font-size","12px");
  });

  $(".dump_table").mouseout(function() {
    if(dump_location==undefined) return;
    $(this).css('color','#6599FF');
    $(this).css('font-weight','400');
    $(this).css("font-size","4px");
    update();
  });

  // INPUT for MEMORY DUMP

  $("#dump_loc").keyup(function (e) {
      if (e.keyCode == 13) {
        this.blur();
      }
  });
  $("#dump_loc").focusout(function() {
    if(document.getElementById("dump_loc").value.length==4) dump_location = hex_to_binary(document.getElementById("dump_loc").value);
    else {
      document.getElementById("dump_loc").value = binary_to_hex(orig_dump_location);
      dump_location = orig_dump_location;
    }
    update();
  });

  // TABLE for MEMORY DUMP specifically BINARY resizing

  $('#binary').click(function() {
    if($(this).hasClass('active') || !$(this).hasClass('enabled')) return;
    $(".dump_table").css("font-size","4px");
  });

  // SELECTOR for MEMORY DUMP

  $('.selector').click(function() {
      if($(this).hasClass('active') || !$(this).hasClass('enabled')) return;
      $('.selector').removeClass('active');
      $(this).addClass('active');
      switch (this.innerHTML) {
        case "hex":
          dump_hex();
          break;
        case "ascii":
          dump_ascii();
          break;
        case "decimal":
          dump_decimal();
          break;
        case "binary":
          dump_binary();
          break;
        case "assembly":
          dump_assembly();
          break;
        default:
      }
  });

/*
  $('.sel').click(function() {
      if($(this).hasClass('active') || !$(this).hasClass('enabled')) return;
      console.log("ge");
      $('.sel').removeClass('active');
      $(this).addClass('active');
      if(!$('#help_about_content').hasClass("hide")) {
        $('#help_about_content').addClass("hide");
      } else if(!$('#help_assembly_content').hasClass("hide")) {
        $('#help_assembly_content').addClass("hide");
      } else if(!$('#help_binary_content').hasClass("hide")) {
        $('#help_binary_content').addClass("hide");
      }
      $(this).removeClass("hide");
  });*/

  $('.style_square').click(function() {
    var main_bg_color, secondary_bg, main_color, code_bg, weak_color, main_text;
    if($(this).hasClass("ss_one")) {
      main_bg_color = "#6599FF";
      secondary_bg = "#FAFAFA";
      code_bg = "white";
      weak_color = "#DDD"
      main_text = "black";
    } else if($(this).hasClass("ss_two")) {
      main_bg_color = "#CF5230";
      secondary_bg = "#c6a090";
      code_bg = "#ffe9d2";
      weak_color = "#FAFAFA";
      main_text = "#6c4c28";
    } else if($(this).hasClass("ss_three")) {
      main_bg_color = "#778899";
      secondary_bg = "#2b3e50";
      code_bg = "#243443";
      weak_color = "#222";
      main_text= "#DDD";
    }
    $('#header').css('background-color',main_bg_color);
    $('.sidebar_button').css('border',"1px solid " + main_bg_color);
    $('.sidebar_button').css('color',main_bg_color);


    $('.CodeMirror').css('background-color',code_bg);
    $('#header').css('color',code_bg);

    $('#sidebar_github').css('background-color',secondary_bg);
    $('#sidebar_styles').css('background-color',secondary_bg);
    $('#sidebar_debugger').css('background-color',secondary_bg);
    $('#sidebar_help').css('background-color',secondary_bg);
    $('.CodeMirror-gutters').css('background-color',secondary_bg);
    $('.sidebar_button').css('background-color',secondary_bg);

    $('#sidebar_github').css('border-left',"1px solid " + weak_color);
    $('#sidebar_styles').css('border-left',"1px solid " + weak_color);
    $('#sidebar_debugger').css('border-left',"1px solid " + weak_color);
    $('#sidebar_help').css('border-left',"1px solid " + weak_color);
    $('.CodeMirror-gutters').css('border-right',"1px solid " + weak_color);
    $('.CodeMirror-linenumber').css('color',weak_color);
    $('.style_square').css('border',"4px solid" + weak_color);

    $('.CodeMirror').css('color',main_text);
    $('p').css('color',main_text);
  });
});

function dump_hex() {
  dump_type = "#hex";
  $(".dump_table").css("font-size","12px");
  var loc = dump_location;
  var i;
  for(i=0; i<32 ; i++) {
    if(storage[loc]==undefined) document.getElementById("d" + i).innerHTML = "&#9900";
    else document.getElementById("d" + i).innerHTML = binary_to_hex(storage[loc]);
    loc = adder(loc,"0000000000000001");
  }
}

function dump_ascii() {
  $(".dump_table").css("font-size","12px");
  dump_type = "#ascii";
  var loc = dump_location;
  var i;
  for(i=0; i<32 ; i++) {
    if(storage[loc]==undefined) document.getElementById("d" + i).innerHTML = "&#9900";
    else document.getElementById("d" + i).innerHTML = String.fromCharCode(binary_to_decimal(storage[loc]));
    loc = adder(loc,"0000000000000001");
  }
}

function dump_decimal() {
  dump_type = "#decimal";
  $(".dump_table").css("font-size","12px");
  var loc = dump_location;
  var i;
  for(i=0; i<32 ; i++) {
    if(storage[loc]==undefined) document.getElementById("d" + i).innerHTML = "&#9900";
    else document.getElementById("d" + i).innerHTML = binary_to_decimal(storage[loc]);
    loc = adder(loc,"0000000000000001");
  }
}

function dump_binary() {
  dump_type = "#binary";
  var loc = dump_location;
  var i;
  for(i=0; i<32 ; i++) {
    if(storage[loc]==undefined) document.getElementById("d" + i).innerHTML = "&#9900";
    else document.getElementById("d" + i).innerHTML = storage[loc];
    loc = adder(loc,"0000000000000001");
  }
}

function dump_assembly() {
  dump_type = "#assembly";
  $(".dump_table").css("font-size","12px");
  var loc = dump_location;
  var i;
  for(i=0; i<32 ; i++) {
    if(storage[loc]==undefined) document.getElementById("d" + i).innerHTML = "&#9900";
    else document.getElementById("d" + i).innerHTML = binary_to_assembly_2(storage[loc]);
    loc = adder(loc,"0000000000000001");
  }
}

function dump_right() {
  if(dump_location == undefined) return;
  document.getElementById("dump_loc").value = binary_to_hex(adder(hex_to_binary(document.getElementById("dump_loc").value),"0000000000100000"));
  dump_location = hex_to_binary(document.getElementById("dump_loc").value);
  var temp = $('.active').html();
  switch (temp) {
    case "hex":
      dump_hex();
      break;
    case "ascii":
      dump_ascii();
      break;
    case "decimal":
      dump_decimal();
      break;
    case "binary":
      dump_binary();
      break;
    case "assembly":
      dump_assembly();
      break;
    default:
  }
}

function dump_left() {
  if(dump_location == undefined) return;
  document.getElementById("dump_loc").value = binary_to_hex(adder(hex_to_binary(document.getElementById("dump_loc").value),"1111111111100000"));
  dump_location = hex_to_binary(document.getElementById("dump_loc").value);
  var temp = $('.active').html();
  switch (temp) {
    case "hex":
      dump_hex();
      break;
    case "ascii":
      dump_ascii();
      break;
    case "decimal":
      dump_decimal();
      break;
    case "binary":
      dump_binary();
      break;
    case "assembly":
      dump_assembly();
      break;
    default:
  }
}
