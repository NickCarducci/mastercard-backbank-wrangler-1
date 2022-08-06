
const browserify = require("browserify");
const work = require('webworkify');
   var fs = require('fs');

/*var bundler = browserify('app.jsx', {
  debug: false,
  extensions: ['.jsx'],
  cache: {},
  packageCache: {}
});*/
var goToWork=null;
browserify(/*{
    standalone:"Window"
  }*/)
    .add("./index.mjs")
    .bundle(function (err) {
      if (err) throw err;
    })
    /*.on('error', function(err) {
        gutil.log(err.message);
        browserSync.notify('Browserify error!');
        this.emit('end');
    })*/
      .on('end', ()=>goToWork=true)
    .pipe(fs.createWriteStream("./indexi.js"));
var w = goToWork&&work(require('./indexi.js'));
