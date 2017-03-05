import * as express from 'express';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as admin from 'firebase-admin';

import * as posts from './build/posts';
import { defaultFiles } from './build/cssfiles';
import { embedCss } from './build/embedcss';
const app = express();
app.use('/assets', express.static(__dirname + '/assets'));

const serviceAccount = require('./firebase-sa.json');

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://davidea-st.firebaseio.com'
});

app.get('/', async function (req, res) {
  const indexHtml = fs.readFileSync(__dirname + '/templates/_index.ejs').toString('utf8');
  const styles = embedCss(defaultFiles(__dirname));
  const recentPosts = await posts.getPosts(adminApp, 10);
  const html = ejs.render(indexHtml, { styles, __dirname });
  res.send(html);
});

app.get('/posts/:title', async function (req, res) {
  const title = req.params['title'];
  const styles = embedCss(defaultFiles(__dirname));
  const singlePost = await posts.getSinglePost(adminApp, title);
  const html = renderPage(title, styles);
  res.json(singlePost);
});

function renderPage(title: string, styles: string) {
  // const compiledPost = pug.compileFile(__dirname + '/templates/_post.handlerbars');
  // const content = pug.compileFile(__dirname + '/posts/' + title + '.handlerbars')();
  // return compiledPost({ title, styles, content });
  return '';
}

app.listen(3000, () => console.log('listening!'));