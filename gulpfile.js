const gulp = require('gulp')
const jshint = require('gulp-jshint')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const minify = require('gulp-clean-css')
const qunit = require('gulp-qunit')
const zip = require('gulp-zip')
const connect = require('gulp-connect')

gulp.task('js', function () {
    return gulp.src(['./js/reveal.js']).pipe(uglify()).pipe(rename('reveal.min.js')).pipe(gulp.dest('./js'))
})

gulp.task('css-themes', function () {
    return gulp.src(['./css/theme/source/*.{sass,scss}']).pipe(sass()).pipe(gulp.dest('./css/theme'))
})

gulp.task('css-core', gulp.series(function () {
    return gulp.src(['css/reveal.scss']).pipe(sass()).pipe(autoprefixer()).pipe(gulp.dest('./css'))
}, function () {
    return gulp.src(['css/reveal.css']).pipe(minify({
        compatibility: 'ie9'
    })).pipe(rename('reveal.min.css')).pipe(gulp.dest('./css'))
}))

gulp.task('css', gulp.parallel('css-themes', 'css-core'))

gulp.task('test', gulp.parallel(function () {
    return gulp.src(['./js/reveal.js']).pipe(jshint()).pipe(jshint.reporter('default')).pipe(jshint.reporter('fail'));
}, function () {
    return gulp.src(['./test/*.html']).pipe(qunit())
}))

gulp.task('default', gulp.series(gulp.parallel('js', 'css'), 'test'))

gulp.task('package', gulp.series('default', function () {
    return gulp.src([
        './index.html',
        './css/**',
        './js/**',
        './lib/**',
        './images/**',
        './plugin/**',
        './**.md'
    ]).pipe(zip('reveal-js-presentation.zip')).pipe(gulp.dest('./'))
}))

gulp.task('serve', function () {
    connect.server({
        root: '.',
        livereload: true,
        open: true,
        useAvailablePort: true
    })
    gulp.watch(['js/reveal.js'], gulp.series('js'))
    gulp.watch(['css/theme/source/*.{sass,scss}',
        'css/theme/template/*.{sass,scss}',
    ], gulp.series('css-themes'))
    gulp.watch(['css/reveal.scss'], gulp.series('css-core'))
})