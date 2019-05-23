
'use strict';

const {BlendMode,BitmapDataChannel,BitmapData}=require('./src/BitmapData');
const {display,save}=require('./src/Utils');
module.exports.BlendMode = BlendMode;
module.exports.BitmapDataChannel = BitmapDataChannel;
module.exports.BitmapData = BitmapData;
module.exports.Point=require('./src/Point');
module.exports.Rectangle=require('./src/Rectangle');
module.exports.Matrix=require('./src/Matrix');
module.exports.ColorTransform=require('./src/ColorTransform');
module.exports.SimplexNoise=require('./src/SimplexNoise');
module.exports.display=display;
module.exports.save=save;
module.exports.ColorMatrixFilter=require('./src/filters/ColorMatrixFilter');
