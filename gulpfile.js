var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var gopen = require('gulp-open');
var preprocess = require('gulp-preprocess');
var surge = require('gulp-surge');
var minify = require('gulp-minify');
var eslint = require('gulp-eslint');
var del = require('del');
var fs = require('fs');

var paths = {
    dist: 'www',
    lint: [
        'gulpfile.js',
        'src/js/*.js',
        '!src/js/modal.js',
    ],
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

gulp.task('lint', function() {
    return gulp.src(paths.lint)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

var assetMap = {
    'blue_boxCheckmark.png': 'checkbox',
    'blue_button12.png': 'square_button',
    'grey_box.png': 'checkbox_blank',
    'fishTile_032.png': 'ornament_01',
    'fishTile_033.png': 'ornament_02',
    'fishTile_056.png': 'ground_01',
    'fishTile_057.png': 'ground_02',
    'fishTile_060.png': 'ground_03',
    'fishTile_061.png': 'ground_04',
    'fishTile_062.png': 'ground_05',
    'fishTile_063.png': 'ground_06',
    'fishTile_073.png': 'green_fish',
    'fishTile_075.png': 'pink_fish',
    'fishTile_077.png': 'blue_fish',
    'fishTile_079.png': 'red_fish',
    'fishTile_081.png': 'orange_fish',
    'fishTile_084.png': 'ornament_03',
    'fishTile_085.png': 'ornament_04',
    'fishTile_101.png': 'puffer_fish',
};

//Make the sprite sheet nicely formatted
gulp.task('build-assets', function() { //TODO make this more gulp-y
    var input = require('./src/img/assets.json');
    var output = {
        frames: {},
        meta: input.meta,
    };

    Object.keys(input.frames).forEach(function(key) {
        if (assetMap[key]) {
            output.frames[assetMap[key]] = input.frames[key];
        }
        else {
            output.frames[key] = input.frames[key];
        }
    });

    if (!fs.existsSync(paths.dist)) {
        fs.mkdirSync(paths.dist);
    }

    if (!fs.existsSync(paths.dist + '/img/')) {
        fs.mkdirSync(paths.dist + '/img/');
    }

    fs.writeFileSync(paths.dist + '/img/assets.json', JSON.stringify(output, null, 4));
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

gulp.task('build-js', function() {
    return gulp.src(paths.js)
        .pipe(concat('app.js'))
        .pipe(minify())
        .pipe(gulp.dest(paths.dist + '/js'));
});


gulp.task('watch', function() {
    gulp.watch(paths.js, ['lint', 'build-js']);
    gulp.watch(paths.html, ['build-html']);
});

gulp.task('build', ['clean', 'lint', 'build-html', 'build-img', 'build-audio', 'build-lib-js', 'build-js', 'build-assets']);
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
