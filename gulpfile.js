var gulp = require('gulp');
var minify = require('gulp-minify');
var shell = require('gulp-shell')

gulp.task('default', ['compress'], function() {
    // ...
});

gulp.task('publish', function() {
    gulp.src('lib/*.js')
        .pipe(shell([
            'git push origin master',
            'npm publish'
        ]));
});

gulp.task('test', function() {
    gulp.src('lib/*.js').
        pipe(shell([
            'clear',
            'npm test'
        ]));
});

gulp.task('compress', function() {
    gulp.src('lib/*.js')
        .pipe(minify())
        .pipe(gulp.dest('dist'))
});
