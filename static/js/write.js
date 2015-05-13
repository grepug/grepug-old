$(function () {

  new Editor({
    textarea: '#g-write-editor',
    preview: '.g-write-preview',
    marked: marked,
    indent: 2,
    autoHeight: true
  })._init()

})

function Editor(options) {

  this.textarea = options.textarea
  this.preview = options.preview
  this.marked = options.marked
  this.autoHeight = options.autoHeight

  this.pressing = {
    "16": false,

  }
  this.keyPreventDefault = [9]

  this.selected = false
  this.selectedValue = ''
  this.startPos
  this.endPos
}

Editor.prototype._init = function () {
  var that = this
  var $preview = $(this.preview)
  this.textareaObj = $(this.textarea).get(0)
  this.tmpValue = this.textareaObj.value

  $(this.textarea)
    .keydown(function (e) {
      if (that.keyPreventDefault.indexOf(e.which) != -1) e.preventDefault()
      that.pressing[e.which] = true
        //console.log(that.pressing)
      that.autoKey(e)
    })
    .keypress(function (e) {

      var content = this.value
      if (that.preview) $preview.html(that.marked(content))

    })
    .keyup(function (e) {
      that.pressing[e.which] = false
      if (that.autoHeight) that._autoHeight()
    })
    .select(function (e) {
      that.startPos = this.selectionStart
      that.endPos = this.selectionEnd
      that.selectedValue = this.value.substring(that.startPos, that.endPos)
      if (that.selectedValue.length == 0) that.selected = false
      else that.selected = true
      console.log(that.startPos)
      console.log(that.endPos)
      console.log(that.selectedValue.length)
    })
    .click(function () {
      that.selected = false
      console.log(that.selected)
    })
    .blur(function () {
      that.selected = false
    })
}

Editor.prototype.autoKey = function (e) {
  var obj = this.textareaObj

  if (this.pressing['16']) {
    switch (e.which) {
    case 57:
      this.insert(")", 1)
      break
    case 219:
      this.insert("}", 1)
      break
    case 222:
      this.insert("\"", 1)
      break
    case 9:
      if (this.selected) {
        var s = this.selectedValue.replace(/^\n\s\s/gm, "")
          //if (!/\n/.test(obj.value.substr(0, this.startPos)))
        obj.value = obj.value.substr(0, this.startPos) + s + obj.value.substr(this.endPos)
        console.log(s)
      }
      break
    }
  } else if (e.which == 9) {
    if (this.selected) {
      var s = this.selectedValue.replace(/\n/g, "\n  ")
      if (!/\n/.test(obj.value.substr(0, this.startPos)))
        obj.value = '  ' + obj.value.substr(0, this.startPos) + s + obj.value.substr(this.endPos)
      else obj.value = obj.value.substr(0, this.startPos) + s + obj.value.substr(this.endPos)
      if (/\n/.test(obj.value)) var ss = obj.value.match(/\n/g).length + 1
      else ss = 1
      obj.selectionStart = this.startPos
      obj.selectionEnd = this.endPos + ss * 2
        //console.log(s)
    } else this.insert("  ")
  } else if (e.which == 219) this.insert("]", 1)
  else if (e.which == 222) this.insert("\'", 1)
  else if (e.which == 13) {
    var startPos = this.textareaObj.selectionStart
    var tmpStr = this.textareaObj.value
    var preChar = tmpStr.substr(0, startPos).substr(-1)
    var nextChar = tmpStr.substr(0, startPos + 1).substr(-1)
    if (preChar == '{' && nextChar == '}') {
      this.insert("\n  ")
      this.textareaObj.createTextRange
    }

    //console.log(nextChar)
  }
}

Editor.prototype.insert = function (str, backspace) {
  backspace = backspace || 0
  var obj = this.textareaObj
  if (document.selection) {
    var sel = document.selection.createRange();
    sel.text = str;
  } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
    var startPos = obj.selectionStart,
      endPos = obj.selectionEnd,
      cursorPos = startPos,
      tmpStr = obj.value;
    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
    cursorPos += str.length;
    obj.selectionStart = obj.selectionEnd = cursorPos - backspace;
  } else {
    obj.value += str;
  }
}

Editor.prototype._autoHeight = function () {
  this.textareaObj.style.height = this.textareaObj.scrollHeight
  console.log(this.textareaObj.style.height)
  console.log(this.textareaObj.scrollHeight)
}