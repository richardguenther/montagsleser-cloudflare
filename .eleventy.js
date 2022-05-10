const htmlmin = require('html-minifier');
const esbuild = require('esbuild');
const now = String(Date.now());
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const Image = require("@11ty/eleventy-img");

// Create a helpful production flag
const isProduction = process.env.NODE_ENV === 'production';

module.exports = function (eleventyConfig) {
      eleventyConfig.setServerOptions({
            // Opt-out of DOM diffing updates and use page reloads (false works better with tailwindcss, true works smarter with js changes)
            domdiff: false,
            // The starting port number to attempt to use
            port: 8080,
      });

      // Add Navigation Plugin
      eleventyConfig.addPlugin(eleventyNavigationPlugin);

      // Shortcode für versions-Nummer für css und js Endungen
      eleventyConfig.addShortcode('version', function () {
            return now;
      });

      // Only minify HTML when in Production
      eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
            if (isProduction && outputPath && outputPath.endsWith('.html')) {
                  let minified = htmlmin.minify(content, {
                        useShortDoctype: true,
                        removeComments: true,
                        collapseWhitespace: true,
                  });
                  return minified;
            }

            return content;
      });

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
      eleventyConfig.addPassthroughCopy({'uploads/audio' : './files'});
      eleventyConfig.addPassthroughCopy({'uploads/images' : './files'});

      // Copy minified alpine.js from node-folder to _site-Folder
      eleventyConfig.addPassthroughCopy({
            './node_modules/alpinejs/dist/cdn.min.js': './js/alpine.js',
      });

      // Watch my js-File for changes
      eleventyConfig.addWatchTarget('src/js/app.js');

      // 11ty rocks Shortcode for year
      eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

        // --- START, eleventy-img
  function imageShortcode(src, alt, sizes="(min-width: 1024px) 100vw, 50vw") {
      console.log(`Generating image(s) from:  ${src}`);
      let options = {
        widths: [600, 900, 1500],
        formats: ["webp", "jpeg"],
        urlPath: "/images/",
        outputDir: "./_site/images/",
        filenameFormat: function (id, src, width, format, options) {
          const extension = path.extname(src);
          const name = path.basename(src, extension);
          return `${name}-${width}w.${format}`;
        }
      };
  
      // generate images
      Image(src, options);
  
      let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
      };
      // get metadata
      metadata = Image.statsSync(src, options);
      return Image.generateHTML(metadata, imageAttributes);
    };
    eleventyConfig.addShortcode("image", imageShortcode);
    // --- END, eleventy-img

      // Return your Object options:
      return {
            dir: {
                  input: 'src',
                  output: '_site',
            },
      };
};
