module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          paths: ['src/less']
        },
        files: {
          'src/build/style.css': 'src/less/style.less'
        }
      }
    }
  });

  grunt.registerTask('default', ['less']);
};
