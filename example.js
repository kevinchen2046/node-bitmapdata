'use strict';

const { Point, Rectangle, Matrix, BitmapData, ColorMatrixFilter, ColorTransform, BlendMode, BitmapDataChannel, BitmapDataFile, Util } = require('./index');

(async () => {
    let file1 = await BitmapDataFile.from('./assets/1.png');
    let file2 = await BitmapDataFile.from('./assets/2.png');

    //change size
    var size = {
        width: 92,
        height: 92
    }
    var bmpdata = new BitmapData(size.width, size.height, true, 0x00);
    bmpdata.draw(file1.bitmapData, new Matrix(size.width / file1.bitmapData.width, 0, 0, size.width / file1.bitmapData.height, 0, 0), null);
    BitmapDataFile.save(`thum/abc.png`, bmpdata);

    //Blend-Mode
    var blendModeArray = [
        { mode: BlendMode.ADD, name: "BlendMode.ADD" },
        { mode: BlendMode.DARKEN, name: "BlendMode.DARKEN" },
        { mode: BlendMode.DIFFERENCE, name: "BlendMode.DIFFERENCE" },
        { mode: BlendMode.HARDLIGHT, name: "BlendMode.HARDLIGHT" },
        { mode: BlendMode.LIGHTEN, name: "BlendMode.LIGHTEN" },
        { mode: BlendMode.MULTIPLY, name: "BlendMode.MULTIPLY" },
        { mode: BlendMode.NORMAL, name: "BlendMode.NORMAL" },
        { mode: BlendMode.OVERLAY, name: "BlendMode.OVERLAY" },
        { mode: BlendMode.SCREEN, name: "BlendMode.SCREEN" },
        { mode: BlendMode.SUBTRACT, name: "BlendMode.SUBTRACT" }
    ];
    var displays = [];
    for (var i = 0; i < blendModeArray.length; i++) {
        var bmd_blend = file1.bitmapData.clone();
        var blend = blendModeArray[i];
        bmd_blend.draw(file2.bitmapData, new Matrix(1, 0, 0, 1, 20, 20), null, blend.mode);
        var text = bmd_blend.createText(blend.name, 0, 0, 0xffffff, '', 20);
        bmd_blend.createRect(0, 0, text.width, 24);
        displays.push(bmd_blend.canvas);
    }

    //Channal
    var bmd_channal = file1.bitmapData.clone();
    leenaData = file2.bitmapData.clone();
    bmd_channal.copyChannel(leenaData,
        new Rectangle(50, 50, 200, 200),
        new Point(50, 50),
        BitmapDataChannel.GREEN,
        BitmapDataChannel.GREEN);
    bmd_channal.createText('copyChannel')
    displays.push(bmd_channal.canvas);


    //colorMatrixFilter
    var bmd_colormf1 = file1.bitmapData.clone();
    var bmd_colormf2 = file1.bitmapData.clone();
    var invertMatrix = [
        -1, 0, 0, 0, 255,
        0, -1, 0, 0, 255,
        0, 0, -1, 0, 255,
        0, 0, 0, 1, 0
    ];
    var brightness = [
        2, 0, 0, 0, 0,
        0, 2, 0, 0, 0,
        0, 0, 2, 0, 0,
        0, 0, 0, 1, 0
    ];
    var invertFilter = new ColorMatrixFilter(invertMatrix);
    var brightnessFilter = new ColorMatrixFilter(brightness);
    var zeroPoint = new Point();
    bmd_colormf1.draw(file1.bitmapData);
    bmd_colormf1.applyFilter(bmd_colormf1, bmd_colormf1.rect, zeroPoint, invertFilter);
    bmd_colormf1.createText('colorMatrixFilter-invert')
    bmd_colormf2.draw(file1.bitmapData);
    bmd_colormf2.applyFilter(bmd_colormf2, bmd_colormf2.rect, zeroPoint, brightnessFilter);
    bmd_colormf2.createText('colorMatrixFilter-brightness')
    displays.push(bmd_colormf1.canvas, bmd_colormf2.canvas);

    //colorTransform
    var bmd_colortf = file1.bitmapData.clone();
    bmd_colortf.draw(file2.bitmapData);
    var colorTrans = new ColorTransform(1, 0, 1, 1, 180);
    var rect = new Rectangle(40, 40, file1.bitmapData.width - 80, file1.bitmapData.height - 80);
    bmd_colortf.colorTransform(rect, colorTrans);
    bmd_colortf.createText('colorTransform')
    displays.push(bmd_colortf.canvas);


    //noise
    var bmd_noise = file1.bitmapData.clone();
    bmd_noise.perlinNoise(
        bmd_noise.width / 2,
        bmd_noise.height / 2,
        Math.floor(Math.random() * 0xffff),
        BitmapDataChannel.RED | BitmapDataChannel.BLUE,
        false
    );
    bmd_noise.createText('noise')
    displays.push(bmd_noise.canvas);

    Util.saveToHTML('index.html', ...displays);
})()
