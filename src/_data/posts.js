const EleventyFetch = require("@11ty/eleventy-fetch");

async function getWpPosts() {
  const url = "https://inhalt.montagsleser.de/wp-json/wp/v2/kunstwerk?per_page=12";

  const response = EleventyFetch(url, {
    dureation: "1d",
    type: "json"
  })
  const posts = response;
  return posts;
}

module.exports = getWpPosts;