$(function () {

  var gTpl = function (selector) {
    var source = $(selector).html();
    return Handlebars.compile(source);
  }

  $.getJSON('./json/posts.json', function (r) {

    var tpl = gTpl("#blogPreview-tpl")

    Handlebars.registerHelper('time', function (time, options) {
      return new NiceTime(time, "EN").get()
    })
    var out = unes(tpl({
      p: r
    }))
    console.log(out)
    $("#blogPreview").html(out)
  })

  $(window).scroll(function () {
    var jumHeight = $('.jumbotron').height(),
      scrollTop = $(window).scrollTop()
    if (scrollTop > jumHeight) $('nav').addClass('navbar-fixed-top')
    else $('nav').removeClass('navbar-fixed-top')
  })
})

function unes(data) {
  var d = decodeURI(data)
  d = d.replace(/&amp;/g, "\&")
  d = d.replace(/&#39;/g, "\'")
  return d
}