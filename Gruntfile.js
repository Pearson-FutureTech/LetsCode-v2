/**
 * Gruntfile for Let's Code project
 *
 */

'use strict';

var config = require('./server/config'),
    pjson = require('./package.json');

module.exports = function(grunt) {

    // configurable paths
    var paths = {
        app: 'app',
        dist: 'dist',
        server: 'server'
    };

    grunt.initConfig({

        paths: paths,

        /*
         * The watch task executes tasks if files change
         */
        watch: {

            css: {
                files: ['<%= paths.app %>/styles/{,*/}*.{scss,sass,css}'],
                tasks: 'compass'
            },

            js: {
                files: ['<%= paths.app %>/scripts/**/*.js'],
                tasks: ['testClient']
            },

            html: {
                files: ['<%= paths.app %>/*.ejs'],
                tasks: ['testIntegration']
            },

            templates: {
                files: ['<%= paths.app %>/template/{,**/}*.hbs'],
                tasks: ['testIntegration']
            }

        },

        /*
         * The express task starts an express server with config specified. The
         * server stays open as long as the Grunt is running
         */
        express: {
            dev: {
                options: {
                    port: config.get('express:port'),
                    script: '<%= paths.server %>/server.js'
                }
            },
            integration: {
                options: {
                    port: 9000,
                    script: '<%= paths.server %>/server.js'
                }
            }
        },

        /*
         * The open task opens the system's default browser at the given URL
         */
        open: {
            dev: {
                path: 'http://localhost:<%= express.dev.options.port %>'
            }
        },

        /*
         * The clean task removes directories containing generated files
         */
        clean: {
            dist: '<%= paths.dist %>/*',
            app: '<%= paths.app %>/.tmp',
            server: '<%= paths.server %>/.tmp'
        },

        /*
         * The jshint task lints the application's JS files
         *
         * To allow different jsHint configurations without risking being too
         * lenient, multiple tasks are set up, each with their own .jshintrc
         * see: https://github.com/jshint/jshint/issues/833 for more details
         */
        jshint: {
            tools: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['Gruntfile.js']
            },
            client: {
                options: {
                    jshintrc: '<%= paths.app %>/.jshintrc'
                },
                src: [
                    '<%= paths.app %>/scripts/**/*.js',
                    '!<%= paths.app %>/scripts/vendor/**/*.js'
                ]
            },
            clientTests: {
                options: {
                    jshintrc: '<%= paths.app %>/test/.jshintrc'
                },
                src: ['<%= paths.app %>/test/**/*.js']
            },
            server: {
                options: {
                    jshintrc: '<%= paths.server %>/.jshintrc'
                },
                src: [
                    '<%= paths.server %>/**/*.js',
                    // Server tests are linted in their own task
                    '!<%= paths.server %>/test/**/*.js'
                ]
            },
            serverTests: {
                options: {
                    jshintrc: '<%= paths.server %>/.jshintrc'
                },
                src: ['<%= paths.server %>/test/**/*.js']
            }
        },

        casper: {
            options: {
                test: true
            },
            files: ['test/integration/**/*.js']
        },

        /**
         * Executes server-side unit tests
         */
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    debug: true
                },
                src: ['server/test/**/*.js']
            }
        },

        'mocha_phantomjs': {
            all: ['<%= paths.app %>/test/*.html']
        },

        /*
         * The compass task compiles SASS to CSS. It creates the CSS files in a temporary folder app/.tmp/styles.
         * These files are used when running the app in the development environment and are used to generate the
         * CSS file(s) for distribution by other tasks.
         */
        compass: {
            dist: {
                options: {
                    specify: '<%= paths.app %>/styles/main.sass',
                    sassDir: '<%= paths.app %>/styles',
                    cssDir: '<%= paths.app %>/.tmp/styles',
                    imagesDir: '<%= paths.app %>/img',
                    javascriptsDir: '<%= paths.app %>/scripts',
                    fontsDir: '<%= paths.app %>/fonts',
                    importPath: 'app/bower_components',
                    relativeAssets: true
                }
            },
            dev: {
                options: {
                    specify: '<%= paths.app %>/styles/main.sass',
                    sassDir: '<%= paths.app %>/styles',
                    cssDir: '<%= paths.app %>/.tmp/styles',
                    imagesDir: '<%= paths.app %>/img',
                    javascriptsDir: '<%= paths.app %>/scripts',
                    fontsDir: '<%= paths.app %>/fonts',
                    importPath: 'app/bower_components',
                    relativeAssets: true,
                    debugInfo: false // Having this switched on breaks styling badly for IE 6 & 7
                }
            }
        },

        /**
         * The requirejs task uses the r.js optimizer to build the required modules into a single file.
         */
        requirejs: {
            dist: {
                options: {
                    baseUrl: 'app/scripts',
                    name: '../bower_components/almond/almond',
                    mainConfigFile: 'app/scripts/init.js',
                    include: ['main'],
                    insertRequire: ['main'],
                    out: '<%= paths.dist %>/scripts/main.min.js'
                }
            }
        },

        /*
         * The imagemin task minifies image files (png and jpg/jpeg), creating new files in dist/images
         */
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.app %>/img',
                    src: [
                        '**/*.{png,jpg,jpeg}'
                    ],
                    dest: '<%= paths.dist %>/img'
                }]
            }
        },

        /*
         * The cssmin task minifies the CSS files created by the compass task, creating a new file in dist/styles
         */
        cssmin: {
            dist: {
                files: {
                    '<%= paths.dist %>/styles/main.css': '<%= paths.app %>/.tmp/styles/*.css'
                }
            }
        },

        replace: {
            scriptTags: {
                src: ['dist/*.ejs'],
                overwrite: true,
                replacements: [
                    {
                        from: 'data-main="/scripts/init"',
                        to: ''
                    },
                    {
                        from: '/bower_components/requirejs/require.js',
                        to: '/scripts/main.min.js'
                    },
                    {
                        from: '<meta name="version" content="">',
                        to: '<meta name="version" content="' + pjson.version + '">'
                    }
                ]
            }
        },

        /*
         * The htmlmin task minifies the application's HTML files, creating
         * new files in the dist
         */
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: false,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.app %>',
                    src: '*.ejs',
                    dest: '<%= paths.dist %>'
                }]
            }
        },

        /*
         * The copy task is used to copy across any files needed in the
         * dist directory that are not generated by other build tasks
         */
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= paths.app %>',
                    dest: '<%= paths.dist %>',
                    src: [
                        '*.{ico,txt}',
                        'img/{,*/}*.{webp,gif}',
                        '*.html',
                        '*.ejs',
                        'fonts/*',
                        'styles/*.css',
                        'bower_components/modernizr/modernizr.js',
                        'bower_components/zeroclipboard/ZeroClipboard.js',
                        'bower_components/zeroclipboard/ZeroClipboard.swf',
                        'bower_components/js-beautify/js/lib/beautify.js',
                        'scripts/is_flash_installed.js',
                        'template/**/*.hbs'
                    ]
                }]
            }
        },


        shell: {

            gitCommit: {
                options: {
                    stdout: true
                },
                command: 'git commit -am "Precompiling Assets"'
            },

            bumpPatch: {
                options: {
                    stdout: true
                },
                command: 'npm version patch'
            },

            gitPushToOriginDevelop: {
                options: {
                    stdout: true
                },
                command: 'git push origin develop:develop'
            },

            gitPushToOriginMaster: {
                options: {
                    stdout: true
                },
                command: 'git push origin master:master'
            },

            gitCheckoutMaster: {
                options: {
                    stdout: true
                },
                command: 'git checkout master'
            },

            gitMergeWithDevelop: {
                options: {
                    stdout: true
                },
                command: 'git merge develop --no-ff'
            },

            gitPushToRemoteHeroku: {
                options: {
                    stdout: true
                },
                command: 'git push heroku master'
            },

            gitPushToRemoteHerokuStaging: {
                options: {
                    stdout: true
                },
                command: 'git push heroku-staging master'
            },

            gitStatus: {
                options: {
                    stdout: true
                },
                command: 'git status'
            },

            gitCheckoutLocalMaster: {
                options: {
                    stdout: true
                },
                command: 'git checkout master'
            },

            gitMergeMasterWithDevelop: {
                options: {
                    stdout: true
                },
                command: 'git merge develop'
            }
        }

    });

    // Load NPM Grunt tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-casper');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-shell');

    // Load File Grunt Tasks
    grunt.loadTasks("./tasks");
    grunt.registerTask('drop', [
        'dropSeedableCollections'
    ]);

    grunt.registerTask('seed', [
        'seedCollections'
    ]);

    grunt.registerTask('dropAndSeed', [
        'dropSeedableCollections',
        'seedCollections'
    ]);

    grunt.registerTask('default', [
        'compass:dev',
        'express:dev',
        'open:dev',
        'watch'
    ]);

    grunt.registerTask('test', [
        'testServer',
        'testIntegration',
        'testClient'
    ]);

    grunt.registerTask('testServer', [
        'jshint:server',
        'jshint:serverTests',
        'mochaTest'
    ]);

    grunt.registerTask('testClient', [
        'jshint:client',
        'jshint:clientTests',
        'mocha_phantomjs'
    ]);

    grunt.registerTask('testIntegration', [
        'express:integration',
        'casper'
    ]);

    grunt.registerTask('build', [
        'test',
        'clean',
        'compass:dist',
        'imagemin',
        'requirejs',
        'cssmin',
        'copy',
        'htmlmin', // has to come before replace
        'replace'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'shell:gitCommit',
        'shell:gitStatus',
        'shell:bumpPatch',
        'shell:gitPushToOriginDevelop',
        'shell:gitCheckoutMaster',
        'shell:gitMergeWithDevelop',
        'shell:gitPushToOriginMaster',
        'shell:gitPushToRemoteHeroku'
    ]);

    grunt.registerTask('deployStaging', [
        'build',
        'shell:gitCommit',
        'shell:gitStatus',
        'shell:bumpPatch',
        'shell:gitPushToOriginDevelop',
        'shell:gitCheckoutMaster',
        'shell:gitMergeWithDevelop',
        'shell:gitPushToOriginMaster',
        'shell:gitPushToRemoteHerokuStaging'
    ]);

};
