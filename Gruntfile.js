module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      options: {
        livereload: true
      },
      jade: {
        tasks: ["jade:debug", "p"],
        files: ["**/*.jade", "**/*.md", "!layouts/*.jade"]
      }
    },
    jade: {
      options: {
        pretty: true,
        files: {
          "*": ["**/*.jade", "!layouts/*.jade"]
        },
        data: function (dest, src) {
          return require('json/lang.json');
        }
      },
      debug: {
        options: {
          data: function (dest, src) {
            var lang = require('./json/lang.json');
            var posts = require('./json/posts.json');
            return {
              lang: lang,
              posts: posts
            };
          },
          locals: {
            livereload: false
          }
        },
        files: {
          "./index.html": "./jade/index.jade",
          "./post/index.html": './jade/post.jade'
        }
      },
      post: {
        options: {
          data: function () {
            return {
              lang: require('./json.lang.json'),
              mdFile: mdfile
            }
          }
        }
      },
      release: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          "release.html": "test.jade"
        }
      }
    },
    web: {
      options: {
        port: 8001
      }
    },
    blog_generator: {
      options: {
        rawMdPath: './posts-raw/',
        jadePath: './jade/',
        postsJsonPath: './json/posts.json',
        tmpPath: './tmp/tmp.txt'
      }
    }
  });


  var fs = require('fs')
  var jade = require('jade')
  var marked = require('marked')
  var es = require('escape-html')

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-blog-generator');


  grunt.registerTask('web', 'Start web server...', function () {
    var options = this.options();
    var express = require('express');
    var app = express()
    app.use(express.static(__dirname)).listen(options.port)
    console.log('http://localhost:%s', options.port);

    grunt.task.run(["watch:jade"]);
  });

  grunt.registerTask('g', '', function () {
    grunt.task.run('blog_generator')
  })
  grunt.registerTask('p', '', function () {

    var r = require('./json/posts.json')
    var posts = []
    var isNew = function (mdName) {
      for (var i = 0; i < r.length; i++) {
        if (r[i].mdName == mdName) return r[i]
      }
      return true
    }
    grunt.file.recurse('./posts-raw/', function (abs, root, sub, mdName) {
      if (/.md/.test(mdName)) {
        var _isNew = isNew(mdName)
        //var _isNew = true
        var stat = fs.statSync('./posts-raw/' + mdName)
        var md = fs.readFileSync('./posts-raw/' + mdName).toString()
        var html = marked(md).replace(/[\r\n]/g, "")
        var preview = html.match(/<blockquote><p>([\w|\W]+)<\/p><\/blockquote>/)[1]
        var title = html.match(/^<h1\sid=\"(\w|\d|-)+\">([\w|\s|!|\.|\,|\?]+)<\/h1>/)[2]
        console.log(preview)
        console.log(title)

        if (_isNew === true) {
          var data = {
            title: title,
            author: "GrePuG",
            preview: preview,
            content: encodeURI(html),
            mdName: mdName,
            createdAt: stat.ctime,
            updatedAt: stat.ctime,
          }
        } else {
          var data = _isNew
          data.updatedAt = stat.ctime
          data.content = encodeURI(html)
          data.preview = preview
          data.title = title
        }
        posts.push(data)
      }
    })
    posts.sort(function (x, y) {
      if (new Date(x.createdAt).getTime() < new Date(y.createdAt).getTime()) return 1
      return -1
    })
    fs.writeFileSync('./json/posts.json', JSON.stringify(posts))
  })

  grunt.registerTask('escape', '', function () {
    var es = require('escape-html')
    var fs = require('fs')
    var ues = require('unescape-html')
    grunt.task.run(["htmlmin:dev"])
    var html = fs.readFileSync('./posts-raw/min/posts/get-started.min.html', 'utf-8')
      //    fs.write
    var esed = es(html)
    console.log(esed)
    var unesed = ues(esed)
    console.log(unesed)

  })
  grunt.registerTask('default', ['jade', 'web']);
  grunt.registerTask('publish', ['jade:publish']);
};