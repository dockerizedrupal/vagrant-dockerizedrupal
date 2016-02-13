var current_version = '0.4.6';
var new_version = '0.4.7';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-replace');

  grunt.initConfig({
    replace: {
      task1: {
        options: {
          patterns: [
            {
              match: current_version,
              replacement: new_version
            }
          ],
          usePrefix: false
        },
        files: [
          {
            expand: true,
            src: [
              'VERSION.md'
            ]
          }
        ]
      },
      task2: {
        options: {
          patterns: [
            {
              match: '"version": "' + current_version + '"',
              replacement: '"version": "' + new_version + '"'
            }
          ],
          usePrefix: false
        },
        files: [
          {
            expand: true,
            src: [
              'package.json'
            ]
          }
        ]
      },
      task3: {
        options: {
          patterns: [
            {
              match: 'VERSION = "' + current_version + '"',
              replacement: 'VERSION = "' + new_version + '"'
            }
          ],
          usePrefix: false
        },
        files: [
          {
            expand: true,
            src: [
              'Vagrantfile'
            ]
          }
        ]
      }
    }
  });

  grunt.registerTask('bump', 'replace');
  grunt.registerTask('default', 'replace');
};
