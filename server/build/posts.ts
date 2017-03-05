import * as admin from 'firebase-admin';
import { Post } from '../interfaces';
export type DataSnapshot = admin.database.DataSnapshot;
export type AdminApp = admin.app.App;

export interface TypedSnapshot<T> extends DataSnapshot {
  val: () => T;
}

export function getPosts(app: AdminApp, limit: number): admin.Promise<Post[]> {
  return app.database().ref('posts').limitToLast(limit).once('value').then(snap => {
    let posts = [];
    snap.forEach(childSnap => { posts = [...posts, childSnap.val()] });
    return posts;
  });
}

export function getSinglePost(app: AdminApp, path: string): admin.Promise<Post> {
  return app.database().ref('posts').child(path).once('value').then(snap => snap.val());
}

export function createPost(app: AdminApp, post: any): admin.Promise<TypedSnapshot<Post>> {
  const pushRef = app.database().ref('roll').push();
  const id = pushRef.key;
  const postWithId = Object.assign({}, post, { id });
  const updateObject = {
    [`posts/${post.pagePath}`]: postWithId,
    [`roll/${id}`]: postWithId
  };
  return app.database().ref().update(updateObject);
}