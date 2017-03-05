"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var csso = require('csso');
// const psize = require('pretty-size');
// const gzipSize = require('gzip-size');
var STYLE_TAG = '<style>';
var CLOSED_STYLE_TAG = '</style>';
var EMBED_REPLACE_TOKEN = /<!-- ::EMBEDDED-STYLES:: -->/;
// const cssFiles = [
//   '/site/css/colors.css',
//   '/site/css/base.css',
//   '/site/css/layout.css',
//   '/site/css/state.css',
//   '/site/css/clickcircle.css',
//   '/site/css/imagefigure.css',
//   '/site/css/prismbasic.css',
// ];
function embedCss(cssFiles) {
    var cssContent = cssFiles.map(function (file) { return fs.readFileSync(file).toString('utf8'); });
    var cssCombined = cssContent.join('\n');
    var compressedCss = csso.minify(cssCombined).css;
    return compressedCss;
}
exports.embedCss = embedCss;
// const cssWithStyleTag = [STYLE_TAG, compressedCss, CLOSED_STYLE_TAG];
// const styleElement = cssWithStyleTag.join('\n');
// const html = fs.readFileSync('./src/index.html').toString('utf8');
// const result = html.replace(EMBED_REPLACE_TOKEN, styleElement);
// fs.writeFileSync('./public/index.html', result);
// Get size
// const cssBytes = cssCombined.length;
// const compressedBytes = gzipSize.sync(compressedCss);
// const htmlBytes = gzipSize.sync(result);
// console.log(`CSS        : ${psize(cssBytes, true)} non gzipped`);
// console.log(`CSS        : ${psize(compressedBytes, true)} gzipped`);
// console.log(`--------------------------------`);
// console.log(`HTML + CSS : ${psize(htmlBytes, true)} gzipped`);
