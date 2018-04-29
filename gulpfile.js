/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');
var rename = require("gulp-rename");
var access = require('gulp-accessibility');
var browserSync = require('browser-sync').create();

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('browser-sync', function() {
	browserSync.init({
   	 server: {
            baseDir: "./"
        },
    open: false,
    files: [ '*.css', '*.html', 'css/*.css'],
    });
});

gulp.task('a11y', function() {
  return gulp.src('./*.html', {
    reportLevels: {
      notice: false,
      warning: true,
      error: true
    }
  })
    .pipe(access({
      force: true
    }))
    .on('error', console.log)
    .pipe(access.report({reportType: 'txt'}))
    .pipe(rename({
      extname: '.txt'
    }))
    .pipe(gulp.dest('reports/txt'));
});