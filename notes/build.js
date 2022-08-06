#!/usr/bin/env node
const { build, watch } = require("estrella");

build({
  entry: "src/index.js",
  outfile: "dist/worker.mjs",
  bundle: true,
  platform: "browser",
  minify: false,
  format: "esm",
  onStart: async (config, changedFiles, context) => {
    const isInitialBuild = changedFiles.length === 0;
    if (isInitialBuild) {

      /*try {
        await remove("dist");
        await copy("static", "dist/static", { recursive: true });
      } catch (e) {
        console.warn(chalk.yellow("Could not remove existing dist folder and copy static assets (maybe you are running wrangler dev?)"))
      }

      // const cssInputFiles = await buildStyles(config);
      // if (config.watch) {
      //   watch(cssInputFiles, f => {
      //     buildStyles(config);
      //   });
      // }
      */
    }
  }
})
