$(function () {

  //  //ie 
  //  if (navigator.browserLanguage != "undefined" && navigator.browserLanguage != null) {
  //    if (navigator.systemLanguage == "zh-CN") location.href = "/cn"
  //      //else location.href = "/"
  //  }
  //  //firefox、chrome,360 
  //  else {
  //    if (navigator.language == "zh-CN" && location.pathname != "zh-CN") location.href = "/cn"
  //    else if(navigator.language == "en-US" && location.pathname != "en-US") location.href = "/"
  //  }
  //fix the navbar when window scrolltop greater than jumbotron's height
  $(window).scroll(function () {
    var jumHeight = $('.jumbotron').height(),
      scrollTop = $(window).scrollTop()
    if (scrollTop > jumHeight) $('nav').addClass('navbar-fixed-top')
    else $('nav').removeClass('navbar-fixed-top')
  })

})