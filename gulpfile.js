var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var gopen = require('gulp-open');
var preprocess = require('gulp-preprocess');
var surge = require('gulp-surge');
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
        'src/img/kenney/fishTile_073.png',
        'src/img/kenney/fishTile_075.png',
        'src/img/kenney/fishTile_077.png',
        'src/img/kenney/fishTile_079.png',
        'src/img/kenney/fishTile_081.png',
        'src/img/kenney/fishTile_101.png',

        'src/img/kenney/fishTile_056.png',
        'src/img/kenney/fishTile_057.png',
        'src/img/kenney/fishTile_060.png',
        'src/img/kenney/fishTile_061.png',
        'src/img/kenney/fishTile_062.png',
        'src/img/kenney/fishTile_063.png',

        'src/img/kenney/fishTile_032.png',
        'src/img/kenney/fishTile_033.png',
        'src/img/kenney/fishTile_084.png',
        'src/img/kenney/fishTile_085.png',

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
        .pipe(preprocess({context: {
            CORDOVA: !!process.env.CORDOVA
        }}))
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

gulp.task('deploy', ['build'], function() {
    return surge({
        project: paths.dist,
        domain: 'fishtank.bhdouglass.com',
    });
});

