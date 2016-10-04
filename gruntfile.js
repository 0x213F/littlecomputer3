module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.initConfig({
    // copy: {
    //   html: {
    //     files: [
    //       // includes files within path
    //       {expand: true, flatten: true, src: ['source_html/*.html'], dest: 'public/', filter: 'isFile'},
    //     ],
    //   },
    // },
    uglify: {
      my_target: {
        files: {
          'public/js/script.js': ['source_js/*.js']
        } //files
      } //my_target
    }, //uglify
    compass: {
      dev: {
        options: {
          config: 'compass_config.rb'
        } //options
      } //dev
    }, //compass
    watch: {
      options: { livereload: true },
      scripts: {
        files: ['source_js/*.js']
      }, //script
      sass: {
        files: ['source_sass/*.scss'],
        tasks: ['compass:dev']
      }, //sass
      html: {
        files: ['public/*.html'],
        // tasks: ['copy:html']
      }
    }, //watch
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'app.js'
        }
      }
  }
  }) //initConfig
  grunt.registerTask('serve', ['express:dev', 'watch']);
  grunt.registerTask('default', ['uglify', 'compass:dev', 'serve']);
} //exports
