'use strict';

// gulp
var gulp = require('gulp')
var gulpif = require('gulp-if')
var gutil = require('gulp-util')
var copy = require('gulp-copy')
var shell = require('gulp-shell')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
var sass = require('gulp-sass')
var notify = require('gulp-notify')
var uglify = require('gulp-uglify')
var gulpsync = require('gulp-sync')(gulp)
var imagemin = require('gulp-imagemin')
var sourcemaps = require('gulp-sourcemaps')
var postcss = require('gulp-postcss')
var bundle = require('gulp-bundle-assets')

// tranforms
var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')
var svg = require('svg-browserify');

// optims
var pngquant = require('imagemin-pngquant')
var imageminPngcrush = require('imagemin-pngcrush');

// vinyl
var buffer = require('vinyl-buffer')
var transform = require('vinyl-transform')
var source = require('vinyl-source-stream')

// css
var autoprefixer = require('autoprefixer-core')

var argv = require('yargs').argv
var del = require('del')
var exec = require('child_process').exec
var fs = require('fs')
var path = require('path')
var bowerResolve = require('bower-resolve')
var nodeResolve = require('resolve')
var packagesHelper = require('./helper/packagesHelper')

// Aliasify App's paths
var aliasifyConfig = require('./config/aliasifyConfig')
aliasifyConfig.configDir = __dirname
aliasifyConfig.buildAliases()
var aliasify = require('aliasify').configure(aliasifyConfig)

var deploy = argv._.length ? argv._[0] === 'deploy' : false;
var watch = argv._.length ? argv._[0] === 'watch' : true;
var production = deploy
var browserSync = require("browser-sync")
browserSync.create('My Server')
var bundler = browserify({
    entries: 'src/js/Main.js',
    extensions: ['.js'],
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: !production
})

// Error notification
var beep = function() {
  var os = require('os');
  var file = 'gulp/error.wav';
  if (os.platform() === 'linux') {
    // linux
    exec("aplay " + file);
  } else {
    // mac
    console.log("afplay " + file);
    exec("afplay " + file);
  }
};
var handleError = function(task) {
  return function(err) {
    beep();
    
      notify.onError({
        message: task + ' failed, check the logs..',
        sound: false
      })(err);
    
    gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
  };
};

