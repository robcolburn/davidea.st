import { h } from 'preact';
import Pillbox from './Pillbox';

const Article = (props) => {
  const article = props.article;
  return (
    <div class="de-article de-row-double">

      <Pillbox article={article} displayDate={true} />

      <h2 class="de-article-title">
        <a href={"/articles/" + article.pagePath}>{article.title}</a>
      </h2>

      <p class="de-article-whyread-content">
        {article.whyRead}
      </p>

      <a class="de-article-readmore" href={"/articles/" + article.pagePath}>Read More.</a>
      <div class="de-article-divider"></div>

    </div>
  );
}

export default Article;
