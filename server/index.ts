import * as express from 'express';
import * as fs from 'fs';
import * as ejs from 'ejs';

import { embedCss } from './build/embedcss';
const app = express();
app.use("/assets", express.static(__dirname + '/assets'));

const cssFiles = [
  '/css/variables.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/clickcircle.css',
  '/css/imagefigure.css',
  '/css/headline.css',
  '/css/pill.css'
].map(file => __dirname + file);

app.get('/', function (req, res) {
  const indexHtml = fs.readFileSync(__dirname + '/templates/_index.ejs').toString('utf8');
  const styles = embedCss(cssFiles);
  const html = ejs.render(indexHtml, { styles });
  res.send(html);
});

app.get('/posts/:title', function (req, res) {
  const title = req.params['title'];
  const styles = embedCss(__dirname);
  const html = renderPage(title, styles);
  res.send(html);
});

function renderPage(title: string, styles: string) {
  // const compiledPost = pug.compileFile(__dirname + '/templates/_post.handlerbars');
  // const content = pug.compileFile(__dirname + '/posts/' + title + '.handlerbars')();
  // return compiledPost({ title, styles, content });
  return '';
}

app.listen(3000, () => console.log('listening!'));