const browserify = require("browserify");
const fs = require('fs');

browserify({
    standalone:"Window"
  })
    .add("src/browseri.js")
    .bundle(function (err) {
      if (err) throw err;
    })
    .pipe(fs.createWriteStream("src/browserii.js"));
