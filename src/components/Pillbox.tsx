import { h } from 'preact';

const Pillbox = (props) => {
  const pills = Object.keys(props.post.tags).map(tag => {
    return (<div class={"de-pill de-pill-" + tag}>
      <a href={"/tags/" + tag}>{props.post.tags[tag]}</a>
    </div>)
  });
  return (
    <div class="de-pill-box">
      {pills}
      <span class="de-headline-date"> &#8212; {props.post.date}</span>
    </div>
  );
};

export default Pillbox;
