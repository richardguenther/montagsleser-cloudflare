const EleventyFetch = require("@11ty/eleventy-fetch");

async function getWpPosts() {
  const url = "https://acf.montagsleser.de/wp-json/wp/v2/posts?_embed&per_page=6";

  const response = EleventyFetch(url, {
    dureation: "1d",
    type: "json"
  })
  const posts = response;
  return posts;
}

module.exports = getWpPosts;