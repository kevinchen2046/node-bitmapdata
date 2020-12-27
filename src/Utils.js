const fs = require('fs');
const { loadImage } = require('canvas');

module.exports.load = async function (url) {
    if (!url) return Promise.resolve(this);
    var image = await loadImage(url);
    var bitmapData = new BitmapData(image.width, image.height, true, 0x00);
    bitmapData.draw(image, new Matrix(1, 0, 0, 1, 0, 0), null);
    return bitmapData;
}

module.exports.saveToHTML = function (path, ...canvases) {
    var coontent = `<head></head>\r\n<body>\r\n`;
    for (var canvas of canvases) {
        coontent += `<img src="${canvas.toDataURL()}" />\r\n`;
    }
    coontent += `</body>`
    fs.writeFileSync(path, coontent, 'utf-8');
}

module.exports.save = function (path, canvas) {
    fs.writeFileSync(path, canvas.toBuffer());
}