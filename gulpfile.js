'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); //lazy load some of gulp plugins

var watch = require('gulp-watch');

var devMode = process.env.NODE_ENV || 'dev';

var destFolder = devMode === 'dev' ? 'dev' : 'production';

// STYLES
gulp.task('sass', function () {

	return gulp.src('src/sass/style.scss')
		.pipe($.if(devMode !== 'prod', $.sourcemaps.init())) 
		.pipe($.sass({outputStyle: 'expanded'})) 
		.on('error', $.notify.onError())
		.pipe($.cssPrefix('you-seagate-'))
		.on('error', $.notify.onError())
		.pipe($.autoprefixer({
			browsers: ['> 1%'],
			cascade: false
		}))
		.pipe($.cssImageDimensions())
		.pipe($.if(devMode !== 'prod', $.sourcemaps.write())) 
		.pipe(gulp.dest(destFolder + '/css'));  
});

// ASSETS
gulp.task('assets', function(){
	return gulp.src(['src/assets/**/*.*'], {since: gulp.lastRun('assets')})
		.pipe($.newer(destFolder + ''))
		.pipe(gulp.dest(destFolder + ''))
});

// HTML
gulp.task('html', function(callback){
	
	return gulp.src([
		'src/html/*.html', 
	])
	.pipe($.fileInclude({
		prefix: '@@',
		basepath: '@file',
		context: {
		},
		indent: true
	}))
	.on('error', $.notify.onError())
	.pipe(gulp.dest(destFolder));

});

// JS
gulp.task('js', function(){
	return gulp.src(['src/js/*.*'], {since: gulp.lastRun('js')})
		.pipe($.newer(destFolder + '/js'))
		.pipe(gulp.dest(destFolder + '/js'))
});


// BUILD
gulp.task('server', function () {
	$.server = require('gulp-server-livereload');

	gulp.src(destFolder)
	.pipe($.server({
		livereload: true,
		directoryListing: false,
		open: false,
		port: 9000
	}));
})

gulp.task('watch', function(){
	gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
	gulp.watch('src/assets/**/*', gulp.series('assets'));
	gulp.watch('src/js/**/*.js', gulp.series('js'));
	gulp.watch('src/html/**/*.html', gulp.series('html'));
});

gulp.task('clean', function(callback) {
	$.del = require('del');
	return $.del([destFolder]);
});

gulp.task('build', gulp.series('assets', 'sass', 'html'));


//PUBLIC TASKS

//production

// npm run prod - build whole project to deploy in 'production' folder
gulp.task('prod', gulp.series('clean', 'build'));


//development

// gulp start - very first start to build the project and run server in 'dev' folder
gulp.task('start', gulp.series('clean', 'build', gulp.parallel('server', 'watch')));

// gulp - just run server in 'dev' folder
gulp.task('default', gulp.parallel('server', 'watch'));



