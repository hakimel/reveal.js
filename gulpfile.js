const pkg = require('./package.json')
const path = require('path')
const glob = require('glob')
const yargs = require('yargs')
const colors = require('colors')
const webpack = require('webpack-stream')
const { runQunitPuppeteer, printResultSummary, printFailedTests } = require('node-qunit-puppeteer')

const gulp = require('gulp')
const tap = require('gulp-tap')
const zip = require('gulp-zip')
const sass = require('gulp-sass')
const header = require('gulp-header')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const minify = require('gulp-clean-css')
const connect = require('gulp-connect')
const autoprefixer = require('gulp-autoprefixer')

const root = yargs.argv.root || '.'
const port = yargs.argv.port || 8000

const license = `/*!
* reveal.js <%= pkg.version %> (<%= new Date().toDateString() %>)
* <%= pkg.homepage %>
* MIT licensed
*
* Copyright (C) 2020 Hakim El Hattab, https://hakim.se
*/\n`


const swallowError = function(error) {
  console.log(error.toString())
  this.emit('end')
}

gulp.task('js', () => gulp.src(['./js/index.js'])
        .pipe(webpack(require('./webpack.config.js')))
        .on('error', swallowError)
        .pipe(header(license, {pkg: pkg}))
        .pipe(rename('reveal.min.js'))
        .pipe(gulp.dest('./dist')))

gulp.task('css-themes', () => gulp.src(['./css/theme/source/*.{sass,scss}'])
        .pipe(sass())
        .pipe(gulp.dest('./dist/theme')))

gulp.task('css-core', gulp.series(

    () => gulp.src(['css/reveal.scss'])
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist')),
    () => gulp.src(['dist/reveal.css'])
        .pipe(minify({compatibility: 'ie9'}))
        .pipe(header(license, {pkg: pkg}))
        .pipe(gulp.dest('./dist'))

))

gulp.task('css', gulp.parallel('css-themes', 'css-core'))

gulp.task('test-qunit', function() {

    let testFiles = glob.sync('test/*.html' )

    let totalTests = 0;
    let failingTests = 0;

    let tests = Promise.all( testFiles.map( filename => {
        return new Promise( ( resolve, reject ) => {
            runQunitPuppeteer({
                targetUrl: `file://${path.join(__dirname, filename)}`,
                timeout: 10000,
                redirectConsole: true,
                puppeteerArgs: ['--allow-file-access-from-files']
            })
                .then(result => {
                    if( result.stats.failed > 0 ) {
                        console.log(`${'!'} ${filename} [${result.stats.passed}/${result.stats.total}] in ${result.stats.runtime}ms`.red);
                        // printResultSummary(result, console);
                        printFailedTests(result, console);
                    }
                    else {
                        console.log(`${'✔'} ${filename} [${result.stats.passed}/${result.stats.total}] in ${result.stats.runtime}ms`.green);
                    }

                    totalTests += result.stats.total;
                    failingTests += result.stats.failed;

                    resolve();
                })
                .catch(error => {
                    console.error(error);
                    reject();
                });
        } )
    } ) );

    return new Promise( ( resolve, reject ) => {

        tests.then( () => {
                if( failingTests > 0 ) {
                    reject( new Error(`${failingTests}/${totalTests} tests failed`.red) );
                }
                else {
                    console.log(`${'✔'} Passed ${totalTests} tests`.green.bold);
                    resolve();
                }
            } )
            .catch( () => {
                reject();
            } );

    } );
} )

gulp.task('test', gulp.series(

    () => gulp.src(['./js/**', 'gulpfile.js']).pipe(eslint()).pipe(eslint.format()),
    'test-qunit'

))

gulp.task('default', gulp.series(gulp.parallel('js', 'css'), 'test'))

gulp.task('package', gulp.series('default', () =>

    gulp.src([
        './index.html',
        './dist/**',
        './lib/**',
        './images/**',
        './plugin/**',
        './**.md'
    ]).pipe(zip('reveal-js-presentation.zip')).pipe(gulp.dest('./'))

))

gulp.task('serve', () => {

    connect.server({
        root: root,
        port: port,
        host: '0.0.0.0',
        livereload: true
    })

    gulp.watch(['js/**'], gulp.series('js', 'test'))

    gulp.watch(['test/*.html'], gulp.series('test'))

    gulp.watch([
        'css/theme/source/*.{sass,scss}',
        'css/theme/template/*.{sass,scss}',
    ], gulp.series('css-themes'))

    gulp.watch([
        'css/reveal.scss',
        'css/print/*.{sass,scss,css}'
    ], gulp.series('css-core'))

})