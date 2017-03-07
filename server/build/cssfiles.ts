export const defaultFiles = (dirname: string) => [
  '/css/variables.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/clickcircle.css',
  '/css/imagefigure.css',
  '/css/headline.css',
  '/css/pill.css',
  '/css/article.css',
  '/css/post.css',
  '/css/prismbasic.css'
].map(file => dirname + file);

export const styles404 = (dirname: string) => [
  '/css/variables.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/clickcircle.css',
  '/css/imagefigure.css',
  '/css/404.css'  
].map(file => dirname + file);