const fs = require('fs');
const { loadImage } = require('canvas');

module.exports = class BitmapDataFile {

    constructor(url) {
        this.bitmapData = null;
        return this.load(url);
    }

    static async from(url) {
        return new BitmapDataFile(url);
    }
    static save(path, bitmapData) {
        fs.writeFileSync(path, bitmapData.canvas.toBuffer());
    }

    async load(url) {
        if (!url) return Promise.resolve(this);
        var image = await loadImage(url);
        this.bitmapData = new BitmapData(image.width, image.height, true, 0x00);
        this.bitmapData.draw(image, new Matrix(1, 0, 0, 1, 0, 0), null);
        return this;
    }

    save(path) {
        fs.writeFileSync(path, this.bitmapData.canvas.toBuffer());
    }

    saveToHTML(path) {
        var coontent = `<head></head>\r\n<body>\r\n`;
        coontent += `<img src="${this.bitmapData.canvas.toDataURL()}" />\r\n`;
        coontent += `</body>`
        fs.writeFileSync(path, coontent, 'utf-8');
    }
}
