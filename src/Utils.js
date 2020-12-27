var fs = require('fs');

module.exports.saveToHTML = function (outhtml, ...canvases) {
    var coontent = `<head></head>\r\n<body>\r\n`;
    for (var canvas of canvases) {
        coontent += `<img src="${canvas.toDataURL()}" />\r\n`;
    }
    coontent += `</body>`
    fs.writeFileSync(outhtml, coontent, 'utf-8');
}

module.exports.save = function (outfile,canvas) {
    fs.writeFileSync(outfile, canvas.toBuffer());
}