import { h } from 'preact';
import Article from './Article';

const ArticleList = (props) => {
  const articles = props.articles.map(article => Article({ article }));
  return (
    <div class="articlelist">
      {articles}
    </div>
  );
};

export default ArticleList;
