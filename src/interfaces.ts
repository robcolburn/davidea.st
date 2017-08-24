import * as admin from 'firebase-admin';

export type AdminApp = admin.app.App;
export type DataSnapshot = admin.database.DataSnapshot;

export interface Post {
  key?: string;
  author: string;
  date: string;
  minRead: string;
  page: string;
  tags: { [key: string]: string };
  title: string;
  whyRead: string;
  pagePath: string;
  timestamp?: number;
}

export interface TypedSnapshot<T> extends DataSnapshot {
  val: () => T;
}
