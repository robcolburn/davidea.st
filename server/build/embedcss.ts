const fs = require('fs');
const csso = require('csso');
const EMBED_REPLACE_TOKEN = /<!-- ::EMBEDDED-STYLES:: -->/;

export function embedCss(cssFiles) {
  const cssContent = cssFiles.map(file => fs.readFileSync(file).toString('utf8'));
  const cssCombined = cssContent.join('\n');
  const compressedCss = csso.minify(cssCombined).css;
  return compressedCss;
}
