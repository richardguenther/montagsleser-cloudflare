const htmlmin = require('html-minifier');
const esbuild = require('esbuild');
const now = String(Date.now());
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, cls, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 600],
    formats: ["avif", "jpeg"],
    outputDir: "_fetched/imagesOptimized",
    urlPath: "/img/"
  });

  let imageAttributes = {
       class: cls,
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}
 


// Create a helpful production flag
const isProduction = process.env.NODE_ENV === 'production';

module.exports = function (eleventyConfig) {
      eleventyConfig.setServerOptions({
            // Opt-out of DOM diffing updates and use page reloads (false works better with tailwindcss, true works smarter with js changes)
            domdiff: false,
            // The starting port number to attempt to use
            port: 8080,
      });



      // Image Shortcodes
      eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
      eleventyConfig.addLiquidShortcode("image", imageShortcode);
      eleventyConfig.addJavaScriptFunction("image", imageShortcode);

      // Add Navigation Plugin
      eleventyConfig.addPlugin(eleventyNavigationPlugin);

      // Shortcode für versions-Nummer für css und js Endungen
      eleventyConfig.addShortcode('version', function () {
            return now;
      });

      // Only minify HTML when in Production
      // eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
      //       if (isProduction && outputPath && outputPath.endsWith('.html')) {
      //             let minified = htmlmin.minify(content, {
      //                   useShortDoctype: true,
      //                   removeComments: true,
      //                   collapseWhitespace: true,
      //             });
      //             return minified;
      //       }

      //       return content;
      // });

      // Only minify JS when in Production
      if (isProduction) {
            eleventyConfig.on('afterBuild', () => {
                  return esbuild.build({
                        entryPoints: ['src/js/app.js'],
                        outdir: '_site/js',
                        minify: isProduction,
                        sourcemap: isProduction,
                  });
            });
      } else eleventyConfig.addPassthroughCopy('src/js');

      // copy audio- and image-folder
      eleventyConfig.addPassthroughCopy({'uploads/audio' : './audio'});
      eleventyConfig.addPassthroughCopy({'_fetched/imagesOptimized' : './img'});

      // Copy minified alpine.js from node-folder to _site-Folder
      eleventyConfig.addPassthroughCopy({
            './node_modules/alpinejs/dist/cdn.min.js': './js/alpine.js',
      });

      // Watch my js-File for changes
      eleventyConfig.addWatchTarget('src/js/app.js');

      // 11ty rocks Shortcode for year
      eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);


      // Return your Object options:
      return {
            dir: {
                  input: 'src',
                  output: '_site',
            },
      };
};
