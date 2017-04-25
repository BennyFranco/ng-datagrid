var gulp = require('gulp');
var inlineResources = require('./inline-resources');

gulp.task('copy-and-inline-resource', copyHtml);

function copyHtml() {
    gulp.src('src/app/datagrid/**/*.html')
        .pipe(gulp.dest('./dist/datagrid')).on('end', copyAssets);
}

function copyAssets() {
    gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./dist/assets')).on('end', copyCss);
}
function copyCss() {
    gulp.src('./src/app/datagrid/**/*.css')
        .pipe(gulp.dest('./dist/datagrid')).on('end', inlineResource);
}

function inlineResource() {
    inlineResources('./dist/datagrid');
}

gulp.task('default', ['copy-and-inline-resource']);