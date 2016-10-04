var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  mode: "text/html",
  matchBrackets: true
});
editor.setSize("100%","100%");

function play(t) {
  if(program!=undefined) return;
  program = t.id;
  //console.log(program);
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

function stop() {
  program = undefined;
  reset();

  $('#hex').removeClass('enabled');
  $('#ascii').removeClass('enabled');
  $('#decimal').removeClass('enabled');
  $('#binary').removeClass('enabled');
  $('#assembly').removeClass('enabled');

  $('#button_left').removeClass('active');
  $('#button_right').removeClass('active');

  $('.selector').removeClass('active');
}
