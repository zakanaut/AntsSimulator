'use strict';

var concat          = require('gulp-concat');
var gulp            = require('gulp');
var rename          = require('gulp-rename');
var uglify          = require('gulp-uglify');


var localFolder         = './';
var localFolderJs       = localFolder + 'js/';

gulp.task('js', function () {
	return gulp.src([
		localFolderJs + '**/*.js'
	])
		.pipe(concat('all.js'))
		// .pipe(uglify()) // TODO uncomment to minify js
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(localFolder));
});

gulp.task('watch', function() {
	gulp.watch(localFolderJs + '**/*.js',   gulp.series('js'));
});

gulp.task('default', gulp.series(
	'watch'
));
