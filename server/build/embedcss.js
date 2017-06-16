"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const csso = require('csso');
const EMBED_REPLACE_TOKEN = /<!-- ::EMBEDDED-STYLES:: -->/;
function embedCss(cssFiles) {
    const cssContent = cssFiles.map(file => fs.readFileSync(file).toString('utf8'));
    const cssCombined = cssContent.join('\n');
    const compressedCss = csso.minify(cssCombined).css;
    return compressedCss;
}
exports.embedCss = embedCss;
