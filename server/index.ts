import * as express from 'express';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as admin from 'firebase-admin';

import * as posts from './build/posts';
import { Post } from './interfaces';
import { defaultFiles } from './build/cssfiles';
import { embedCss } from './build/embedcss';
import * as utils from './build/utils';

const app = express();
app.use('/assets', express.static(__dirname + '/assets'));

const serviceAccount = require('./firebase-sa.json');

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://davidea-st.firebaseio.com'
});

app.get('/', async function (req, res) {
  const indexHtml = await utils.readFile(__dirname + '/templates/_index.ejs');
  const styles = embedCss(defaultFiles(__dirname));
  const articles = await posts.last(adminApp, 10);
  const headlinePost = articles.shift();
  try {
    const html = ejs.render(indexHtml, { styles, __dirname, headlinePost, articles });
    res.send(html);
  } catch (e) {
    console.log(e);
    res.send('<h1>¯\_(ツ)_/¯</h1>');
  }
});

app.get('/posts/:title', async function (req, res) {
  try {
    const title = req.params['title'];
    const styles = embedCss(defaultFiles(__dirname));
    const post = await posts.single(adminApp, title);
    const postHtml = await utils.readFile(__dirname + '/templates/_post.ejs');
    const html = ejs.render(postHtml, { styles, __dirname, post });
    res.send(html);
  } catch(e) {
    console.log(e);
    res.send('<h1>¯\_(ツ)_/¯</h1>');
  }
});

app.post('/posts', async function (req, res) {
  const postBody = req.body as Post;
  const newPost = await posts.create(adminApp, postBody);
  res.json(newPost);
});

function renderPage(title: string, styles: string) {
  // const compiledPost = pug.compileFile(__dirname + '/templates/_post.handlerbars');
  // const content = pug.compileFile(__dirname + '/posts/' + title + '.handlerbars')();
  // return compiledPost({ title, styles, content });
  return '';
}

/*
function createPostsFromJson(): Promise<Post[]> {
  const postData = require('./data/posts.json');
  const postArray = Object.keys(postData.posts).map(postKey => postData.posts[postKey]);
  postArray.forEach(post => posts.create(adminApp, post));
  return Promise.all(postArray);
}

createPostsFromJson().then(posts => console.log(posts));
*/

app.listen(3000, () => console.log('listening!'));