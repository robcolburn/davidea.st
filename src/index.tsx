import { h } from 'preact';
import * as render from 'preact-render-to-string';
import * as express from 'express';
import Main from './pages/main';
import ArticlePage from './pages/article';
import { generateDefaultStyles } from './css';
import * as posts from './services/posts';
import * as firebase from 'firebase-admin';
import * as utils from './utils';
import { compileAll } from './compile';
import * as blogRenderer from './render';

if (process.env['COMPILE']) {
  compileAll()
    .then(_ => process.exit(0))
    .catch(e => { console.log(e); process.exit(1); });
} else {
  startServer();
}

function startServer() {
  const app = express();
  const serviceAccount = require(__dirname + '/firebase-sa.json');
  const adminApp = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://davidea-st.firebaseio.com'
  });

  app.use('/assets', express.static(__dirname + '/assets'));

  app.get('/', async (req, res) => {
    const styles = generateDefaultStyles();
    const articles = await posts.last(adminApp, 10, true);
    const headlinePost = articles.shift();
    const html = render(Main({ styles, articles, headlinePost }));
    res.send(html);
  });

  app.get('/articles/:title', async (req, res) => {
    try {
      const article = await posts.single(adminApp, req.params.title, true);
      const html = await blogRenderer.single(article);
      res.send(html);
    } catch (e) {
      // 404
      console.log(e);
      res.status(404).send('<h1>404</h1>');
    }
  });

  app.get('/tags/:tag', async (req, res) => {
    const { tag } = req.params;
    const tagHtml = await blogRenderer.tag(adminApp, tag);
    res.send(tagHtml);
  });

  app.listen(3000, () => console.log('Listening on 3000'));
}
