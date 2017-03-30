var gulp = require('gulp');
var connect = require('gulp-connect');
var browserSync = require('browser-sync');

gulp.task('js', function() {
    gulp.src('./scripts/*.js')
        .pipe(connect.reload())
})

gulp.task('html', function() {
    gulp.src('./*.html')
        .pipe(connect.reload())
})

gulp.task('style', function() {
    gulp.src('./styles/*.css')
        .pipe(connect.reload())
})

gulp.task('webserver', function() {
    connect.server({
        livereload: true,
        port: 2333,
        root:'./'
    })
})


gulp.task('watch', function() {
    gulp.watch('./*.html', ['html']);
    gulp.watch('./styles/*.css', ['style']);
    gulp.watch('./scripts/*.js', ['js']);

})
gulp.task('default', ['webserver', 'watch'])
