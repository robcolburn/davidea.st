import * as express from 'express';
import * as fs from 'fs';
import * as admin from 'firebase-admin';

import * as posts from './services/posts';
import { Post, AdminApp } from './interfaces';
import { generateDefaultStyles, generate404Styles } from './css';
import * as utils from './utils';
import * as render from 'preact-render-to-string';

import Main from './pages/main';
import ArticlePage from './pages/article';
import TagPage from './pages/tag';
import NotFoundPage from './pages/404';

const isTrue = (value) => (value == 'true');
const OFFLINE = isTrue(process.env['OFFLINE']);

export async function notFound() {
  const __dirname = process.cwd() + '/server/';
  try {
    const styles = generate404Styles();
    return render(NotFoundPage({ styles }));
  } catch(e) {
    return e;
  }
}

export async function home(adminApp: AdminApp, limit: number) {
  try {
    const styles = generateDefaultStyles();
    const articles = await posts.last(adminApp, 10, OFFLINE);
    const headlinePost = articles.shift(); 
    return render(Main({ styles, articles, headlinePost }));
  } catch (e) {
    return e;
  }
}

export async function singlePost(adminApp: AdminApp, title: string) {
  const content = await utils.readFile(__dirname + '/posts/' + title + '.html');
  const article = await posts.single(adminApp, title, OFFLINE);
  const styles = generateDefaultStyles();
  return render(ArticlePage({ article, content, styles }));
}

export async function single(post: Post) {
  const content = await utils.readFile(__dirname + post.page);
  const article = post;
  const styles = generateDefaultStyles();
  const page = ArticlePage({ article, content, styles });
  console.log(render(page));
  return render(page);
}

export async function tag(adminApp: AdminApp, tag: string) {
  try {
    const styles = generateDefaultStyles();
    const articles = await posts.tag(adminApp, tag, OFFLINE);
    const tagHtml = render(TagPage({ styles, articles, tag }));
    return tagHtml;
  } catch (e) {
    return e;
  }
} 
