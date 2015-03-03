/* global module:false */
module.exports = function(grunt) {
	var port = grunt.option('port') || 8000;
	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * http://lab.hakim.se/reveal-js\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) 2015 Hakim El Hattab, http://hakim.se\n' +
				' */'
		},

		qunit: {
			files: [ 'test/*.html' ]
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n'
			},
			build: {
				src: 'js/reveal.js',
				dest: 'js/reveal.min.js'
			}
		},

		sass: {
			core: {
				files: {
					'css/reveal.css': 'css/reveal.scss',
				}
			},
			themes: {
				files: [
					{
						expand: true,
						cwd: 'css/theme/source',
						src: ['*.scss'],
						dest: 'css/theme',
						ext: '.css'
					}
				]
			}
		},

		autoprefixer: {
			dist: {
				src: 'css/reveal.css'
			}
		},

		cssmin: {
			compress: {
				files: {
					'css/reveal.min.css': [ 'css/reveal.css' ]
				}
			}
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				globals: {
					head: false,
					module: false,
					console: false,
					unescape: false,
					define: false,
					exports: false
				}
			},
			files: [ 'Gruntfile.js', 'js/reveal.js' ]
		},

		connect: {
			server: {
				options: {
					port: port,
					base: '.',
                    livereload: true,
                    open: false
				}
			}
		},

		zip: {
			'reveal-js-presentation.zip': [
				'index.html',
				'css/**',
				'js/**',
				'lib/**',
				'images/**',
				'plugin/**'
			]
		},

		watch: {
            options: {
                livereload: true
            },
			js: {
				files: [ 'Gruntfile.js', 'js/reveal.js' ],
				tasks: 'js'
			},
			theme: {
				files: [ 'css/theme/source/*.scss', 'css/theme/template/*.scss' ],
				tasks: 'css-themes'
			},
			css: {
				files: [ 'css/reveal.scss' ],
				tasks: 'css-core'
			},
            html: {
                files: [ 'index.html']
            },
            ejs: {
                files: [ 'source/**/*.ejs' ]
            }
		},
		ejs: {
			options: grunt.file.readJSON('mpSet.json'),
			client: {
				expand: true,
				cwd: 'source',
				src: ['client.ejs'],
				dest: '.',
				ext: '.html'
			},
			master: {
				expand: true,
				cwd: 'source',
				src: ['master.ejs'],
				dest: '.',
				ext: '.html'
			},
			def: {
				expand: true,
				cwd: 'source',
				src: ['default.ejs'],
				dest: '.',
				ext: '.html'
			}
		},
		copy: {
			client: {
				expand: true,
				cwd: '.',
				src: 'client.html',
				dest: '.',
				rename: function(dest, src) {
					return 'index.html';
				}
			},
			master: {
				expand: true,
				cwd: '.',
				src: 'master.html',
				dest: '.',
				rename: function(dest, src) {
					return 'index.html';
				}
			},
			def: {
				expand: true,
				cwd: '.',
				src: 'default.html',
				dest: '.',
				rename: function(dest, src) {
					return 'index.html';
				}
			}
		},
		clean: {
			main: ['*.html', '!index.html']
		}
	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-autoprefixer' );
	grunt.loadNpmTasks( 'grunt-zip' );
	grunt.loadNpmTasks( 'grunt-ejs' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );

	// Default task
	grunt.registerTask( 'default', [ 'css', 'js' ] );

	// JS task
	grunt.registerTask( 'js', [ 'jshint', 'uglify', 'qunit' ] );

	// Theme CSS
	grunt.registerTask( 'css-themes', [ 'sass:themes' ] );

	// Core framework CSS
	grunt.registerTask( 'css-core', [ 'sass:core', 'autoprefixer', 'cssmin' ] );

	// All CSS
	grunt.registerTask( 'css', [ 'sass', 'autoprefixer', 'cssmin' ] );

	// Package presentation to archive
	grunt.registerTask( 'package', [ 'default', 'def', 'zip' ] );

	// Serve presentation locally (this is enough for master server)
	grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

	// Run tests
	grunt.registerTask( 'test', [ 'jshint', 'qunit' ] );

	// Turn the Server into the Master (presentor's) server
	grunt.registerTask( 'master', [ 'ejs:master', 'copy:master', 'clean' ] );

	// Turn the Server into the Clients (audience's) server
	grunt.registerTask( 'client', [ 'ejs:client', 'copy:client', 'clean' ] );

	// Revert the Server back to the default server
	grunt.registerTask( 'def', [ 'ejs:def', 'copy:def', 'clean' ] );

	// Display the ip of currently running machine
	grunt.registerTask( 'ip', 'Dispaly the local IP address of current Machine.', function(arg) {
		var devip = require('dev-ip');
		grunt.log.writeln([devip()]);
	});

};
