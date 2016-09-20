/* start canvas */

window.onload = function() {
  var canvas = document.getElementById("wires");
  canvas.width = 800;
  canvas.height = 520;
  canvas.style.width = "400px";
  canvas.style.height = "260px";
  var w = 10;

  line_v(canvas, 2, 65, 60, w, 40);
  line_v(canvas, 2, 155, 60, w, 40);
  line_v(canvas, 2, 110, 140, w, 80);
  line_h(canvas, 2, 120, 25, 50, w);
}

function line_v(cvs, s, x, y, w, h) {
  var draw = cvs.getContext("2d");
  draw.fillStyle = "#FEFEFE";
  draw.fillRect((x+10)/s+5, y*s-1, w, h+2);
}

function line_h(cvs, s, x, y, w, h) {
  var draw = cvs.getContext("2d");
  draw.fillStyle = "#FEFEFE";
  draw.fillRect(x*s-1, (y+10)/s+5, w+2, h);
}

/* global variables */

var condensed_header = false;
var curr_section = "download";

/* on scroll */

document.onscroll = function() {
  if(window.pageYOffset>800 && !condensed_header) {
    condensed_header = true;
    $("#header").animate({
      height: "-=28px"
    }, 100, 'linear');
    $("#header h1").animate({
      lineHeight: "-=28"
    }, 100, 'linear');
    $("#header li").animate({
      lineHeight: "-=28"
    }, 100, 'linear');
  } else if(window.pageYOffset<800 && condensed_header) {
    condensed_header = false;
    $("#header").animate({
      height: "+=28px"
    }, 100, 'linear');
    $("#header h1").animate({
      lineHeight: "+=28"
    }, 100, 'linear');
    $("#header li").animate({
      lineHeight: "+=28"
    }, 100, 'linear');
  }
  //////////////////////////////////////////////////////////
  if(curr_section==="download"&&window.pageYOffset<800) return;
  else if(curr_section==="about"&&window.pageYOffset>=800&&window.pageYOffset<1500) return;
  else if(curr_section==="features"&&window.pageYOffset>=1500&&window.pageYOffset<2900) return;
  else if(curr_section==="opensource"&&window.pageYOffset>=2900) return;
  else update_header();
};

/* on document ready */

$(document).ready(function() {

  $('.button').click(function() {
    var modal;
    switch (this.id) {
      case "cloud-button":
        window.open("http://littlecomputer3.com")
        return;
      case "mac-button":
        modal = "#mac-modal";
        break;
      case "windows-button":
        modal = "#windows-modal";
        break;
      default: return;
    }
    $(modal).removeClass("hide");
  });

  $('.close').click(function() {
    var modal;
    switch (this.id) {
      case "mac-close":
        modal = "#mac-modal";
        break;
      case "windows-close":
        modal = "#windows-modal";
        break;
      default: return;
    }
    $(modal).addClass("hide");
  });

  $('.header-section').click(function() {
    switch (this.id) {
      case "download":
        $("html, body").animate({
          scrollTop: document.getElementById("download");
        });
        break;
      case "about":
        break;
      case "features":
        break;
      case "opensource":
        break;
      default: return;
    }
    console.log("d");
    setTimeout(function(){update_header();}, 500);
  });

  $('#left-arrow').click(function() {
    console.log("left");
  });

  $('#right-arrow').click(function() {

  });

});

//////////////////////////////////////////////////////////

function update_header() {
  if(window.pageYOffset<800) {
    curr_section = "download";
    $("#download").addClass("selected");
    $("#about").removeClass("selected");
  } else if(window.pageYOffset>800 && window.pageYOffset < 1500) {
    curr_section = "about";
    $("#download").removeClass("selected");
    $("#about").addClass("selected");
    $("#features").removeClass("selected");
  } else if(window.pageYOffset>1500 && window.pageYOffset < 2900) {
    curr_section = "features";
    $("#about").removeClass("selected");
    $("#features").addClass("selected");
    $("#opensource").removeClass("selected");
  } else if(window.pageYOffset>2900) {
    curr_section = "opensource";
    $("#features").removeClass("selected");
    $("#opensource").addClass("selected");
  }
  console.log(curr_section);
}

function fade_out(text_id, video_id) {
  $(text_id).animate({
      top: "-=50px"
  }, 500, function(){

  });
  $(video_id).animate({
      bottom: "-=50px"
  }, 500, function(){

  });
  console.log("fadeout");
}

function fade_in(text_id, video_id) {

}
