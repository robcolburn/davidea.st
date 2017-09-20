import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { Post, AdminApp, DataSnapshot } from '../interfaces';
import * as merge from 'deepmerge';

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

function postToSnap(posts: any, key: string) {
  return {
    val: () => posts,
    key: key,
    forEach: (callback) => {
      Object.keys(posts).forEach(key => {
        const post = { key, ...posts[key] };
        callback(postToSnap(post, key));
      });
    }
  } as DataSnapshot;
}

/**
 * Get all tag keys used to classify posts
 * @param app 
 */
export function tagKeys(app: AdminApp, offline = false): Promise<string[]> {
  if(offline) {
    return new Promise((resolve, reject) => {
      const { tagKey } = require(__dirname + '/posts.json');
      const values = Object.keys(tagKey).map(key => tagKey[key]);
      resolve(values);
    });
  }  
  const ref = app.database().ref('tagKey');
  return ref.once('value').then(snap => snapshotToArray<string>(snap));
}

/**
 * Retrieve all posts from the Firebase Database
 * @param app 
 */
export function all(app: AdminApp, offline = false): Promise<Post[]> {
  if(offline) {
    return new Promise((resolve, reject) => {
      const { posts } = require(__dirname + '/posts.json');
      const snap = postToSnap(posts, 'posts');      
      resolve(snapshotToArray<Post>(snap));
    });
  }  
  const ref = app.database().ref('posts');
  return ref.once('value').then(snap => snapshotToArray<Post>(snap));
}

/**
 * Create a once query for the most recent posts given a limited number.
 * @param app 
 * @param limit 
 */
export function last(app: AdminApp, limit: number, offline = false): Promise<Post[]> {
  if(offline) {
    return new Promise((resolve, reject) => {
      const { posts } = require(__dirname + '/posts.json');
      const snap = postToSnap(posts, 'posts');  
      const arr = snapshotToArray<Post>(snap);
      const rev = arr.reverse();    
      resolve(rev);
    });
  }    
  const query = app.database().ref('posts').orderByChild('timestamp').limitToLast(limit);
  return query.once('value').then(snap => snapshotToArray<Post>(snap));
}

/**
 * Find a single post by it's url path
 * @param app 
 * @param path 
 */
export function single(app: AdminApp, path: string, offline = false): Promise<Post> {
  if(offline) {
    return new Promise((resolve, reject) => {
      const { posts } = require(__dirname + '/posts.json');
      const single = posts[path];
      resolve(single);
    });
  }
  return app.database().ref('posts').child(path).once('value').then(snap => snap.val());
}

/**
 * Create a post in the Firebase Database. Uses multi-path updates to keep
 * data consistent in each record.
 * @param app 
 * @param post 
 */
export function create(app: AdminApp, post: Post, offline = false): Promise<Post> {
  const timestamp = admin.database.ServerValue.TIMESTAMP;
  const postWithId = { ...post, timestamp };
  const { tags, pagePath } = post;
  let tagsUpdate = {};
  Object.keys(tags).forEach(tag => { 
    tagsUpdate = {
      ...tagsUpdate,
      [`tags/${tag}/${pagePath}`]: post,
      [`tagKey/${tag}`]: tag
    };
  });
  if (offline) {
    return new Promise((resolve, reject) => {
      const data = require(__dirname + '/posts.json');
      const newData = merge.all([data, tagsUpdate]);
      fs.writeFileSync(__dirname + '/posts.json', JSON.stringify(newData));
      resolve(single(app, pagePath, offline));
    });
  }
  return app.database().ref().update(tagsUpdate).then(_ => single(app, post.pagePath));
}

/**
 * Get all the posts for a tag
 * @param app 
 * @param tag 
 */
export async function tag(app: AdminApp, tag: string, offline = false) {
  if(offline) {
    return new Promise((resolve, reject) => {
      const { posts } = require(__dirname + '/posts.json');
      const snap = postToSnap(posts, 'posts');      
      resolve(snapshotToArray<Post>(snap));
    });
  }
  const query = admin.database().ref('tags').child(tag);
  return await query.once('value').then(snap => snapshotToArray<Post>(snap));
}
