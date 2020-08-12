var gulp = require('gulp');
var aglio = require('gulp-aglio');
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var rimraf = require('rimraf');
var ejs = require('gulp-ejs');
//各種パス
var DIST_DIR = 'api_docs';
var SRC_DIR = 'api_docs_src';
var LAYOUT_APIB_FILE = SRC_DIR + '/layout.apib';
var INDEX_APIB_FILE = DIST_DIR + '/index.apib';
var WATCH_TARGET_FILE = [SRC_DIR + '/**/*.apib'];

//apibファイルの結合
gulp.task('combine', function () {
  return gulp.src(LAYOUT_APIB_FILE)
    .pipe(ejs({}, { ext: '.apib' }))
    .pipe(rename('index.apib'))
    .pipe(gulp.dest(DIST_DIR));
});

//結合されたapibファイルからhtmlファイル生成
gulp.task('output', function () {
  return gulp.src(INDEX_APIB_FILE)
    .pipe(aglio({ template: 'default' }))
    .pipe(gulp.dest(DIST_DIR));
});

//ブラウザのリロード
gulp.task('reload', function (done) {
  browserSync.reload();
  done();
});

//ファイルの変更監視
//変更があった時点でhtmlを再生成しブラウザをリロード
gulp.task('watch', function () {
  gulp.watch(WATCH_TARGET_FILE, gulp.series(['combine', 'output', 'reload']));
});

//内蔵ブラウザ起動
gulp.task('browserSync', function () {
  browserSync({
    logConnections: true,
    logFileChanges: true,
    notify: true,
    port: 8088,
    open: false,
    server: {
      baseDir: DIST_DIR
    }
  });
});

//サーバー起動
gulp.task('server', gulp.parallel(['browserSync', 'watch']));