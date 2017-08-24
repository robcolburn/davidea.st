import { h } from 'preact';
import Pillbox from './Pillbox';

const ArticleTitle = (props) => {
  const article = props.article;
  return (
    <div class="de-article-content-title">
      <h1>{article.title}</h1>
      <div class="de-article-content-meta">
        <span>{article.date} &#8212; {article.minRead}m read</span>
        <Pillbox article={article} displayDate={false} />
      </div>
    </div>
  );
}

export default ArticleTitle;
