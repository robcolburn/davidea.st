import { h } from 'preact';

const HeaderPost = (props) => {
  return (
    <header class="de-header de-padding">

      <div class="de-grid">

        <figure class="de-image-figure">

          <a class="de-imageover" rel="noopener" target="_blank" href="https://twitter.com/_davideast">
            <img class="de-author-image de-clickcircle" src="/assets/de-sm.jpg" alt="David East - Author" />
            <div class="de-imageover-color"></div>
            <img class="de-imageover-image de-clickcircle" src="/assets/twitter-logo.png" />
          </a>

          <figcaption>
            <div class="fig-author-figure-title">davidea.st</div>
            <div class="fig-author-figure-title">Developer Advocate at Google on Firebase.</div>
            <div class="fig-author-figure-title">{props.date} &#8212; {props.minRead}m read</div>
          </figcaption>
        </figure>

      </div>

    </header>
  );
}

export default HeaderPost;
