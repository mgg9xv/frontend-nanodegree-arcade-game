var gulp = require('gulp');
var gulpIf = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var responsive = require('gulp-responsive');
var pug = require('gulp-pug');

gulp.task('watch', ['browserSync', 'compile-pug-to-html', 'compile-scss-to-css'],function(){

    gulp.watch('src/views/*.pug', ['compile-pug-to-html']);
    gulp.watch('src/*.html', browserSync.reload);

    gulp.watch('src/stylesheets/scss/*', ['compile-scss-to-css']);

    gulp.watch('src/js/**/*.js', browserSync.reload);

});

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })
});

gulp.task('compile-pug-to-html', function buildHTML() {
    return gulp.src('src/views/**/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('src'))
});

gulp.task('compile-scss-to-css', function(){
    return gulp.src('src/stylesheets/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/stylesheets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('optimize-files', function(){
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-images-to-dist', function() {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            interlaced: true,
        }))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('generate-images', function() {
    del.sync('src/images/*.png');
    return gulp.src('src/images/src/**/*.png')
        .pipe(responsive({
            '*.png': [{
                width: 101,
                rename: { suffix: '-large' },
            },{
                width: 75,
                rename: { suffix: '-medium' },
            },{
                width: 50,
                rename: { suffix: '-small' },
            }]
        }, {
            progressive: true,
            compressionLevel: 6,
            withMetadata: false,
            strictMatchImages: false
        }))
        .pipe(gulp.dest('src/images'))
});

gulp.task('copy-fonts-to-dist', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('develop', function(callback) {
    runSequence(
        ['generate-images', 'compile-scss-to-css', 'browserSync'],
        'watch',
        callback
    )
});

gulp.task('build', function(callback) {
    runSequence(
        'clean',
        'compile-pug-to-html',
        'generate-images',
        'compile-scss-to-css',
        ['optimize-files', 'copy-images-to-dist', 'copy-fonts-to-dist'],
        callback
    )
});