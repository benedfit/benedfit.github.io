module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
			dev: {
				options: {
					config: 'config.rb',
					force: true
				}
			}
		},
		imagemin: {
			deploy: {
				files: [{
	                expand: true,
	                cwd: '_deploy',
	                src: ['**/*.{gif,jpg,png}'],
	                dest: '_deploy'
	            }]
           	}
		},
		jekyll: {
			dev: {
				options: {
					config: ['_config.yml','_config-dev.yml'],
					force: true
				}
			}
		},
		shell: {
			compass: {
				options: {
		            stdout: true
		       	},
				command: 'bundle exec compass compile -e production --force --debug-info'
			},
			jekyll: {
				options: {
		            stdout: true
		       	},
				command: 'bundle exec jekyll build --trace'
			}
		},
		svgmin: {
			deploy: {
				files: [{
	                expand: true,
	                cwd: '_deploy',
	                src: ['**/*.svg'],
	                dest: '_deploy'
	            }]
           	}
		},
		watch: {
			dev: {
				files: 'source/**',
				tasks: ['compass', 'jekyll']
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-svgmin');
	
	grunt.registerTask('default', ['compass', 'jekyll', 'watch']);
	grunt.registerTask('deploy', ['shell:compass', 'shell:jekyll', 'imagemin']);
};