// Tasks
var tasks = {
    clean: function(cb) {
        del(['deploy/'], cb);
    },
    clearJs: function(cb) {
        del(['www/js/**/*.*'], cb);
    },
    sass: function() {
        return gulp.src('./src/scss/app.scss')
            // sourcemaps + sass + error handling
            .pipe(gulpif(!production, sourcemaps.init()))
            .pipe(sass({
                sourceComments: !production,
                outputStyle: production ? 'compressed' : 'nested',
                includePaths: ['./src/scss']
            }))
            .on('error', function(err){
                // print the error (can replace with gulp-util)
                gutil.log(gutil.colors.black.underline.bgYellow(err.message));
                // end this stream
                this.emit('end');
            })
            // generate .maps
            .pipe(gulpif(!production, sourcemaps.write({
                'includeContent': false,
                'sourceRoot': '.'
            })))
            // autoprefixer
            .pipe(gulpif(!production, sourcemaps.init({
                'loadMaps': true
            })))
            .pipe(postcss([
                autoprefixer({
                    browsers: ['last 2 versions']
                })
            ]))
            // we don't serve the source files
            // so include scss content inside the sourcemaps
            .pipe(sourcemaps.write({
                'includeContent': true
            }))
            .pipe(rename('styles.css'))
            // write sourcemaps to a specific directory
            // give it a file and save
            .pipe(gulp.dest('./www/css'))
            .pipe(browserSync.stream());
    },
    browserify: function() {
        var rebundle = function() {
            return bundler.bundle()

                .on('error', function(err){
                    // print the error (can replace with gulp-util)
                    gutil.log(gutil.colors.black.underline.bgYellow(err.message));
                    // end this stream
                    this.emit('end');
                })

                .pipe(source('app.js'))
                .pipe(gulpif(production, buffer()))
                .pipe(gulpif(production, uglify()))
                .pipe(gulp.dest('./www/js'))
                .pipe(browserSync.stream())
        }
        
        return rebundle();
    },

    optimize: function() {

        var paths = {
            files: './deploy/**',
            filesDest: './deploy/www/imagemin',
        };

        return gulp.src(paths.files, {base: paths.filesDest})
            .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
            .pipe(gulp.dest(paths.filesDest));
    },
    deployDir: function() {
        return gulp.src("")
            .pipe(shell([
                'rm -rf deploy',
                'mkdir deploy'
            ]));
    },
    deployCopy: function() {
        return gulp.src("")
            .pipe(shell([
                'cp -rf www deploy'
            ]));
    },
    buildVendor: function () {
        // this task will go through ./bower.json and
        // uses bower-resolve to resolve its full path.
        // the full path will then be added to the bundle using require()
        var b = browserify({
            insertGlobals: true,
            // generate source maps in non-production environment
            debug: !production
        });
        // get all bower components ids and use 'bower-resolve' to resolve
        // the ids to their full path, which we need for require()
        packagesHelper.getBowerPackageIds().forEach(function (id) {
            var resolvedPath = bowerResolve.fastReadSync(id);
            gutil.log(gutil.colors.black.bgBlue("Bower package", id));
            b.require(resolvedPath, {
                // exposes the package id, so that we can require() from our code.
                // for eg:
                // require('./vendor/angular/angular.js', {expose: 'angular'}) enables require('angular');
                // for more information: https://github.com/substack/node-browserify#brequirefile-opts
                expose: id
            });
        });
        // do the similar thing, but for npm-managed modules.
        // resolve path using 'resolve' module
        packagesHelper.getNPMPackageIds().forEach(function (id) {
            gutil.log(gutil.colors.black.bgBlue("Npm dev dependency package", id));
            b.require(nodeResolve.sync(id), { expose: id });
        });
        var stream = b.bundle()
            .pipe(source('vendor.js'))
            .pipe(gulpif(production, buffer()))
            .pipe(gulpif(production, uglify()))
            .pipe(gulp.dest('./www/vendor'));
        return stream;
    },
    buildApp: function () {
        if (watch) {
            bundler = watchify(bundler)
        }

        tasks.transform()
        // mark vendor libraries defined in bower.json as an external library,
        // so that it does not get bundled with app.js.
        // instead, we will load vendor libraries from vendor.js bundle
        packagesHelper.getBowerPackageIds().forEach(function (lib) {
            bundler.external(lib);
        });
        // do the similar thing, but for npm-managed modules.
        // resolve path using 'resolve' module
        packagesHelper.getNPMPackageIds().forEach(function (id) {
            bundler.external(id);
        });

        tasks.browserify()
    },
    transform: function() {
        bundler.transform(babelify)
        bundler.transform(aliasify)
        bundler.transform(svg)
    }
}



gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./www",
        },
        open: false,
        notify: false,
        port: process.env.PORT || 3000
    });
});
 

gulp.task('reload', function() {
    browserSync.reload();
});
gulp.task('reload-sass', ['sass'], function(){
    browserSync.reload();
});
gulp.task('watch-js', [
    'clearJs',
    'browserify',
    'reload'
])

bundler.on('update', function() {
    tasks.browserify()
    browserSync.reload()
});
// bundler.on('log', function(msg) {
//     console.log(msg)
// });
gulp.task('reload-templates', [], function(){
    browserSync.reload();
});

gulp.task('watch', function() {
    gulp.watch('./src/scss/**/*.scss', ['reload-sass']);
    // gulp.watch('./src/js/**/*.js', ['watch-js']);
    gulp.watch('./www/**/*.html', ['reload-templates']);
    gutil.log(gutil.colors.bgRed('Watching for changes...'));
});

gulp.task('clean', tasks.clean);
gulp.task('sass', tasks.sass);
gulp.task('clearJs', tasks.clearJs);
gulp.task('browserify', tasks.browserify);
gulp.task('deployDir', tasks.deployDir);
gulp.task('deployCopy', tasks.deployCopy);
gulp.task('transform', tasks.transform);
gulp.task('optimize', tasks.optimize);
gulp.task('build-vendor', tasks.buildVendor);
gulp.task('build-app', tasks.buildApp);

gulp.task('build', [
    'browser-sync',
    'sass',
    'build-vendor',
    'build-app'
]);

gulp.task('deploy', gulpsync.sync([
    'build',
    'clean',
    'deployDir',
    'deployCopy',
    'optimize'
]));

gulp.task('default', [ 'build', 'watch']);

// gulp (watch) : for development and browser reload
// gulp build : for a one off development build
// gulp deploy : for a minified production build

