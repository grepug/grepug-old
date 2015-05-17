$(function () {

  var appId = 'xr3759mn36mdgbwuef3guyy0s45gooe1x9ggcp67yefecdy2';
  var appKey = '7sa4nztm68wjud0q939y26a4jwmmep0zwjui6hj95il4lx1c';

  AV.initialize(appId, appKey);

  var Post = AV.Object.extend('Post', {
    initialize: function () {

    },
    defaults: {
      title: null,
      content: null,
      createdAt: null,
      updatedAt: null,
    },

  })

  var PostList = AV.Collection.extend({
    model: Post,

    preview: function () {

      this.query()

    },
    title: function () {
      return this.each(function () {

      })
    },
    comparator: function (v1, v2) {
      var a = v1.updatedAt
      var b = v2.updatedAt
      if (v1 <= v2) return 1
      if (v1 > v2) return -1
    }
  })

  var HomeView = AV.View.extend({

    el: '#content',

    initialize: function () {
      this.postList = postList
      _.bindAll(this, 'render')
      this.postList.bind('reset', this.render)
      this.render()
    },

    events: {
      //"click .g-open-post": "openPost"
    },

    render: function () {
      var tpl = Handlebars.compile($('#blogPreview-tpl').html())
      var p = []

      this.postList.each(function (ret) {
        p.push({
          id: ret.id,
          title: ret.get('title'),
          preview: ret.get('preview'),
          updatedAt: ret.updatedAt
        })
      })

      this.$el.html(tpl({
        p: p
      }))
    }
  })

  var WriteView = AV.View.extend({

    el: '#content',

    events: {
      "click .g-write-submit": "submitPost"
    },

    initialize: function () {

      this.render()

      new Editor({
        el: this.el,
        textarea: '#g-write-editor',
        preview: '.g-write-preview',
        marked: marked,
        indent: 2,
        autoHeight: true
      })._init()

      this.posts = new PostList

      scroll(0, $('nav').offset().top)
    },

    submitPost: function () {

      var html = marked($('#g-write-editor').val()).replace(/[\r\n]/g, "")
      var titleMatch = html.match(/^<h1\sid=\"(\w|\d|-)+\">([\w|\s|!|\.|\,|\?]+)<\/h1>/)
      var previewMatch = html.match(/<blockquote><p>([\w|\W]+)<\/p><\/blockquote>/)
      if (titleMatch && previewMatch && titleMatch[2].length > 5 && previewMatch[1].length > 10) {
        this.posts.create({
          title: title,
          content: encodeURI(html),
          preview: preview
        })
        AV.history.navigate('', {
          trigger: true
        })
      } else alert('Title and Preview are required!')


    },

    render: function () {
      var tpl = Handlebars.compile($('#write-tpl').html())
      this.$el.html(tpl())
    },

  })

  var LoginView = AV.View.extend({

    el: '#content',

    initialize: function () {

      this.render()

      scroll(0, $('nav').offset().top)
    },
    events: {
      'click .login-submit': 'login',
      'click .signup-submit': 'signup'
    },
    render: function () {
      var tpl = Handlebars.compile($('#login-tpl').html())
      this.$el.html(tpl())
    },
    login: function () {
      var username = $('#loginUsername').val()
      var password = $('#loginPassword').val()

      AV.User.logIn(username, password, {
        success: function (r) {
          $('.g-user-login').hide()
          $('.g-user-logout').show()
          appRouter.navigate('', {
            trigger: true
          })
        },
        error: function (r) {
          console.log(r)
        }
      })
    },

    signup: function () {
      var username = $('#signupUsername').val()
      var password = $('#signupPassword').val()

      AV.User.signUp(username, password, {
        ACL: new AV.ACL()
      }, {
        success: function (r) {
          $('.g-user-login').hide()
          $('.g-user-logout').show()
          new WriteView
        }
      })
    }

  })

  var NavView = AV.View.extend({

    initialize: function () {
      this.logToggle()
      AV.User.bind('all', function () {
        alert(14)
      })
    },

    el: 'nav',

    events: {
      "click .g-user-logout": "logout",
    },

    logout: function () {
      AV.User.logOut()
      this.logToggle()

      AV.history.navigate('', {
        trigger: true
      })
    },

    logToggle: function () {
      if (AV.User.current()) {
        $('.g-user-login').hide()
        $('.g-user-logout').show()
      } else {
        $('.g-user-logout').hide()
        $('.g-user-login').show()
      }
    }

  })

  var PostView = AV.View.extend({

    el: "#content",

    initialize: function (id) {
      this.id = id
      this.postList = postList
      _.bindAll(this, 'render')
      this.postList.bind('reset', this.render)
      this.render()

      scroll(0, $('nav').offset().top)
    },

    render: function () {
      var tpl = Handlebars.compile($('#post-tpl').html())
      var that = this
      this.postList.each(function (ret) {
        if (ret.id == that.id)
          that.$el.html(tpl({
            content: decodeURI(ret.get('content')),
            updatedAt: ret.updatedAt,
            createdAt: ret.createdAt
          }))
      })
    },

    events: {

    }
  })

  var AppRouter = AV.Router.extend({
    routes: {
      "": "home",
      "write": "write",
      "login": "login",
      "post/:id": "getPost"
    },

    login2: function (action) {
      //switch (action)
    },

    home: function () {
      new HomeView
    },

    write: function () {
      if (AV.User.current()) new WriteView
      else {
        this.redirect = 'wirte'
        this.navigate('login', {
          trigger: true,
          replace: true
        })
      }
    },

    login: function () {
      if (!AV.User.current()) {
        new LoginView
      }
      //      else this.navigate('', {
      //        trigger: true,
      //        replace: true
      //      })
    },
    getPost: function (id) {
      new PostView(id)
    },
    redirect: undefined
  })

  Handlebars.registerHelper('time', function (date, nicetime, options) {
    return new NiceTime(date, 'EN', nicetime).get()
  })

  var postList = new PostList
  postList.query = new AV.Query(Post)
  postList.fetch()

  new NavView

  var redirect = ''
  var appRouter = new AppRouter

  AV.history.start()

  //  if (history && history.pushState) {
  //    AV.history.start({
  //      pushState: true,
  //      root: '/SPA/',
  //      //hashChange: false
  //    });
  //    console.log('has pushState');
  //  } else {
  //    AV.history.start();
  //    console.log('no pushState');
  //  }
})

// Editor Module
function Editor(options) {

  this.el = options.el
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

  $(this.el).delegate(this.textarea, 'keydown', function () {
      if (that.keyPreventDefault.indexOf(e.which) != -1) e.preventDefault()
      that.pressing[e.which] = true
        //console.log(that.pressing)
      that.autoKey(e)
    })
    .delegate(this.textarea, 'keypress', function (e) {

      var content = this.value
      if (that.preview) $preview.html(that.marked(content))

    })
    .delegate(this.textarea, 'keyup', function (e) {
      that.pressing[e.which] = false
      if (that.autoHeight) that._autoHeight()

      if (that.preview) $preview.html(that.marked(content))
    })
    .delegate(this.textarea, 'select', function (e) {
      that.startPos = this.selectionStart
      that.endPos = this.selectionEnd
      that.selectedValue = this.value.substring(that.startPos, that.endPos)
      if (that.selectedValue.length == 0) that.selected = false
      else that.selected = true
      console.log(that.startPos)
      console.log(that.endPos)
      console.log(that.selectedValue.length)
    })
    .delegate(this.textarea, 'click', function (e) {
      that.selected = false
    })
    .delegate(this.textarea, 'blur', function (e) {
      that.selected = false
      if (that.preview) $preview.html(that.marked(content))
    })
    .delegate(this.textarea, 'change', function (e) {
      if (that.preview) $preview.html(that.marked(content))
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