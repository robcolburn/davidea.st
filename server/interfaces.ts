
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