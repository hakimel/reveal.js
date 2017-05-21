module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        htmlhint: {
            options: {
                'attr-lower-case': true,
                'attr-value-not-empty': false,
                'tag-pair': true,
                'tag-self-close': false,
                'tagname-lowercase': true,
                'id-class-value': true,
                'id-unique': true,
                'img-alt-require': true,
                'img-alt-not-empty': true
            },
            main: {
                src: ['public/**.html']
            }
        },

        jshint: {
            main: {
                files: [{
                    src: ['Gruntfile.js', 'js/**/*.js']
                }]
            },
            options: {
                globals: {
                    'jQuery': true,
                    'console': true
                }
            }
        },

        pug: {
            options: {
                pretty: true,
                data: {
                    debug: true
                }
            },
            pages: {
                files: [{
                    expand: true,
                    cwd: 'pug/pages',
                    src: '*.pug',
                    dest: 'public/',
                    ext: '.html'
                }]
            }
        },

        copy: {
            iejs: {
                expand: true,
                files: [{
                        expand: true,
                        cwd: 'bower_components/html5shiv/dist',
                        src: "**",
                        dest: 'public/js'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/respond/src',
                        src: "**",
                        dest: 'public/js'
                    }
                ]
            },
            fonts: {
                expand: true,
                files: [{
                    expand: true,
                    cwd: 'fonts',
                    src: "**",
                    dest: 'public/fonts'
                }]
            },
            imgrsrc: {
                expand: true,
                files: [{
                    expand: true,
                    cwd: 'img',
                    src: "**",
                    dest: 'public/img'
                }]
            },
            revealsrcblob: {
                expand: true,
                files: [{
                  expand: true,
                  cwd: 'bower_components/reveal.js/plugin',
                  src: "**",
                  dest: 'public/plugin'
              },{
                  expand: true,
                  cwd: 'bower_components/reveal.js/lib',
                  src: "**",
                  dest: 'public/lib'
              },{
                  expand: true,
                  cwd: 'bower_components/reveal.js/css/theme',
                  src: "*.css",
                  dest: 'public/css/theme'
              },{
                  expand: true,
                  cwd: 'bower_components/reveal.js/css/print',
                  src: "**",
                  dest: 'public/css'
              }]
            }
        },

        uglify: {
            compress: {
                files: {
                    'public/js/index.js': [
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'bower_components/reveal.js/lib/js/head.min.js',
                        'bower_components/reveal.js/js/reveal.js',
                        'js/*.js'
                    ]
                },
                options: {
                    mangle: true,
                    unused: true
                }
            }
        },

        cssmin: {
            options: {
                sourceMap: true
            },
            compress: {
                files: {
                    'public/css/index.css': [
                        'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'bower_components/normalize-css/normalize.css',
                        'bower_components/reveal.js/css/reveal.css',
                        'bower_components/reveal.js/lib/css/zenburn.css'//,
                        // 'css/*.css'
                    ]
                }
            }
        },

        watch: {
            grunt: {
                files: ['Gruntfile.js'],
                options: {
                    nospawn: true,
                    keepalive: true,
                    livereload: true
                },
                tasks: ['public:dev']
            },
            html: {
                files: ['public/*.html'],
                options: {
                    nospawn: true,
                    keepalive: true,
                    livereload: true
                },
                tasks: ['htmlhint']
            },
            js: {
                files: 'js/**',
                options: {
                    nospawn: true,
                    livereload: true
                },
                tasks: ['jshint', 'uglify']
            },
            pug: {
                files: ['pug/**'],
                options: {
                    nospawn: true,
                    livereload: true
                },
                tasks: ['pug']
            },
           css: {
               files: 'css/**',
               options: {
                   nospawn: true,
                   livereload: true
               },
               tasks: ['cssmin']
           }
        },

        connect: {
            server: {
                options: {
                    port: 8080,
                    base: 'public',
                    hostname: 'localhost',
                    livereload: true
                }
            }
        }

    });

    grunt.registerTask('public:dev', function(target) {
        grunt.task.run([
            'pug',
            'htmlhint',
            'jshint',
            'copy',
            'uglify',
            'cssmin'
        ]);
    });

    grunt.registerTask('serve', function(target) {
        grunt.task.run([
            'public:dev',
            'connect',
            'watch'
        ]);
    });

};
