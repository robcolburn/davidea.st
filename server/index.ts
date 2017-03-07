import * as express from 'express';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as admin from 'firebase-admin';

import * as posts from './build/posts';
import * as render from './build/render';
import { Post } from './interfaces';
import { defaultFiles, styles404 } from './build/cssfiles';
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
  try {
    const html = await render.home(adminApp, 10);
    res.send(html);
  } catch(e) {
    res.send(await render.notFound());
  }
});

app.get('/posts/:title', async function (req, res) {
  try {
    const title = req.params['title'];
    const html = await render.singlePost(adminApp, title);
    res.send(html);
  } catch(e) {
    console.log(e);
    res.send(await render.notFound());
  }
});

app.get('/tags/:tag', async function(req, res) {
  try {
    const tag = req.params['tag'];
    res.send(await render.tag(adminApp, tag));
  } catch (e) {
    res.send(await render.notFound());
  }
});

app.post('/posts', async function (req, res) {
  const postBody = req.body as Post;
  const newPost = await posts.create(adminApp, postBody);
  res.json(newPost);
});

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