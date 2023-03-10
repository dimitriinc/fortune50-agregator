const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const browsersync = require('browser-sync').create();
const terser = require('gulp-terser')

const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js'
};

function scssTask() {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer({
            config: {
                path: '.browserslistrc'
            }
        }), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'));
}

function jsTask() {
    return src(files.jsPath)
        .pipe(concat('all.js'))
        .pipe(terser())
        .pipe(dest('dist'));
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

function browserSyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.',
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: 0,
            },
        },
    });
    cb();
}

function bsWatchTask() {
    watch(['index.html'], browsersyncReload);
    watch(
        [files.jsPath, files.scssPath],
        series(parallel(scssTask, jsTask), browsersyncReload)
    );
}

exports.default = series(
    parallel(scssTask, jsTask),
    browserSyncServe,
    bsWatchTask
);

exports.build = series(
    scssTask, jsTask
)