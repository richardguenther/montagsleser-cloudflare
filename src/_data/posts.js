const EleventyFetch = require("@11ty/eleventy-fetch");

async function getWpPosts() {
  const url = "https://inhalt.montagsleser.de/wp-json/mon/v1/kunstwerk";

  const response = EleventyFetch(url, {
    dureation: "1d",
    type: "json"
  })
  const posts = response;
  return posts;
}

module.exports = getWpPosts;