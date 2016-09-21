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
var curr_car = 3;
var wait = false;

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
  else if(curr_section==="about"&&window.pageYOffset>=800&&window.pageYOffset<1430) return;
  else if(curr_section==="features"&&window.pageYOffset>=1430&&window.pageYOffset<1700) return;
  else if(curr_section==="opensource"&&window.pageYOffset>=1700) return;
  else update_header();
};

/* on document ready */

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
        // window.scrollTo(0,0);
        $("html,body").animate({
          scrollTop: "0px"
        }, 500);
        break;
      case "about":
        // window.scrollTo(0,840);
        $("html,body").animate({
          scrollTop: "840px"
        }, 500);
        break;
      case "features":
        // window.scrollTo(0,1430);
        $("html,body").animate({
          scrollTop: "1430px"
        }, 500);
        break;
      case "opensource":
        // window.scrollTo(0,1720);
        $("html,body").animate({
          scrollTop: "1720px"
        }, 500);
        break;
      default: return;
    }
    setTimeout(function(){update_header();}, 500);
  });

  $('#left-arrow').click(function() {
    if(wait===true) return;
    switch (curr_car) {
      case 1:
        fade_out_left("#t-1","#v-1");
        fade_in_right("#t-3","#v-3");
        curr_car = 3;
        break;
      case 2:
        fade_out_left("#t-2","#v-2");
        fade_in_right("#t-1","#v-1");
        curr_car = 1;
        break;
      case 3:
        fade_out_left("#t-3","#v-3");
        fade_in_right("#t-2","#v-2");
        curr_car = 2;
        break;
      default:
        return;
    }
  });

  $('#right-arrow').click(function() {
    if(wait===true) return;
    switch (curr_car) {
      case 1:
        fade_out_right("#t-1","#v-1");
        fade_in_left("#t-2","#v-2");
        curr_car = 2;
        break;
      case 2:
        fade_out_right("#t-2","#v-2");
        fade_in_left("#t-3","#v-3");
        curr_car = 3;
        break;
      case 3:
        fade_out_right("#t-3","#v-3");
        fade_in_left("#t-1","#v-1");
        curr_car = 1;
        break;
      default:
        return;
    }
  });

//////////////////////////////////////////////////////////

function update_header() {
  if(window.pageYOffset<=800) {
    curr_section = "download";
    $("#download").addClass("selected");
    $("#about").removeClass("selected");
  } else if(window.pageYOffset>=800 && window.pageYOffset < 1430) {
    curr_section = "about";
    $("#download").removeClass("selected");
    $("#about").addClass("selected");
    $("#features").removeClass("selected");
  } else if(window.pageYOffset>=1430 && window.pageYOffset < 1700) {
    curr_section = "features";
    $("#about").removeClass("selected");
    $("#features").addClass("selected");
    $("#opensource").removeClass("selected");
  } else if(window.pageYOffset>=1700) {
    curr_section = "opensource";
    $("#features").removeClass("selected");
    $("#opensource").addClass("selected");
  }
}

function fade_out_left(text_id, video_id) {
  wait = true;
  $(text_id).animate({
      left: "-=100%",
  }, 500, function(){
    $(text_id).addClass("hide");
    $(text_id).removeAttr("style");
  });

  $(video_id).animate({
      left: "-=100%"
  }, 500, function(){
    $(video_id).addClass("hide");
    $(video_id).removeAttr("style");
  });
}

function fade_in_right(text_id, video_id) {
  setTimeout(function(){
    $(text_id).animate({
        left: "+=100%",
    }, 10, function(){
      $(text_id).removeClass("hide");
      $(text_id).animate({
          left: "-=100%",
      }, 500, function(){

      });
    });

    $(video_id).animate({
        left: "+=100%",
    }, 10, function(){
      $(video_id).removeClass("hide");
      $(video_id).animate({
          left: "-=100%",
      }, 500, function(){
        wait = false;
      });
    });
  }, 400);
}

function fade_out_right(text_id, video_id) {
  wait = true;
  $(text_id).animate({
      right: "-=100%",
  }, 500, function(){
    $(text_id).addClass("hide");
    $(text_id).removeAttr("style");
  });

  $(video_id).animate({
      right: "-=100%"
  }, 500, function(){
    $(video_id).addClass("hide");
    $(video_id).removeAttr("style");
  });
}

function fade_in_left(text_id, video_id) {
  setTimeout(function(){
    $(text_id).animate({
        right: "+=100%",
    }, 10, function(){
      $(text_id).removeClass("hide");
      $(text_id).animate({
          right: "-=100%",
      }, 500, function(){

      });
    });

    $(video_id).animate({
        right: "+=100%",
    }, 10, function(){
      $(video_id).removeClass("hide");
      $(video_id).animate({
          right: "-=100%",
      }, 500, function(){
        wait = false;
      });
    });
  }, 400);
}
