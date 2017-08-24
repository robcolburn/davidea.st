import { h } from 'preact';
import Pillbox from './Pillbox';

const Article = (props) => (
  <div class="de-article de-row-double">

    <Pillbox post={props.post} />

    <h2 class="de-article-title">
      <a href={"/posts/" + props.post.pagePath}>{props.post.title}</a>
    </h2>

    <p class="de-article-whyread-content">
      {props.post.whyRead}
    </p>
    
    <a class="de-article-readmore" href={"/posts/" + props.post.pagePath}>Read More.</a>
    <div class="de-article-divider"></div>

  </div>
);

export default Article;
