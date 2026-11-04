'use strict'

// DEPENDENCIES
const gulp = require('gulp'),
    eslint = require('gulp-eslint-new'),
    ts = require('gulp-typescript'),
    nodemon = require('gulp-nodemon')

// ESLINT
gulp.task('es-lint', () => {
    return gulp.src(['src/**/*.ts'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
})

// COPY FILES
gulp.task('copy-files', () => {
    const COPY_FILES = ['package.json']
    const COPY_TEMPLATE = ['./src/ui/templates/**/*']
    return gulp.src(COPY_FILES).pipe(gulp.dest('dist')) &&
        gulp.src(COPY_TEMPLATE).pipe(gulp.dest('dist/src/ui/templates'))
})

// WATCH
gulp.task('watch', (done) => {
    gulp.watch('./**/*.ts')
    nodemon({
        script: 'dist/server.js',
        tasks: ['build'],
        ext: 'ts json',
        ignore: ['node_modules/', 'package.json', 'tsconfig.json']
    }).on('restart', () => {
        console.log('##################################### // ######################################')
        console.log('########################### (0/ Server restarted... ###########################')
    }).on('crash', function () {
        console.error('Application has crashed!')
    })
    done()
})

// BUILD DEFAULT
gulp.task('build', gulp.series(['es-lint', 'copy-files'], function compiler() {
    const tsProject = ts.createProject(
        'tsconfig.json',
        { typescript: require('typescript') }
    )
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'))
        .on('error', (err) => {
            console.error('Build error:', err.message)
        })
}
))

// BUILD DEV
gulp.task('dev', gulp.series(['build', 'watch']))
