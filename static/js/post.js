$(function () {

  AV.initialize("xr3759mn36mdgbwuef3guyy0s45gooe1x9ggcp67yefecdy2", "7sa4nztm68wjud0q939y26a4jwmmep0zwjui6hj95il4lx1c");

  AV.Cloud.run('getObject', {
    _class: 'Comment',
    Obj: ['content', 'mdName'],
    orderBy: 'createdAt'
  }, {
    success: function (r) {
      console.log(r)
    }
  })

  String.prototype.getParam = function (parm) {
    var reg = new RegExp("(^|&)" + parm + "=([^&]*)(&|$)")

    var r = this.substr(this.indexOf("\?") + 1).match(reg)
    if (r != null) return decodeURI(r[2])
    return null
  }

  $('nav').addClass('navbar-fixed-top')

  var url = location.href;
  var title = url.getParam("title")

  AV.Cloud.run('getPost', {}, {
    success: function (r) {
      console.log(r)
    }
  })

  $.getJSON('../json/posts.json', function (r) {
    for (var i = 0; i < r.length; i++) {
      if (r[i].title == title.replace("#", "")) {
        var content = decodeURI(r[i].content)
        var author = r[i].author
        var updatedAt = r[i].updatedAt
        var createdAt = r[i].createdAt
        var mdName = r[i].mdName
      }
    }

    AV.Cloud.run('getComment', {
      postId: postId
    }, {
      success: function (r) {
        var tpl = gTpl("#g-post-comment-tpl")

        Handlebars.registerHelper('time', function (date, nicetime, options) {
          return new NiceTime(date, 'EN', nicetime).get()
        })

        for (var i = 0; i < r.length; i++) {
          var obj = r[i]
          $('.g-blog-post-main').after(tpl({
            username: obj.get('username'),
            content: decodeURI(obj.get('content')),
            createdAt: obj.createdAt,
            i: i + 1
          }))
        }
      }
    })

    new Comment(mdName).get(function (r) {
      var tpl = gTpl("#g-post-comment-tpl")

      Handlebars.registerHelper('time', function (date, nicetime, options) {
        return new NiceTime(date, 'EN', nicetime).get()
      })

      for (var i = 0; i < r.length; i++) {
        var obj = r[i]
        $('.g-blog-post-main').after(tpl({
          username: obj.get('username'),
          content: decodeURI(obj.get('content')),
          createdAt: obj.createdAt,
          i: i + 1
        }))
      }
    })

    Handlebars.registerHelper('time', function (date, nicetime, options) {
      return new NiceTime(date, 'EN', nicetime).get()
    })

    $('title').text(title)
    var postTpl = gTpl('#g-post-tpl')
    var commentTpl = gTpl('#g-post-comment-tpl')
    var editorTpl = gTpl('#g-post-comment-editor-tpl')
    $('.g-blog-post-main').html(postTpl({
      content: content,
      updatedAt: updatedAt,
      author: author,
      createdAt: createdAt
    }))
    $('.g-blog-comment-editor').html(editorTpl())

    $('#g-blog-comment-submit').click(function () {
      var content = $('#comment').val()
      var username = $('#username').val()
      new Comment(mdName, content, username).put(function () {
        location.reload()
      })
    })
    $('#g-editor-larger').click(function () {
      var content = $('.comment').val()
      $('#g-editor-modal textarea').val(content)
      $('.g-editor-preview').html(marked(content))
    })

    var shiftKey = false;
    $('#g-editor-modal textarea')
      .keyup(function (e) {
        var $this = $(this)
        var content = $this.val()
        var height = this.scrollHeight
        $('.g-editor-preview').html(marked(content))
        $this.css('height', height)
        if (e.which == 16) shiftKey = false
      })
      .keydown(function (e) {
        if (e.which === 16) shiftKey = true
        if (e.which === 9 && shiftKey === true) {
          e.preventDefault()
          console.log("ShiftTab")
        }
        if (e.which === 9 && shiftKey === false) {
          e.preventDefault()
          insertText(this, '  ')
        }
        keyCombination(e, this, shiftKey)
      })
    $('#g-editor-modal').on('hidden.bs.modal', function (e) {
      $('.comment').val($('.comment-modal').val())
    })

    if ($(window).height() < $('body').height()) $('footer').removeClass('navbar-fixed-bottom')
  })
})


function test() {
  $()
}

function Comment(mdName, content, username) {

  this.content = content
  this.username = username
  this.mdName = mdName

  this.Comment = AV.Object.extend('Comment')
}

Comment.prototype.put = function (callback) {

  var markedd = marked(this.content)
  var encoded = encodeURI(markedd)
  console.log(this.content)
  console.log(encoded)
  console.log(decodeURI(encoded))


  var comment = new this.Comment()
  comment.save({
    username: this.username,
    content: encoded,
    //userIp: userIp,
    mdName: this.mdName
  }, {
    success: function (r) {
      callback(r)
    },
    error: function () {

    }
  })
}

Comment.prototype.get = function (callback) {

  var query = new AV.Query(this.Comment)
  query.equalTo("mdName", this.mdName)
  query.ascending("createdAt")
  query.find({
    success: function (r) {
      callback(r)
    },
    error: function (err) {
      console.log(err)
    }
  })

}

function gTpl(selector) {
  var source = $(selector).html();
  return Handlebars.compile(source);
}

function insertText(obj, str, backspace) {
  backspace = backspace || 0
  if (document.selection) {
    var sel = document.selection.createRange();
    sel.text = str;
  } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
    var startPos = obj.selectionStart,
      endPos = obj.selectionEnd,
      cursorPos = startPos,
      tmpStr = obj.value;
    console.log(tmpStr)
    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
    cursorPos += str.length;
    obj.selectionStart = obj.selectionEnd = cursorPos - backspace;
  } else {
    obj.value += str;
  }
}

function keyCombination(e, obj, shiftKey) {
  //var e = window.event;
  if (shiftKey === true && e.which == 57)
    insertText(obj, ")", 1)
  else if (shiftKey === true && e.which == 219)
    insertText(obj, "}", 1)
    //  else if (shiftKey === true && e.which == 9)
    //    alert(1)
  else if (e.which == 219)
    insertText(obj, "]", 1)
}

function htmlEntity(html) {
  html = html.replace(/[\r\n]/g, "")
  html = html.replace(/\</g, "&lt;")
  html = html.replace(/\>/g, "&gt;")
  html = html.replace(/\"/g, "&quot;")
  html = html.replace(/\'/g, "&#39;")
  html = html.replace(/\s/g, "&nbsp;")
  return html
}

function htmlEntityRe(entity) {
  entity = entity.replace(/&lt;/g, "<")
  entity = entity.replace(/&gt;/g, ">")
  entity = entity.replace(/&#39;/g, "\'")
  entity = entity.replace(/&quot;/g, "\"")

  // var code = entity.replace(/<code>([\w|\W])+<\/code>/, )

}