'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); //lazy load some of gulp plugins

var watch = require('gulp-watch');
var posthtml = require('gulp-posthtml');

var devMode = process.env.NODE_ENV || 'dev';

var destFolder = devMode === 'dev' ? 'dev' : 'production';

var cssPrefix = 'p08w-';

// STYLES
gulp.task('sass', function () {

	return gulp.src('src/sass/style.scss')
		.pipe($.if(devMode !== 'prod', $.sourcemaps.init())) 
		.pipe($.sass({outputStyle: 'expanded'})) 
		.on('error', $.notify.onError())
		.pipe($.cssPrefix(cssPrefix))
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

var postHtmlPlugins = [
	function prefixClass(tree) {
		console.log(tree.match);
		tree.match({attrs: { class: /.+/ }}, function (node) {
			
			var classes = node.attrs.class.split(' ');	

			var newClasses = classes.map( className => cssPrefix + className);
			
			node.attrs.class = newClasses.join(' ');

			return node;
		});
	},	
	function prefixId(tree) {
		tree.match({attrs: { id: /.+/ }}, function (node) {
		
			node.attrs.id = cssPrefix + node.attrs.id;

			return node;
		});
	},	
];

gulp.task('html-prefix', function(callback){
	
	return gulp.src([
		'src/html/pages/*.html', 
	])
	.pipe(posthtml(postHtmlPlugins))
	.on('error', $.notify.onError())
	.pipe(gulp.dest('src/html/pages-prefixed'));

});

gulp.task('html-final', function(callback){
	
	return gulp.src([
		'src/html/*.html', 
	])
	.pipe($.fileInclude({
		prefix: '@@',
		basepath: '@file',
		context: {
			mode: devMode,
		},
		indent: true
	}))
	.on('error', $.notify.onError())
	.pipe(gulp.dest(destFolder));

});



gulp.task('html-prod', function(callback){
	
	return gulp.src([
		'src/html/pages/*.html', 
	])
	.pipe(posthtml(postHtmlPlugins))
	.on('error', $.notify.onError())
	.pipe(gulp.dest(destFolder));

});

gulp.task('html', gulp.series('html-prefix', 'html-final'));


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

gulp.task('build-prod', gulp.series('assets', 'sass', 'html-prod'));


//PUBLIC TASKS

//production

// npm run prod - build whole project to deploy in 'production' folder
gulp.task('prod', gulp.series('clean', 'build-prod'));


//development

// gulp start - very first start to build the project and run server in 'dev' folder
gulp.task('start', gulp.series('clean', 'build', gulp.parallel('server', 'watch')));

// gulp - just run server in 'dev' folder
gulp.task('default', gulp.parallel('server', 'watch'));



