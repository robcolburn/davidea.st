import { h } from 'preact';
import * as render from 'preact-render-to-string';
import * as express from 'express';
import Main from './pages/main';
import { generateDefaultStyles } from './css';
import * as posts from './services/posts';
import * as firebase from 'firebase-admin';

const app = express();
const serviceAccount = require('./firebase-sa.json');
const adminApp = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://davidea-st.firebaseio.com'
});

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', async (req, res) => {
  const styles = generateDefaultStyles();
  const articles = await posts.last(adminApp, 10);
  const headlinePost = articles.shift(); 
  const html = render(Main({ styles, articles, headlinePost }));
  res.send(html);
});

app.listen(3000, () => console.log('Listening on 3000'));
