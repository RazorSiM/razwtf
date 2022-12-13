const { readFileSync, writeFileSync } = require('fs')
const ffmpeg = require('fluent-ffmpeg')
function convertImage(imagePath, outputPath) {
  ffmpeg().input(imagePath).output(outputPath)
}

// read all images path in ./public and all of its subfolders


// const images = readFileSync('public')
// console.log(images)
