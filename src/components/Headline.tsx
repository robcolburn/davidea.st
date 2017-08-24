import { h } from 'preact';
import Pillbox from './Pillbox';

const Headline = (props) => {
  const article = props.article;
  return (
    <div class="de-headline">
      <Pillbox article={article} displayDate={true} />

      <h2 class="de-headline-title">
        <a href={"/articles/" + article.pagePath}>{article.title}</a>
      </h2>

      <p class="de-headline-whyread-content">
        {article.whyRead}
      </p>
      <a class="de-headline-readmore" href={"/articles/" + article.pagePath}>Read More.</a>
    </div>
  );
}

export default Headline;
