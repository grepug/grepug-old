function AVcustom(obj) {
  this.AV = AV.initialize("xr3759mn36mdgbwuef3guyy0s45gooe1x9ggcp67yefecdy2", "7sa4nztm68wjud0q939y26a4jwmmep0zwjui6hj95il4lx1c")
  this.Obj = AV.Object.extend(obj)
}

AVcustom.prototype._init = function () {

  this.

}

AVcustom.prototype.get = function (options, callback) {

  var query = new AV.Query(this.Obj)

  if (Array.isArray(options.obj))
    var obj = options.obj
  else if (typeof options.obj === 'string') var obj = [options.obj]
  if (options.order && options.orderby == 'desc') query.descending(options.order)
  else if (options.order) query.ascending(options.order)

  query.find({
    success: function (r) {
      var ret = []
      for (var i = 0; i < r.length; i++) {
        var o = {}
        for (var j = 0; j < obj.length; j++) {
          o[obj[j]] = r[i].get(obj[j])
        }
        ret.push(o)
      }
      callback(ret)
    },
    error: function (err) {
      callback(err)
    }
  })
}

AVcustom.prototype.save = function () {

}