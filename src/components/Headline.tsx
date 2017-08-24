import { h } from 'preact';
import Pillbox from './Pillbox';

const Headline = (props) => {
  return (
    <div class="de-headline">
      <Pillbox post={props.post} />

      <h2 class="de-headline-title">
        <a href={"/posts/" + props.post.pagePath}>{props.post.title}</a>
      </h2>

      <p class="de-headline-whyread-content">
        {props.post.whyRead}
      </p>
      <a class="de-headline-readmore" href={"/posts/" + props.post.pagePath}>Read More.</a>
    </div>
  );
}

export default Headline;
