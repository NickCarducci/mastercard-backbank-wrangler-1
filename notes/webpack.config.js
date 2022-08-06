const { ProvidePlugin, LoaderOptionsPlugin } = require('webpack');

module.exports = {
  target: 'webworker',
  mode: "production",
  resolve:{
    alias: { 
      "assert": require.resolve("assert/"),
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "path": require.resolve("path-browserify"),
      "querystring": require.resolve("querystring-es3"),
      "stream": require.resolve("stream-browserify"),
      "url": require.resolve("url/"),
      "util": require.resolve("util/"),
      "zlib": require.resolve("browserify-zlib")
    }
  },
  plugins: [
    new ProvidePlugin({ Buffer: ["buffer", "Buffer"], process: 'process/browser' }), // util requires this internally
  ],
  externals: {
    "tls":"tls",
    "net":"net",
    "fs":"fs"
  }
};
