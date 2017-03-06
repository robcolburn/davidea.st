import * as fs from 'fs';
import * as ejs from 'ejs';
import * as admin from 'firebase-admin';
import * as utils from './build/utils';
import * as posts from './build/posts';

import { Post, AdminApp } from './interfaces';
import { defaultFiles } from './build/cssfiles';
import { embedCss } from './build/embedcss';

export async function home (adminApp: AdminApp, limit: number) {
  try {
    const styles = embedCss(defaultFiles(__dirname));
    const articles = await posts.last(adminApp, 10);
    const headlinePost = articles.shift();
    const indexHtml = await utils.readFile(__dirname + '/templates/_index.ejs');
    await utils.copy(`${__dirname}/assets`, `${process.cwd()}/public/assets`)
    const html = ejs.render(indexHtml, { styles, __dirname, headlinePost, articles });
    return utils.writeFile(process.cwd() + '/public/index.html', html);
  } catch (e) {
    return e;
  }
}

export function articles() {
  throw new Error('Not Implemented');
}

export function article() {
  throw new Error('Not Implemented');
}

const serviceAccount = require('./firebase-sa.json');

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://davidea-st.firebaseio.com'
});

home(adminApp, 10)
  .then(a => process.exit(0))
  .catch(e => { console.log(e); process.exit(1); });