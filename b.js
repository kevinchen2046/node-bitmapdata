var { createImageData } = require('canvas');
/**
* 从32位颜色值中提取三原色 
* @param color
* @return 
*/
function extract(color) {
    var r = color >> 24 & 0xFF;
    var g = color >> 16 & 0xFF;
    var b = (color >> 8) & 0xFF;
    var a = color & 0xff;
    return [r, g, b, a];
}

/**
 * 将带有通道信息的三原色合并 
 * @param r
 * @param g
 * @param b
 * @return 
 */
function merge(r, g, b, a) {
    r = Math.max(0, Math.min(0xFF, r));
    g = Math.max(0, Math.min(0xFF, g));
    b = Math.max(0, Math.min(0xFF, b));
    a = Math.max(0, Math.min(0xFF, a));
    var color = (g << 16) | (b << 8) | a;
    return color + (r * 256 * 256 * 256);
}

module.exports=class BitmapData {

    constructor(width, height) {
        if (width && height) this.source = createImageData(width, height);
    }

    set source(v) {
        if (this._source != v) {
            this._source = v;
            this._width = this._source.width;
            this._height = this._source.height;
            this._data = this._source.data;
        }
    }

    get data() {
        return this._data;
    }

    get source() {
        return this._source;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    fill(color, x, y, w, h) {
        //console.log('------------');
        var that=this;
        var data = that.data;
        var width = that.width;
        var height = that.height;
        x = x || 0;
        y = y || 0;
        w = w || width;
        h = h || height;

        var sx = Math.max(0, Math.min(width, x));
        var sy = Math.max(0, Math.min(height, y));
        var ex = Math.max(0, Math.min(width, sx + w));
        var ey = Math.max(0, Math.min(height, sy + h));
        w = ex - sx;
        h = ey - sy;
        var result = extract(color);
        var r = result[0];
        var g = result[1];
        var b = result[2];
        var a = result[3];
        for (var b1 = sy; b1 < ey; b1++) {
            for (var a1 = sx; a1 < ex; a1++) {
                var j = that._getIndex(a1,b1);
                data[j] = r;
                data[j + 1] = g;
                data[j + 2] = b;
                data[j + 3] = a;
            }
        }
    }

    copyPixels(sourceBitmapData, sourceRect, destPoint, mergeAlpha = true) {
        var sx = Math.max(0, Math.min(sourceBitmapData.width, sourceRect.x));
        var sy = Math.max(0, Math.min(sourceBitmapData.height, sourceRect.y));
        var ex = Math.max(0, Math.min(sourceBitmapData.width, sourceRect.x + sourceRect.width));
        var ey = Math.max(0, Math.min(sourceBitmapData.width, sourceRect.y + sourceRect.height));
        destPoint.x=destPoint.x>>0;
        destPoint.y=destPoint.y>>0;
        // sx = Math.max(0, Math.min(this.width, destPoint.x + sx));
        // sy = Math.max(0, Math.min(this.height, destPoint.y + sy));
        // ex = Math.max(0, Math.min(this.width, destPoint.x + ex));
        // ey = Math.max(0, Math.min(this.height, destPoint.y + ey));
        this._setPixels(sx, sy, ex, ey, sourceBitmapData,destPoint, mergeAlpha);
    }

    _getIndex(x, y) {
        return (y * this.width + x) * 4;
    }

    setPixel(x, y, color) {
        var data = this.data;
        var result = extract(color);
        var r = result[0];
        var g = result[1];
        var b = result[2];
        var a = result[3];
        var j = this._getIndex(x, y);
        data[j] = r;
        data[j + 1] = g;
        data[j + 2] = b;
        data[j + 3] = a;
    }

    getPixel(x, y) {
        var data = this.data;
        var j = this._getIndex(x, y);
        var r = data[j];
        var g = data[j + 1];
        var b = data[j + 2];
        var a = data[j + 3];
        return merge(r, g, b, a);
    }

    _getPixel(x, y) {
        var data = this._data;
        var j = this._getIndex(x, y);
        var r = data[j];
        var g = data[j + 1];
        var b = data[j + 2];
        var a = data[j + 3];
        return [r, g, b, a];
    }

    _setPixels(sx, sy, ex, ey, source,destPoint,mergeAlpha) {
        var data = this.data;
        for (var b1 = sy; b1 < ey; b1++) {
            for (var a1 = sx; a1 < ex; a1++) {
                var results = source._getPixel(a1, b1);
                var j = this._getIndex(a1+destPoint.x, b1+destPoint.y);
                if (mergeAlpha) {
                    var alpha = results[3] / 255;
                    if (alpha == 1) {
                        data[j] = results[0];
                        data[j + 1] = results[1];
                        data[j + 2] = results[2];
                        //data[j + 3] = results[3];
                    } else {
                        data[j] = results[0] * alpha | data[j];
                        data[j + 1] = results[1] * alpha | data[j + 1];
                        data[j + 2] = results[2] * alpha | data[j + 2];
                    }
                    data[j + 3] = results[3] | data[j + 3];;
                } else {
                    data[j] = results[0];
                    data[j + 1] = results[1];
                    data[j + 2] = results[2];
                    data[j + 3] = results[3];
                }
            }
        }
    }

    toString() {
        var data = this.data;
        var width = this.width;
        var height = this.height;
        var result = '';
        for (var b = 0; b < height; b++) {
            for (var a = 0; a < width; a++) {
                var j = this._getIndex(a,b);
                var color = merge(data[j], data[j + 1], data[j + 2], data[j + 3]);
                result += color.toString(16) + ','
            }
            result += '\n';
        }
        return result;
    }
}