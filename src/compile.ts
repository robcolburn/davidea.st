import * as fs from 'fs';
import * as ejs from 'ejs';
import * as admin from 'firebase-admin';
import * as utils from './utils';
import * as posts from './services/posts';
import * as blogRenderer from './render';

import { Post, AdminApp } from './interfaces';

const OFFLINE = !!process.env['OFFLINE'];

export async function home(adminApp: AdminApp, limit: number) {
  try {
    const html = await blogRenderer.home(adminApp, limit);
    return utils.writeFile(process.cwd() + '/public/index.html', html);
  } catch (e) {
    return e;
  }
}

export async function notFound() {
  try {
    const html = await blogRenderer.notFound();
    return utils.writeFile(process.cwd() + '/public/404.html', html);
  } catch(e) {
    return e;
  }
}

export async function articles(adminApp: AdminApp) {
  const articles = await posts.all(adminApp, OFFLINE);
  let renderedArticles: { article: Post, html: string }[] = [];
  for (let article of await articles) {
    renderedArticles = [...renderedArticles, {
      article,
      html: await blogRenderer.single(article)
    }];
  }
  let renderPromises = [];
  for (let renderedArticle of renderedArticles) {
    const filePath = `${process.cwd()}/public/articles/${renderedArticle.article.pagePath}.html`;
    const written = await utils.writeFile(filePath, renderedArticle.html)
    renderPromises = [...renderPromises, written];
  }
  return renderPromises;
}

export async function tags(adminApp: AdminApp) {
  const tagKeys = await posts.tagKeys(adminApp);
  let rendered = [];
  for(let key of tagKeys) {
    const html = await blogRenderer.tag(adminApp, key);
    const filePath = `${process.cwd()}/public/tags/${key.toLowerCase()}.html`;
    const written = await utils.writeFile(filePath, html);
    rendered = [...rendered, written];
  }
  return rendered;
}

export async function compileAll() {
  let adminApp = null;
  if(!OFFLINE) {
    const serviceAccount = require('./firebase-sa.json');
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://davidea-st.firebaseio.com'
    });
  };

  try {
    await home(adminApp, 10);
    //await notFound();
    await articles(adminApp);
    //await tags(adminApp);
    process.exit(0); 
  } catch (e) {
    console.log(e); process.exit(1);
  }

}
