var gulp = require('gulp');
var pkg = require('./package.json');

// include plug-ins
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
//var stripDebug = require('gulp-strip-debug');
var terser = require('gulp-terser');
var replace = require('gulp-replace-task');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var header = require('gulp-header');

// options
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed' //expanded, nested, compact, compressed
};


function styles(done) {

  var banner = ['/**',
                ' * <%= pkg.name %>',
                ' * ',
                ' * --styles--',
                ' * ',
                ' * @version v<%= pkg.version %>',
                ' * @author <%= pkg.humans[0] %>',
			          ' * @author <%= pkg.humans[1] %>',
                ' * @license <%= pkg.license %>',
                ' * @see <%= pkg.docs %>',
                ' */',
                '',
                ''].join('\n');

	gulp.src('./src/sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(concat('styles.built.css'))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(header(banner, { pkg : pkg } ))
		.pipe(sourcemaps.write('./map'))
		.pipe(gulp.dest('./css/'));

  done();
  //console.log('styles ran');
}
// CSS concat, auto-prefix and minify
gulp.task('styles', styles);


function scripts(done) {

  var banner = ['/**',
                  ' * <%= pkg.name %>',
                  ' * ',
                  ' * --scripts--',
                  ' * ',
                  ' * @version v<%= pkg.version %>',
                  ' * @author <%= pkg.humans[0] %>',
                  ' * @author <%= pkg.humans[1] %>',
                  ' * @license <%= pkg.license %>',
                  ' * @see <%= pkg.docs %>',
                  ' */',
                  '',
                  ''].join('\n');

	// Run eslint for src js
    gulp.src('./src/js/*.js')
        .pipe(eslint(done))
        .pipe(eslint.format());

	// Compile src js
    gulp.src('./src/js/*.js')
        .pipe(concat('scripts.built.js'))
        //.pipe(stripDebug())
        .pipe(terser())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('./js/'));

	done();
 // console.log('scripts ran');
}
// JS concat, strip debugging and minify
gulp.task('scripts', scripts);


function watcher(done) {

	// watch for CSS changes
	gulp.watch('./src/sass/*.scss', styles);

  // watch for JS changes
	gulp.watch('./src/js/*.js', scripts);

	done();
}
// watch
gulp.task('watcher', watcher);


gulp.task( 'default',
	gulp.parallel('styles', 'scripts', 'watcher', function(done){
		done();
	})
);


function done() {
	console.log('done');
}
