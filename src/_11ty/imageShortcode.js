const Image = require('@11ty/eleventy-img')

const imageShortcode = async (
  relativeSrc,
  alt,
  className,
  widths = [null, 300, 800, 1280],
  formats = ['webp'],
  sizes = '(min-width: 100px)'
) => {
  const imageMetadata = await Image(relativeSrc, {
    widths,
    formats,
    outputDir: './_site/images/',
    urlPath: '/images/',
  })

  const imageAttributes = {
    alt,
    sizes,
    loading: 'lazy',
    decoding: 'async',
  }

  if(className) {imageAttributes['class'] = className }

  return Image.generateHTML(imageMetadata, imageAttributes)
}


module.exports.imageShortcode = imageShortcode;