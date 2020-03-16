const gulp = require('gulp')
const zip = require('gulp-zip')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const qunit = require('gulp-qunit')
const header = require('gulp-header')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const minify = require('gulp-clean-css')
const connect = require('gulp-connect')
const autoprefixer = require('gulp-autoprefixer')
const yargs = require('yargs')
const pkg = require('./package.json')
const webpack = require('webpack-stream');

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
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(webpack({
            mode: 'production'
        }))
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
        .pipe(minify({
            compatibility: 'ie9'
        }))
        .pipe(header(license, {pkg: pkg}))
        .pipe(gulp.dest('./dist'))

))

gulp.task('css', gulp.parallel('css-themes', 'css-core'))

gulp.task('test', gulp.series(

    () => gulp.src(['./js/**', 'gulpfile.js']).pipe(eslint()).pipe(eslint.format())
    // () => gulp.src(['./test/*.html']).pipe(qunit())

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

    gulp.watch([
        'css/theme/source/*.{sass,scss}',
        'css/theme/template/*.{sass,scss}',
    ], gulp.series('css-themes'))

    gulp.watch([
        'css/reveal.scss',
        'css/print/*.{sass,scss,css}'
    ], gulp.series('css-core'))

})