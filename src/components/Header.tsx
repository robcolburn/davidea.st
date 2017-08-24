import { h } from 'preact';

const Header = (props) => (
  <header class="de-header de-padding">

    <div class="de-grid">

      <figure class="de-image-figure">

        <a class="de-imageover" rel="noopener" target="_blank" href="https://twitter.com/_davideast">
          <img class="de-author-image de-clickcircle" src="/assets/de-sm.jpg" alt="David East - Author" />
          <div class="de-imageover-color"></div>
          <img class="de-imageover-image de-clickcircle" src="/assets/twitter-logo.png" />
        </a>

        <figcaption>
          <div class="fig-author-figure-title-header">
            <a href="/">davidea.st</a>
          </div>
          <div class="fig-author-figure-title">Web development and Firebase articles</div>
        </figcaption>
      </figure>

    </div>

  </header>
);

export default Header;
