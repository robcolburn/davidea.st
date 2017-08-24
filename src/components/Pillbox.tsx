import { h } from 'preact';

const Pillbox = (props) => {
  const article = props.article;
  const displayDate = props.displayDate || true;
  const date = (shouldDisplay: boolean) => {
    if(shouldDisplay) {
      return <span class="de-headline-date"> &#8212; {props.article.date}</span>
    }
    return <span></span>;
  } 
  const pills = Object.keys(props.article.tags).map(tag => {
    return (
      <div class={"de-pill de-pill-" + tag}>
        <a href={"/tags/" + tag}>{props.article.tags[tag]}</a>
      </div>
    );
  });
  return (
    <div class="de-pill-box">
      {pills}
      {date(props.displayDate)}
    </div>
  );
};

export default Pillbox;
