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
var ghPages = require('gulp-gh-pages');
var uglify = require('gulp-uglify');
var responsive = require('gulp-responsive');

gulp.task('watch', ['browserSync', 'sass'],function(){
    gulp.watch('src/scss/*', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })
});

gulp.task('sass', function(){
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('useref', function(){
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
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

gulp.task('clean', function() {
    return del.sync('dist');
})

gulp.task('clean:dist', function() {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('develop', function(callback) {
    runSequence(
        ['generate-images', 'sass', 'browserSync'],
        'watch',
        callback
    )
});

gulp.task('build', function(callback) {
    runSequence(
        'clean:dist',
        'generate-images',
        'sass',
        ['useref', 'images'],
        callback
    )
});

gulp.task('deploy', function(){
    gulp.src('./dist/**/*')
        .pipe(ghPages({
            origin: "origin",
            branch: "gh-pages",
            force: true
        }));
});