'use strict';

// var cssMinify       = require('gulp-csso');
var concat          = require('gulp-concat');
var gulp            = require('gulp');
// var gutil           = require('gulp-util');
var rename          = require('gulp-rename');
// const sass 			= require('gulp-sass')(require('sass'));
var uglify          = require('gulp-uglify');


var localFolder         = './';
var localFolderJs       = localFolder + 'js/';

gulp.task('js', function () {
	return gulp.src([
		localFolderJs + 'jquery-3.6.0.min.js',
		localFolderJs + '**/*.js'
	])
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(localFolder));
});

gulp.task('watch', function() {
	gulp.watch(localFolderJs + '**/*.js',                       gulp.series('js'));
});

gulp.task('default', gulp.series(
	'watch'
));
