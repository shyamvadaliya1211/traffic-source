'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var cleanCSS = require('gulp-clean-css');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


gulp.task('sass', function() {
    return gulp.src('./public/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css/sass'));
});

gulp.task('default', ['sass'], function() {
    nodemon({
        script: 'index.js',
        ext: 'js html',
        env: {},
        ignore: ['public']
    });
    gulp.watch('./public/sass/*.scss', ['sass']);
});







//
var css = [
    './public/libs/bootstrap/dist/css/bootstrap.min.css',
    'http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,400,600,300,700',
    './public/fonts/themify-icons/themify-icons.min.css',
    './public/fonts/weather-icons/css/weather-icons.min.css',
    './public/libs/font-awesome/css/font-awesome.min.css',
    './public/libs/angular-toastr/dist/angular-toastr.css',
    './public/css/sass/global.css',
    './public/css/sass/user.css',
];

//
var script = [
    './public/libs/jquery/dist/jquery.min.js',
    './public/libs/bootstrap/dist/js/bootstrap.min.js',
    './public/libs/angular/angular.min.js',
    './public/libs/angular-sanitize/angular-sanitize.min.js',
    './public/libs/angular-ui-router/release/angular-ui-router.min.js',
    './public/libs/angular-resource/angular-resource.min.js',
    './public/libs/angular-mocks/angular-mocks.js',
    './public/libs/angular-cookies/angular-cookies.js',
    './public/libs/angular-animate/angular-animate.min.js',
    './public/libs/angular-toastr/dist/angular-toastr.tpls.js',
    './public/angular/init.js',
    './public/angular/routes/icMean.js',
    './public/angular/services/icMean.js',
    './public/angular/directives/icMean.js',
    './public/angular/config/config.js',
    './public/angular/controllers/common.js',
];





gulp.task('css', function(){
   gulp.src(css)
   .pipe(concat('final.min.css'))
   .pipe(minify())
   .pipe(gulp.dest('./public/minified/'));
});

gulp.task('script', function(){
   gulp.src(script)
   .pipe(concat('script.min.js'))
   .pipe(uglify())
   .pipe(gulp.dest('public/minified/'));
});


gulp.task('compress',['css','script'],function(){});