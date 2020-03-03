const gulp = require('gulp')
const zip = require('gulp-zip')
const sass = require('gulp-sass')
const qunit = require('gulp-qunit')
const header = require('gulp-header')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const minify = require('gulp-clean-css')
const connect = require('gulp-connect')
const autoprefixer = require('gulp-autoprefixer')
const pkg = require('./package.json')

const license = `/*!
* reveal.js <%= pkg.version %> (<%= new Date().toDateString() %>)
* <%= pkg.homepage %>
* MIT licensed
*
* Copyright (C) 2020 Hakim El Hattab, https://hakim.se
*/\n`

gulp.task('js', () => gulp.src(['./js/reveal.js'])
        .pipe(uglify())
        .pipe(header(license, {pkg: pkg}))
        .pipe(rename('reveal.min.js'))
        .pipe(gulp.dest('./js')))

gulp.task('css-themes', () => gulp.src(['./css/theme/source/*.{sass,scss}'])
        .pipe(sass())
        .pipe(gulp.dest('./css/theme')))

gulp.task('css-core', gulp.series(

    () => gulp.src(['css/reveal.scss']).pipe(sass()).pipe(autoprefixer()).pipe(gulp.dest('./css')),
    () => gulp.src(['css/reveal.css']).pipe(minify({
        compatibility: 'ie9'
    })).pipe(header(license, {pkg: pkg}))
       .pipe(gulp.dest('./css'))

))

gulp.task('css', gulp.parallel('css-themes', 'css-core'))

gulp.task('test', gulp.series(

    () => gulp.src(['./js/reveal.js']).pipe(eslint()).pipe(eslint.format()),
    () => gulp.src(['./test/*.html']).pipe(qunit())

))

gulp.task('default', gulp.series(gulp.parallel('js', 'css'), 'test'))

gulp.task('package', gulp.series('default', () =>

    gulp.src([
        './index.html',
        './css/**',
        './js/**',
        './lib/**',
        './images/**',
        './plugin/**',
        './**.md'
    ]).pipe(zip('reveal-js-presentation.zip')).pipe(gulp.dest('./'))

))

gulp.task('serve', () => {

    connect.server({
        root: '.',
        livereload: true,
        open: true,
        useAvailablePort: true
    })

    gulp.watch(['js/reveal.js'], gulp.series('js'))

    gulp.watch([
        'css/theme/source/*.{sass,scss}',
        'css/theme/template/*.{sass,scss}',
    ], gulp.series('css-themes'))

    gulp.watch(['css/reveal.scss'], gulp.series('css-core'))

})