import * as admin from 'firebase-admin';
import { Post, AdminApp, DataSnapshot } from '../interfaces';

/**
 * Create an array from a Firebase Database Snapshot
 * @param snapshot 
 */
function snapshotToArray<T>(snapshot: DataSnapshot): T[] {
  let array = [];
  (<any>snapshot).forEach(snap => { 
    array = [...array, snap.val()];
   });
  return array;
}

/**
 * Retrieve all posts from the Firebase Database
 * @param app 
 */
export function all(app: AdminApp): admin.Promise<Post> {
  const ref = app.database().ref('posts');
  return ref.once('value').then(snap => snapshotToArray<Post>(snap));
}

/**
 * Create a once query for the most recent posts given a limited number.
 * @param app 
 * @param limit 
 */
export function last(app: AdminApp, limit: number): admin.Promise<Post[]> {
  const query = app.database().ref('posts').orderByChild('timestamp').limitToLast(limit);
  return query.once('value').then(snap => snapshotToArray<Post>(snap));
}

/**
 * Find a single post by it's url path
 * @param app 
 * @param path 
 */
export function single(app: AdminApp, path: string): admin.Promise<Post> {
  return app.database().ref('posts').child(path).once('value').then(snap => snap.val());
}

/**
 * Create a post in the Firebase Database. Uses multi-path updates to keep
 * data consistent in each record.
 * @param app 
 * @param post 
 */
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
