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

    $("#blogPreview").html(unes(tpl({
      p: r
    })))
  })

  $(window).scroll(function () {
    var jumHeight = $('.jumbotron').height(),
      scrollTop = $(window).scrollTop()
    if (scrollTop > jumHeight) $('nav').addClass('navbar-fixed-top')
    else $('nav').removeClass('navbar-fixed-top')
  })
})

function unes(data) {
  var d = lang.String.decodeHtml(data)
  d = d.replace('&#39;', "'")
  return d
}