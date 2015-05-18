function NiceTime(date, lang, nicetime) {

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
  this.nicetime = nicetime !== false ? true : false
}

NiceTime.prototype.byNow = function () {
  this.diff = this.now - this.timeStamp
  if (this.diff <= 59) return 'just now'
  for (var p in this.seconds) {
    if (this.diff < this.seconds[p]) return p
  }
  return 'more than a week'
}

NiceTime.prototype.get = function () {
  var timeLevel = this.nicetime ? this.byNow() : 'more than a week'

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
      case 'more than a week':
        return "at" + this
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
      case 'more than a week':
        return "于" + this
      }
    }
  }
  switch (timeLevel) {
  case 'just now':
    return 'just now'
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
    return year + "-" + month + "-" + day + " " + hour + ":" + min
  }
}