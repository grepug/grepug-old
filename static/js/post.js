$(function () {

  String.prototype.getParam = function (parm) {
    var reg = new RegExp("(^|&)" + parm + "([^&]*)(&|$)");
    var r = this.substr(this.indexOf("\?") + 1).match(reg);
    console.log(r)
    if (r != null) return unescape(r[2]);
    return null;
  }

  var url = location.href;
  var title = url.getParam("title").replace("=", "");
  console.log(title)
  $.getJSON('../json/posts.json', function (r) {
    for (var i = 0; i < r.length; i++) {
      if (r[i].title == title.replace("#", ""))
        var content = lang.String.decodeHtml(r[i].content)
    }

    $('title').text(title)
    $('.g-blog-post-markdown').html(content)
  })

  if ($(window).height() < $('body').height())
    $('footer').removeClass('navbar-fixed-bottom')

  $(window).scroll(function () {
    var jumHeight = $('.jumbotron').height(),
      scrollTop = $(window).scrollTop()
    if (scrollTop > jumHeight) $('nav').addClass('navbar-fixed-top')
    else $('nav').removeClass('navbar-fixed-top')
  })
})