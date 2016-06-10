var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var server = require('gulp-express');
var lr = require('tiny-lr')();
var path = require('path');

gulp.task('serve', function(){
    console.log(event.path);
    var fileName = require('path').relative('3000', event.path);
    lr.changed({
        body: {
            files: [fileName]
        }
    });
});


gulp.task('default', function () {
    nodemon({
      script: './bin/www'
    })
    .on('restart', function () {
        console.log('restarted!')
    });

    lr.listen(35729);
    gulp.watch('*', 'serve');
});
