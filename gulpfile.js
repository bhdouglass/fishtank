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
        'src/js/modal.js',
        'src/js/fish.js',
        'src/js/fishtank.js',
        'src/js/index.js',
    ],
    img: [
        'src/img/kenney/fish/fishTile_073.png',
        'src/img/kenney/fish/fishTile_075.png',
        'src/img/kenney/fish/fishTile_077.png',
        'src/img/kenney/fish/fishTile_079.png',
        'src/img/kenney/fish/fishTile_081.png',
        'src/img/kenney/fish/fishTile_101.png',

        'src/img/kenney/fish/fishTile_056.png',
        'src/img/kenney/fish/fishTile_057.png',
        'src/img/kenney/fish/fishTile_060.png',
        'src/img/kenney/fish/fishTile_061.png',
        'src/img/kenney/fish/fishTile_062.png',
        'src/img/kenney/fish/fishTile_063.png',

        'src/img/kenney/fish/fishTile_032.png',
        'src/img/kenney/fish/fishTile_033.png',
        'src/img/kenney/fish/fishTile_084.png',
        'src/img/kenney/fish/fishTile_085.png',

        'src/img/kenney/ui/blue_boxCheckmark.png',
        'src/img/kenney/ui/grey_box.png',
        'src/img/kenney/ui/blue_button12.png',

        'src/img/*.png',
        'src/img/*.svg',
    ],
    audio: [
        'src/audio/**/*.mp3',
        'src/audio/**/*.ogg',
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
            CORDOVA: process.env.CORDOVA == 'true',
            LINKS: process.env.LINKS != 'false',
        }}))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build-img', function() {
    return gulp.src(paths.img)
        .pipe(gulp.dest(paths.dist + '/img'));
});

gulp.task('build-audio', function() {
    return gulp.src(paths.audio)
        .pipe(gulp.dest(paths.dist + '/audio'));
});

gulp.task('build-lib-js', function() {
    return gulp.src(paths.libjs)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(paths.dist + '/js'));
});

//TODO minify this
gulp.task('build-js', function() {
    return gulp.src(paths.js)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.dist + '/js'));
});


gulp.task('watch', function() {
    gulp.watch(paths.js, ['build-js']);
    gulp.watch(paths.html, ['build-html']);
});

gulp.task('build', ['clean', 'build-html', 'build-img', 'build-audio', 'build-lib-js', 'build-js']);
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
