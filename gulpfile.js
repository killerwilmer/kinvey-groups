var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var paths = {
    root: './',
    app: './app/',
    bower: './bower_components/',
    components: './app/components/',
    views: './app/views/',
};

function handleError(err) {
    //console.log(err.toString());
    this.emit('end');
}

//
// Build
//

gulp.task('build', function(cb) {
    runSequence(
        'build-js',
        cb
    );
});

gulp.task('build-js', function() {
    return gulp.src([
        // bower
        paths.bower + 'jquery/dist/jquery.js',
        paths.bower + 'angular/angular.js',
        paths.bower + 'angular-route/angular-route.js',
        paths.bower + 'angular-resource/angular-resource.js',
        paths.bower + 'angular-animate/angular-animate.js',
        paths.bower + 'angular-sanitize/angular-sanitize.js',
        paths.bower + 'ngtoast/dist/ngToast.js',
        paths.bower + 'kinvey-angular/kinvey-angular.js',
        paths.bower + 'codemirror/lib/codemirror.js',
        paths.bower + 'codemirror/mode/javascript/javascript.js',
        paths.bower + 'angular-ui-codemirror/ui-codemirror.js',

        paths.app + 'setup.js',
        paths.components + '**/*.js',
        paths.views + '**/*.js',
        paths.app + 'app.js',
    ])
        .pipe($.plumber(handleError))
        .pipe($.concat('app.min.js'))
        .pipe($.ngAnnotate())
        //.pipe($.uglify({keepSpecialComments: 0}))
        .pipe(gulp.dest(paths.root));
});


//
// Watch
//

gulp.task('watch', function(cb) {
    runSequence(
        'watch-js',
        cb
    );
});

gulp.task('watch-js', function() {
    return gulp.watch([paths.app + '**/*.js'], ['build-js']);
});

gulp.task('default', function(cb) {
    runSequence(
        [
            'build-js',
            'watch'
        ],
        cb
    )
});

//
// Default
//

gulp.task('default', function(cb) {
    runSequence(
        'build',
        'watch',
        cb
    );
});
