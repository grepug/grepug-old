$(function () {

  var gTpl = function (selector) {
    var source = $(selector).html();
    return Handlebars.compile(source);
  }

  $.getJSON('./json/posts.json', function (r) {

    var tpl = gTpl("#blogPreview-tpl")

    $("#blogPreview").html(rep(tpl({
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

function rep(data) {
  var d = lang.String.decodeHtml(data)
  d = d.replace('<code>', '')
  d = d.replace('&#39;', "'")
  d = d.replace('</code>', '')
  console.log(d)
  return d
}