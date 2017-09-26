import * as fs from 'fs';
import * as sass from 'node-sass';

export const defaultFiles = () => [
  '/css/variables.scss',
  '/css/base.scss',
  '/css/layout.scss',
  '/css/clickcircle.scss',
  '/css/imagefigure.scss',
  '/css/headline.scss',
  '/css/pill.scss',
  '/css/article.scss',
  '/css/post.scss',
  '/css/prismbasic.scss',
  '/css/codebox.scss'
].map(file => __dirname + file);

export const styles404 = () => [
  '/css/variables.scss',
  '/css/base.scss',
  '/css/layout.scss',
  '/css/clickcircle.scss',
  '/css/imagefigure.scss',
  '/css/404.scss'  
].map(file => __dirname + file);

const fontCss = __dirname + '/css/font.css';

export function embedCss(cssFiles) {
  const cssContent = cssFiles.map(file => fs.readFileSync(file).toString('utf8'));
  const cssCombined = cssContent.join('\n');
  const result = sass.renderSync({
    data: cssCombined,
    outputStyle: 'compressed'
  });
  const css = result.css.toString('utf8');
  const fonts = fs.readFileSync(fontCss, 'utf8');
  return fonts + ' ' + css;
}

export function generateDefaultStyles() {
  return embedCss(defaultFiles());
}

export function generate404Styles() {
  return embedCss(styles404());
}
