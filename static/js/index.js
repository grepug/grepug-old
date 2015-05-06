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
    $("#blogPreview").html(tpl({
      p: r
    }))
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
  return d
}

function NiceTime(date, lang) {

  this.date = new Date(date)
  this.timeStamp = this.date.getTime() / 1000

  this.now = new Date().getTime() / 1000

  this.seconds = {
    min: 60,
    hour: 60 * 60,
    day: 60 * 60 * 24,
    week: 60 * 60 * 24 * 7
  }

  this.lang = lang || 'EN'
}

NiceTime.prototype.byNow = function () {
  this.diff = this.now - this.timeStamp
  for (var p in this.seconds) {
    if (this.diff < this.seconds[p]) return p
  }
  return 'more than a week'
}

NiceTime.prototype.get = function () {
  var timeLevel = this.byNow()

  Number.prototype.niceTimeLang = function (timeLevel, lang) {
    if (lang.toUpperCase() == 'EN') {
      switch (timeLevel) {
      case 'min':
        return this + " sec ago"
      case 'hour':
        return this + " min ago"
      case 'day':
        if (this == 1) return this + " hour ago"
        return this + " hours ago"
      case 'week':
        if (this == 1) return this + " day ago"
        return this + " days ago"
      }
    }
    if (lang.toUpperCase() == 'CN') {
      switch (timeLevel) {
      case 'min':
        return this + "秒前"
      case 'hour':
        return this + "分钟前"
      case 'day':
        return this + "小时前"
      case 'week':
        return this + "天前"
      }
    }
  }
  switch (timeLevel) {
  case 'min':
    return Math.round(this.diff).niceTimeLang(timeLevel, this.lang)
  case 'hour':
    return Math.round(this.diff / this.seconds.min).niceTimeLang(timeLevel, this.lang)
  case 'day':
    return Math.round(this.diff / this.seconds.hour).niceTimeLang(timeLevel, this.lang)
  case 'week':
    return Math.round(this.diff / this.seconds.day).niceTimeLang(timeLevel, this.lang)
  case 'more than a week':
    var year = this.date.getFullYear(),
      month = this.date.getMonth() + 1,
      day = this.date.getDate(),
      hour = this.date.getHours(),
      min = this.date.getMinutes(),
      sec = this.date.getSeconds();
    return year + "/" + month + "/" + day + " " + hour + ":" + min
  }
}