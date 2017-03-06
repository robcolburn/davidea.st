import * as admin from 'firebase-admin';
import { Post } from '../interfaces';
export type DataSnapshot = admin.database.DataSnapshot;
export type AdminApp = admin.app.App;

export interface TypedSnapshot<T> extends DataSnapshot {
  val: () => T;
}

export function last(app: AdminApp, limit: number): admin.Promise<Post[]> {
  return app.database().ref('posts').orderByChild('timestamp').limitToLast(limit).once('value').then(snap => {
    let posts = [];
    snap.forEach(childSnap => { posts = [...posts, childSnap.val()] });
    return posts;
  });
}

export function single(app: AdminApp, path: string): admin.Promise<Post> {
  return app.database().ref('posts').child(path).once('value').then(snap => snap.val());
}

export function create(app: AdminApp, post: Post): admin.Promise<Post> {
  const timestamp = admin.database.ServerValue.TIMESTAMP;
  const postWithId = { ...post, timestamp };
  const { tags, pagePath } = post;
  let tagsUpdate = {};
  Object.keys(tags).forEach(tag => { 
    tagsUpdate = {
      ...tagsUpdate,
      [`tags/${tag}/${pagePath}`]: post
    };
  });
  const updateObject = {
    ...tagsUpdate,
    [`posts/${pagePath}`]: postWithId
  };
  return app.database().ref().update(updateObject).then(_ => single(app, post.pagePath));
}
