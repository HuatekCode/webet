// ÒýÈë gulp
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),       //add prefix for css
    minifycss = require('gulp-minify-css'),             //compress the css in one line
    //rev = require('gulp-rev'),                            // add MD5 suffix for new file
    //sourcemaps = require('gulp-sourcemaps'),            // general the sourcemap file for debugger
    //revreplace = require('gulp-rev-replace'),           // replace the file info
    jshint = require('gulp-jshint'),                     // check js code
    uglify = require('gulp-uglify'),                     // compress the js
    imagemin = require('gulp-imagemin'),                // compress the images
    rename = require('gulp-rename'),                     // rename
    clean = require('gulp-clean'),                       // clear exist odd files
    concat = require('gulp-concat'),                     // concat the js
    notify = require('gulp-notify'),                     // notify the changing
    cache = require('gulp-cache'),                       // compress the changing img
    minifyHtml = require("gulp-minify-html"),
    livereload = require('gulp-livereload');           //auto reload the page

//Compress the css files
gulp.task('styles', function() {
    return gulp.src(['src/resource/css/bootstrap.css',
        'src/resource/css/components.css',
        'src/resource/css/components-md.css',
        'src/resource/css/components-rounded.css',
        'src/resource/css/font.css',
        'src/resource/css/grey.css',
        'src/resource/css/morris.css',
        'src/resource/css/layout.css',
        'src/resource/css/plugins.css',
        'src/resource/css/plugins-md.css',
        'src/resource/css/tasks.css',
        'src/resource/css/uniform.default.css'
    ])
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

//Compress the admin css files
gulp.task('adminStyles', function() {
    return gulp.src(['src/resource/css/admin/components.css',
        'src/resource/css/admin/components.css',
        'src/resource/css/admin/components-md.css',
        'src/resource/css/admin/components-rounded.css',
        'src/resource/css/admin/grey.css',
        'src/resource/css/admin/layout.css',
        'src/resource/css/admin/loading.css',
        'src/resource/css/admin/plugins.css',
        'src/resource/css/admin/plugins-md.css',
        'src/resource/css/admin/select2.css',
        'src/resource/css/admin/todo.css',
        'src/resource/css/admin/treegrid.css'
    ])
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css/admin'))
        .pipe(notify({ message: 'Admin styles task complete' }));
});

//Compress the css files
gulp.task('treegridStyles', function() {
    return gulp.src(['src/resource/css/admin/treegrid/integralui.checkbox.css',
        'src/resource/css/admin/treegrid/integralui.css',
        'src/resource/css/admin/treegrid/integralui.treegrid.css',
        'src/resource/css/admin/treegrid/samples.css'
    ])
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css/admin/treegrid'))
        .pipe(notify({ message: 'Treegrid styles task complete' }));
});

//Compress the css files
gulp.task('themesStyles', function() {
    return gulp.src(['src/resource/css/admin/treegrid/themes/theme-blue.css',
                    'src/resource/css/admin/treegrid/themes/theme-dark.css',
                    'src/resource/css/admin/treegrid/themes/theme-flat-blue.css',
                    'src/resource/css/admin/treegrid/themes/theme-flat-dark.css',
                    'src/resource/css/admin/treegrid/themes/theme-flat-green.css',
                    'src/resource/css/admin/treegrid/themes/theme-flat-light.css',
                    'src/resource/css/admin/treegrid/themes/theme-flat-red.css',
                    'src/resource/css/admin/treegrid/themes/theme-green.css',
                    'src/resource/css/admin/treegrid/themes/theme-light.css',
                    'src/resource/css/admin/treegrid/themes/theme-red.css'
    ])
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css/admin/treegrid/themes'))
        .pipe(notify({ message: 'Treegrid styles task complete' }));
});

// Copy *.min.css
gulp.task('copyStyles', function() {
    return gulp.src('src/resource/css/**/*.min.css')
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Compress the image files
gulp.task('images', function() {
    return gulp.src('src/resource/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({ message: 'Images task complete' }));
});

// Compress the public js files
gulp.task('publicScripts', function() {
    gulp.src(['src/resource/js/index.js','src/resource/js/layout.js','src/resource/js/metronic.js','src/resource/js/quick-sidebar.js','src/resource/js/todo.js'])
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(notify({ message: 'Public scripts task complete' }));
});

// Compress the public js files
gulp.task('copyScripts', function() {
    gulp.src('src/resource/js/*.min.js')
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({ message: 'Public scripts copy task complete' }));
});


// Compress the public js files
gulp.task('copyTreegridScripts', function() {
    gulp.src('src/resource/js/treegrid/*.min.js')
        .pipe(gulp.dest('dist/assets/js/treegrid'))
        .pipe(notify({ message: 'Public scripts copy task complete' }));
});

//App module
gulp.task('app-js-min', function() {
    return gulp.src(['src/app.module.js', 'src/app.config.js'])
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat({path:'app.min.js', cwd: ''}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(notify({ message: 'Home app module scripts task complete' }));
});

//Home module
gulp.task('home-js-min', function() {
    return gulp.src(['src/home/home.module.js', 'src/home/home.controller.js', 'src/home/home.services.js'])
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        //.pipe(concat({path:'home.min.js', cwd: ''}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(notify({ message: 'Home module scripts task complete' }));
});


//Admin module
gulp.task('admin-js-min', function() {
    return gulp.src(['src/admin/admin.module.js', 'src/admin/admin.config.js'])
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat({path:'admin.min.js', cwd: ''}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(notify({ message: 'Admin module scripts task complete' }));
});

//Admin schedule module
gulp.task('admin-schedule-js-min', function() {
    return gulp.src(['src/admin/schedule/schedule.module.js', 'src/schedule/schedule/schedule.route.js', 'src/schedule/schedule/schedule.controller.js'])
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat({path:'admin.schedule.min.js', cwd: ''}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(notify({ message: 'Admin schedule scripts task complete' }));
});


//Admin setting module
gulp.task('admin-setting-js-min', function() {
    return gulp.src(['src/admin/setting/setting.module.js',
                        'src/admin/setting/setting.route.js',
                        'src/admin/setting/setting.services.js',
                        'src/admin/setting/setting.controller.js',
                        'src/admin/setting/setting.directive.js',
                        'src/admin/setting/settingInitial.directive.js',
                        'src/admin/setting/loading.directive.js'
    ])
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat({path:'admin.setting.min.js', cwd: ''}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(notify({ message: 'Admin setting scripts task complete' }));
});

//Utils module for angular filter
gulp.task('angular-filter-js-min', function() {
    return gulp.src(['src/utils/angular.filter.module.js', 'src/utils/angular.filter.services.js'])
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat({path:'angular.filter.min.js', cwd: ''}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(notify({ message: 'Admin angular filter scripts task complete' }));
});

//Utils module for httputil
gulp.task('httputil-js-min', function() {
    return gulp.src(['src/utils/httputil.module.js', 'src/utils/httputil.services.js'])
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat({path:'httputil.min.js', cwd: ''}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(notify({ message: 'Admin httputil scripts task complete' }));
});

//Pages
gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist'));
});

// Clean
gulp.task('clean', function() {
    return gulp.src(['dist/assets'], {read: false})
        .pipe(clean());
});

// Task
gulp.task('default', ['clean'], function() {
    gulp.start(
                //'styles',
                //'adminStyles',
                //'treegridStyles',
                //'themesStyles',
                //'copyStyles',
                //'images',
                //'publicScripts',
                'copyScripts',
        'copyTreegridScripts',
        'app-js-min',
        'home-js-min',
        'admin-js-min',
        'admin-schedule-js-min',
        'admin-setting-js-min',
        'angular-filter-js-min',
        'httputil-js-min'
                //'html'
    );
});

// Monitor
gulp.task('watch', function() {

    // Monitor *.css
    gulp.watch('src/resource/css/**/*.css', ['styles']);

    // Monitor *.css
    gulp.watch('src/resource/css/admin/*.css', ['adminStyles']);

    // Monitor *.css
    gulp.watch('src/resource/css/admin/treegrid/*.css', ['treegridStyles']);

    // Monitor *.css
    gulp.watch('src/resource/css/admin/treegrid/themes/*.css', ['themesStyles']);

    // Monitor *.min.css
    gulp.watch('src/resource/css/**/*.css', ['copyStyles']);

    // Monitor *.js
    gulp.watch('src/resource/js/**/*.js', ['publicScripts']);

    // Monitor *.min.js
    gulp.watch('src/resource/js/*.min.js', ['copyScripts']);

    // Monitor *.min.js
    gulp.watch('src/resource/js/treegrid/*.min.js', ['copyTreegridScripts']);

    // Monitor imagine
    gulp.watch('src/resource/img/**/*', ['images']);

    // Monitor home module js
    gulp.watch('src/app.*.js', ['app-js-min']);

    // Monitor home module js
    gulp.watch('src/home/home.*.js', ['home-js-min']);

    // Monitor admin module js
    gulp.watch('src/admin/admin.*.js', ['admin-js-min']);

    // Monitor admin schedule module js
    gulp.watch('src/admin/schedule/*.js', ['admin-schedule-js-min']);

    // Monitor admin setting module js
    gulp.watch('src/admin/setting/*.js', ['admin-setting-js-min']);

    // Monitor admin module js
    gulp.watch('src/utils/angular.filter.*.js', ['angular-filter-js-min']);

    // Monitor admin module js
    gulp.watch('src/utils/httputil.*.js', ['httputil-js-min']);

    // Monitor index html
    gulp.watch('src/**/*.html', ['html']);

    // build the monitor server
    var server = livereload();
    // Monitor all files in the dist directory, once has the change, and restructuring
    gulp.watch(['dist/**']).on('change', function(file) {
        server.changed(file.path);
    });
});