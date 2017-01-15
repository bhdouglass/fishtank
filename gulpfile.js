var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var gopen = require('gulp-open');
var del = require('del');

var paths = {
    dist: 'www',
    libjs: [
        'bower_components/boid/dist/boid.js',
        'bower_components/phaser/build/phaser.min.js',
    ],
    js: [
        'src/js/fish.js',
        'src/js/fishtank.js',
        'src/js/index.js',
    ],
    img: [
        'src/img/kenney/fishTile_072.png',
        'src/img/kenney/fishTile_074.png',
        'src/img/kenney/fishTile_076.png',
        'src/img/kenney/fishTile_078.png',
        'src/img/kenney/fishTile_080.png',
        'src/img/kenney/fishTile_100.png',
        'src/img/*.png',
    ],
    html: [
        'src/index.html',
    ],
};

gulp.task('clean', function() {
    del.sync(paths.dist);
});

gulp.task('build-html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build-img', function() {
    return gulp.src(paths.img)
        .pipe(gulp.dest(paths.dist + '/img'));
});

gulp.task('build-lib-js', function() {
    return gulp.src(paths.libjs)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(paths.dist + '/js'));
});

gulp.task('build-js', function() {
    return gulp.src(paths.js)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.dist + '/js'));
});


gulp.task('watch', function() {
    gulp.watch(paths.js, ['build-js']);
    gulp.watch(paths.html, ['build-html']);
});

gulp.task('build', ['clean', 'build-html', 'build-img', 'build-lib-js', 'build-js']);
gulp.task('default', ['build']);

gulp.task('serve', ['build', 'watch'], function() {
    connect.server({
        root: paths.dist,
        ip: '0.0.0.0',
        port: 8080,
    });

    return gulp.src(paths.html)
        .pipe(gopen({
            uri: 'http://localhost:8080'
        }));
});
