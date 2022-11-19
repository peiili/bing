const { encode } = require('blurhash');
const { createCanvas, loadImage, Image } = require('canvas');

function clamp(n) {
  return Math.min(9, Math.max(1, n));
}

function doEncode(image, width, height, cb) {
  const componentX = clamp(4);
  const componentY = clamp(3);
  if (image) {
    const originalCanvas = createCanvas(width, height);
    const ctx = originalCanvas.getContext('2d');
    ctx.drawImage(image, 0, 0, originalCanvas.width, originalCanvas.height);
    setTimeout(() => {
      const imageData = ctx.getImageData(
        0,
        0,
        width,
        height,
      );
      const blurhash = encode(
        imageData.data,
        imageData.width,
        imageData.height,
        componentX,
        componentY,
      );
      cb(blurhash);
    }, 0);
  }
}

function imageToHash(src, cb) {
  const image = new Image();
  image.onerror = (err) => { throw err; };
  image.onload = function () {
    const { width } = image;
    const { height } = image;
    loadImage(src).then((img) => {
      doEncode(img, width, height, (hash) => {
        cb({ shortHash: hash, shortWidth: width, shortHeight: height });
      });
    });
  };
  image.src = src;
}

module.exports = {
  imageToHash,
};
