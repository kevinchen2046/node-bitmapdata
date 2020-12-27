const fs = require('fs');
const Util = require('./Utils');

module.exports = class BitmapDataFile {

    constructor(url) {
        this.bitmapData = null;
        return this.load(url);
    }

    static async from(url) {
        return new BitmapDataFile(url);
    }
    static save(path, bitmapData) {
        Util.save(path, bitmapData.canvas);
    }

    async load(url) {
        if (!url) return Promise.resolve(this);
        return Util.load(url);
    }

    save(path) {
        Util.save(path, this.bitmapData.canvas);
    }

    saveToHTML(path) {
        Util.saveToHTML(path, this.bitmapData.canvas);
    }
}
