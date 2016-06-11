var gulp = require('gulp');
var LIVERELOAD_PORT = 35729;
var EXPRESS_ROOT = __dirname;
var lr = require('tiny-lr')();
var nodemon = require('gulp-nodemon');
var serverFiles = [
    './public/**/*',
    './views/**/*.pug',
    './routes/**/*.js',
    './**/*.js'
]

function startServer() {
    nodemon({
        script: './bin/www',
    }).on('restart', function () {
      console.log('restarted!')
    });
}

function startLivereload() {
    lr.listen(LIVERELOAD_PORT);
}

function notifyLivereload(event) {
    var fileName = require('path').relative(EXPRESS_ROOT, event.path);
    lr.changed({
        body: {
            files: [fileName]
        }
    });
}

// Default task that will be run
// when no parameter is provided
// to gulp
gulp.task('default', function () {
    startServer();
    startLivereload();
    gulp.watch(serverFiles, notifyLivereload);
});