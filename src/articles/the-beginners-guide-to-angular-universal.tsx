import { h } from 'preact';
import ArticleTitle from '../components/ArticleTitle';

const Article = (props) => {
  const article = props.article;
  return (
    <div class="de-grid de-row-double de-padding">

      <article class="de-post">

        <section class="de-article-content">
          <ArticleTitle article={article} />
        </section>

        <div>
          I'm a new article
        </div>

      </article>

    </div>
  );
};

export default Article;
