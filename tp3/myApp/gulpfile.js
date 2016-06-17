(function() {
  'use strict';
    var gulp = require('gulp'),
        nodemon = require('gulp-nodemon'),
        watch = require('gulp-watch'),
        livereload = require('gulp-livereload'),
        _paths = ['./public/**/*.*', './views/**/*.pug','./routes/*.js', '*.js'],
        options = {'port': 35729, 'host': 'localhost', 'start': true};
    
    //register nodemon task
    gulp.task('nodemon', function() {
        nodemon({
            script: './bin/www',
            env: {
                'NODE_ENV': 'development'
            }
        }).on('restart', function(){
            livereload.listen(options);
        });
        
    });

    // Send changes to the livereload server
    function notifyLivereload(event) {
        var fileName = require('path').relative(__dirname, event.path);
        livereload.changed(fileName);
    }
 
    // Rerun the task when a file changes
    gulp.task('watch', function() {
        livereload.listen(options);
        watch(_paths, notifyLivereload);
    });

    // The default task (called when you run `gulp` from cli)
    gulp.task('default', ['nodemon', 'watch']);
}());