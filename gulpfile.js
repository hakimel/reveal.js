const gulp = require('gulp')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const minify = require('gulp-clean-css')
const qunit = require('gulp-qunit')
const zip = require('gulp-zip')
const connect = require('gulp-connect')

gulp.task('js', () => gulp.src(['./js/reveal.js']).pipe(uglify()).pipe(rename('reveal.min.js')).pipe(gulp.dest('./js')))

gulp.task('css-themes', () => gulp.src(['./css/theme/source/*.{sass,scss}']).pipe(sass()).pipe(gulp.dest('./css/theme')))

gulp.task('css-core', gulp.series(
    () => gulp.src(['css/reveal.scss']).pipe(sass()).pipe(autoprefixer()).pipe(gulp.dest('./css')), 
    () => gulp.src(['css/reveal.css']).pipe(minify({
        compatibility: 'ie9'
    })).pipe(rename('reveal.min.css')).pipe(gulp.dest('./css'))
))

gulp.task('css', gulp.parallel('css-themes', 'css-core'))

gulp.task('test', gulp.series(
    () => gulp.src(['./js/reveal.js']).pipe(eslint({useEslintrc: true})).pipe(eslint.format()),
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
    gulp.watch(['css/theme/source/*.{sass,scss}',
        'css/theme/template/*.{sass,scss}',
    ], gulp.series('css-themes'))
    gulp.watch(['css/reveal.scss'], gulp.series('css-core'))
})