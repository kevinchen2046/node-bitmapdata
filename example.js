'use strict';

const { createCanvas, loadImage, createImageData } = require('canvas');
const { Point,Rectangle,Matrix,BitmapData,ColorMatrixFilter,ColorTransform,BlendMode,BitmapDataChannel,display,save} = require('./index');

loadImage('./assets/1.png').then((image1) => {
    loadImage('./assets/2.png').then((image2) => {

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
            var bmd_blend = new BitmapData(image1.width, image1.height, true, 0x00);
            var blend = blendModeArray[i];
            bmd_blend.draw(image1);
            bmd_blend.draw(image2, new Matrix(1,0,0,1,20,20), null, blend.mode);
            var text=bmd_blend.createText(blend.name, 0, 0, 0xffffff, '', 20);
            bmd_blend.createRect(0,0,text.width,24);
            displays.push(bmd_blend.canvas);
        }

        //Channal
        var bmd_channal = new BitmapData(image1.width, image1.height, true, 0x00);
        bmd_channal.draw(image1);
        leenaData = new BitmapData(image2.width, image2.height);
        leenaData.draw(image2);
        bmd_channal.copyChannel(leenaData,
            new Rectangle(50, 50, 200, 200),
            new Point(50, 50),
            BitmapDataChannel.GREEN,
            BitmapDataChannel.GREEN);
        bmd_channal.createText('copyChannel')
        displays.push(bmd_channal.canvas);


        //colorMatrixFilter
        var bmd_colormf1 = new BitmapData(image1.width, image1.height, true, 0x00);
        var bmd_colormf2 = new BitmapData(image1.width, image1.height, true, 0x00);
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
        bmd_colormf1.draw(image1);
        bmd_colormf1.applyFilter(bmd_colormf1, bmd_colormf1.rect, zeroPoint, invertFilter);
        bmd_colormf1.createText('colorMatrixFilter-invert')
        bmd_colormf2.draw(image1);
        bmd_colormf2.applyFilter(bmd_colormf2, bmd_colormf2.rect, zeroPoint, brightnessFilter);
        bmd_colormf2.createText('colorMatrixFilter-brightness')
        displays.push(bmd_colormf1.canvas, bmd_colormf2.canvas);

        //colorTransform
        var bmd_colortf = new BitmapData(image1.width, image1.height, true, 0x00);
        bmd_colortf.draw(image2);
        var colorTrans = new ColorTransform(1, 0, 1, 1, 180);
        var rect = new Rectangle(40, 40, image1.width - 80, image1.height - 80);
        bmd_colortf.colorTransform(rect, colorTrans);
        bmd_colortf.createText('colorTransform')
        displays.push(bmd_colortf.canvas);


        //noise
        var bmd_noise = new BitmapData(image1.width, image1.height, true, 0x00);
        bmd_noise.perlinNoise(
            bmd_noise.width / 2,
            bmd_noise.height / 2,
            Math.floor(Math.random() * 0xffff),
            BitmapDataChannel.RED | BitmapDataChannel.BLUE,
            false
        );
        bmd_noise.createText('noise')
        displays.push(bmd_noise.canvas);

        display('index.html', ...displays);
    });
});