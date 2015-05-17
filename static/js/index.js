$(function () {

  AV.initialize("xr3759mn36mdgbwuef3guyy0s45gooe1x9ggcp67yefecdy2", "7sa4nztm68wjud0q939y26a4jwmmep0zwjui6hj95il4lx1c")

  var gTpl = function (selector) {
    var source = $(selector).html();
    return Handlebars.compile(source);
  }

  AV.Cloud.run('getPreview', {}, {
    success: function (r) {
      var tpl = gTpl("#blogPreview-tpl")

      Handlebars.registerHelper('time', function (time, options) {
        console.log(time)
        return new NiceTime(time, "EN").get()
      })
      var out = unes(tpl({
        p: r
      }))
      console.log(out)
      $("#blogPreview").html(out)
    }
  })

  //  $.getJSON('./json/posts.json', function (r) {
  //
  //
  //  })

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