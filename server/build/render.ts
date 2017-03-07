import * as express from 'express';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as admin from 'firebase-admin';

import * as posts from '../build/posts';
import { Post, AdminApp } from '../interfaces';
import { defaultFiles, styles404 } from '../build/cssfiles';
import { embedCss } from '../build/embedcss';
import * as utils from '../build/utils';

export async function notFound() {
  const __dirname = process.cwd() + '/server/';
  try {
    const html404 = await utils.readFile(__dirname + '/templates/_404.ejs');
    const styles = embedCss(styles404(__dirname));
    return ejs.render(html404, { styles, __dirname });
  } catch(e) {
    return e;
  }
}

export async function home(adminApp: AdminApp, limit: number) {
  const __dirname = process.cwd() + '/server/';
  try {
    const indexHtml = await utils.readFile(__dirname + '/templates/_index.ejs');
    const styles = embedCss(defaultFiles(__dirname));
    const articles = await posts.last(adminApp, limit);
    const headlinePost = articles.shift();    
    return ejs.render(indexHtml, { styles, __dirname, headlinePost, articles });
  } catch (e) {
    return e;
  }
}

export async function singlePost(adminApp: AdminApp, title: string) {
  const __dirname = process.cwd() + '/server/';
  const styles = embedCss(defaultFiles(__dirname));
  const post = await posts.single(adminApp, title);
  if (!post) { throw new Error('404'); }
  const postHtml = await utils.readFile(__dirname + '/templates/_post.ejs');
  const html = ejs.render(postHtml, { styles, __dirname, post });
  return html;
}

export async function single(post: Post) {
  const __dirname = process.cwd() + '/server/';
  const styles = embedCss(defaultFiles(__dirname));
  if (!post) { throw new Error('404'); }
  const postHtml = await utils.readFile(__dirname + '/templates/_post.ejs');
  const html = ejs.render(postHtml, { styles, __dirname, post });
  return html;
}

export async function tag(adminApp: AdminApp, tag: string) {
  const __dirname = process.cwd() + '/server/';
  try {
    const styles = embedCss(defaultFiles(__dirname));
    const articles = await posts.tag(adminApp, tag);
    const tagHtml = await utils.readFile(__dirname + '/templates/_tag.ejs');
    const html = ejs.render(tagHtml, { styles, __dirname, articles, tag });
    return html;
  } catch (e) {
    return e;
  }
} 
