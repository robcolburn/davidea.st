import * as posts from './services/posts';
import * as admin from 'firebase-admin';

const serviceAccount = require('./firebase-sa.json');
const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://davidea-st.firebaseio.com'
});

const key = process.env.KEY;

async function create(key: string) {
  const articleSnap = await adminApp.database().ref('articles').child(key).once('value');
  const article = articleSnap.val();
  return posts.create(adminApp, article);
}


create(key)
  .then(_ => {
    process.exit(0);
  })
  .catch(e => {
    console.log(e);
    process.exit(1);
  });