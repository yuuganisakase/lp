/*global module:false*/
module.exports = function(grunt) {
  
  var exec = require('child_process').exec;
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: [
        'src/js/model/ItemModel.js',
        'src/js/model/MainModel.js',
        'src/js/util/LoadTemplateCommand.js',
        'src/js/util/LoadFeedCommand.js',
        'src/js/view/ItemView.js',
        'src/js/view/MainItemView.js',
        'src/js/view/RecommendItemView.js',
        'src/js/view/HeaderView.js',
        'src/js/app.js'
        ],
        dest: 'src/js/dist.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    lint: {
      files: ['grunt.js','src/index.html',  'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'qunit copy'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
    
  });
  
  grunt.registerTask('copy', 'copy copy copy', function() {
    console.log("copy");
      var done = this.async();
      exec('cp -rfp ' + 'src/ ' + '/Library/WebServer/Documents/src/' , function(error, stdout, stderr){
        if(error) console.log(error);
        console.log("copy done");
        done(true);
      });
  });
    grunt.registerTask('stylus', 'stylus stylus', function() {
    console.log("stylus");
      var done = this.async();
      exec('stylus stylus --out src/css' , function(error, stdout, stderr){
        if(error) console.log(error);
        console.log("stylus done");
        done(true);
      });
  });
  grunt.registerTask('default', 'concat stylus qunit');
};
