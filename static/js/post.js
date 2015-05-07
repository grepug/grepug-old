$(function () {

  String.prototype.getParam = function (parm) {
    var reg = new RegExp("(^|&)" + parm + "=([^&]*)(&|$)");

    var r = this.substr(this.indexOf("\?") + 1).match(reg);
    console.log(r)
    if (r != null) return unescape(r[2]);
    return null;
  }

  var gTpl = function (selector) {
    var source = $(selector).html();
    return Handlebars.compile(source);
  }

  var url = location.href;
  var title = url.getParam("title")
  console.log(title)
  $.getJSON('../json/posts.json', function (r) {
    for (var i = 0; i < r.length; i++) {
      if (r[i].title == title.replace("#", "")) {
        var content = lang.String.decodeHtml(r[i].content)
        var author = r[i].author
        var updatedAt = r[i].updatedAt
      }
    }

    Handlebars.registerHelper('time', function (timestamp, options) {
      return new NiceTime(timestamp, 'EN').get()
    })

    $('title').text(title)
    var tpl = gTpl('#g-post-tpl')
    $('.g-blog-post').html(tpl({
      content: content,
      updatedAt: updatedAt,
      author: author
    }))

    if ($(window).height() < $('body').height())
      $('footer').removeClass('navbar-fixed-bottom')
  })



  $(window).scroll(function () {
    var jumHeight = $('.jumbotron').height(),
      scrollTop = $(window).scrollTop()
    if (scrollTop > jumHeight) $('nav').addClass('navbar-fixed-top')
    else $('nav').removeClass('navbar-fixed-top')
  })
})