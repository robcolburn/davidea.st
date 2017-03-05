"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var csso = require('csso');
var EMBED_REPLACE_TOKEN = /<!-- ::EMBEDDED-STYLES:: -->/;
function embedCss(cssFiles) {
    var cssContent = cssFiles.map(function (file) { return fs.readFileSync(file).toString('utf8'); });
    var cssCombined = cssContent.join('\n');
    var compressedCss = csso.minify(cssCombined).css;
    return compressedCss;
}
exports.embedCss = embedCss;
