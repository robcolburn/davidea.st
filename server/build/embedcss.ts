const fs = require('fs');
const csso = require('csso');
// const psize = require('pretty-size');
// const gzipSize = require('gzip-size');

const STYLE_TAG = '<style>';
const CLOSED_STYLE_TAG = '</style>';
const EMBED_REPLACE_TOKEN = /<!-- ::EMBEDDED-STYLES:: -->/;
// const cssFiles = [
//   '/site/css/colors.css',
//   '/site/css/base.css',
//   '/site/css/layout.css',
//   '/site/css/state.css',
//   '/site/css/clickcircle.css',
//   '/site/css/imagefigure.css',
//   '/site/css/prismbasic.css',
// ];

export function embedCss(cssFiles) {
  const cssContent = cssFiles.map(file => fs.readFileSync(file).toString('utf8'));
  const cssCombined = cssContent.join('\n');
  const compressedCss = csso.minify(cssCombined).css;
  return compressedCss;
}



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

