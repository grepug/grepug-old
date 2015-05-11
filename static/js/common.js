$(function () {

  $('.g-backtop').click(function () {
    scroll(0, 0)
  })
  if ($('body').height() < $(document).height()) {
    $('footer').addClass('navbar-fixed-bottom')
  }
})