var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var swPrecache = require('sw-precache');

gulp.task('sass', function () {
  return gulp
    .src('./styles/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./styles/'))
    .pipe(minifyCss({}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./styles/'));
});

gulp.task('generate-sw', function() {
  var swOptions = {
    staticFileGlobs: [
      './index.html',
      './images/*.{png,svg,gif,jpg}',
      './scripts/*.js',
      './styles/*.css'
    ],
    stripPrefix: '.',
    runtimeCaching: [{
      urlPattern: /^https:\/\/publicdata-weather\.firebaseio\.com/,
      handler: 'networkFirst',
      options: {
        cache: {
          name: 'weatherData-v3'
        }
      }
    }]
  };
  return swPrecache.write('./service-worker.js', swOptions);
});

gulp.task('serve', ['generate-sw'], function() {
  gulp.watch('./styles/*.scss', ['sass']);
  browserSync({
    notify: false,
    logPrefix: 'weatherPWA',
    server: ['.'],
    open: false
  });
  gulp.watch([
    './*.html',
    './scripts/*.js',
    './styles/*.css',
    '!./service-worker.js',
    '!./gulpfile.js'
  ], ['generate-sw'], browserSync.reload);
});

gulp.task('default', ['serve']);
