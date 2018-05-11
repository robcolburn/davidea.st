import { h } from 'preact';
import ArticleTitle from '../components/ArticleTitle';
import CodeBox from '../components/CodeBox';

const SAMPLE_WEBPACK_PREACT = `Version: webpack 4.6.0
Time: 2946ms
Built at: 2018-05-07 07:06:37
    Asset       Size  Chunks                    Chunk Names
    bundle.js   12.3 KiB       0  [emitted]         main`;

const SAMPLE_WEBPACK_WARN = `WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets:
  bundle.js (311 KiB)`;

const Article = (props) => {
  const article = props.article;
  return (
    <div>
      <div class="de-grid de-row-double de-padding">

        <article class="de-post">

          <section class="de-article-content">
            <ArticleTitle article={article} />
          </section>

          <section class="de-article-content de-article-content-top">

            <p class="de-tagline">
              Welcome to the article.
            </p>
            <p class="de-tagline">
              I'm glad you made it past the click bait-y title. I have to admit, I lied a little. I did drop 95% of my JavaScript bundle, but it didn't exactly disappear. I also needed more than just one weird trick. Let's start from the top.
            </p>

          </section>
        </article>
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">
            <h2 class="de-part-h2-inside">Firebase 🔥</h2>
            <p>
              I'm a Developer Advocate for Google on the Firebase team. I have been for over 4 years, an eternity in the tech industry. We have this cloud database called Firestore. We host the database and you interface with it using our JavaScript library. It's awesome. Firestore synchronizes data in realtime and works fully offline. <strong>Fully</strong>. <strong>Offline</strong>.
            </p>

            <p>
              These features make Firestore a great tool for building apps on the web. However, there is one problem. <strong>It's not exactly the lightest</strong>.
            </p>
          </section>
        </article>
      </div>      

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">
            <h2 class="de-part-h2-inside">This is Webpack's fault</h2>
            <p>
              This all started when I was building a Firestore app with Webpack. I started off with a basic Preact setup. This lead to a nice a tiny JavaScript bundle.
            </p>
            
            <CodeBox
              code={SAMPLE_WEBPACK_PREACT}
              language="bash" />

            <p>
              Only 12.3kb (4.5kb gzipped!)? Nice. But then I added Firestore.
            </p>

            <p>
              Webpack has this nifty little notification that informs you if any JavaScript asset is over 244kb in size. <em>Why 244kb?</em> If you rely on 244kb+ of JavaScript to load before the page can render, you're going to have a bad time. <strong>And here I sat, looking at the following notification</strong>:
            </p>

            <CodeBox
              code={SAMPLE_WEBPACK_WARN}
              language="bash" />

            <p>
              Adding Firestore increased my bundle size nearly 300kbs. Webpack was right. This did impact web performance. I was about to have a bad time. <strong>Thanks, Webpack</strong>.
            </p>

            <h2 class="de-part-h2-inside">Poor page load performance</h2>

            <p>
              Go a head. Click play. Feel the slowness of my realtime restraunt capacity tracker.
            </p>

            <div class="de-blogimg-frame">
              <iframe 
                src="https://www.webpagetest.org/video/view.php?id=180430_f7f5a335002c0058a7fbbc24c37062ce82a2d167&embed=1&width=408&height=592" width="408" height="592">
              </iframe>
            </div>

            <p>
              <strong>7.1 seconds to load</strong>. Ouch. If this were <a href="https://youtu.be/J3_IT622Sbc">"The Shot"</a>, it would have been game over.
            </p>

            <p>
              <em>Why is it so slow?</em> For starters, this trace was done on a MotoG4 on a "Slow3G" connection using WebpageTest. <em>But the real reason?</em> The app can't render until the JavaScript bundle downloads, parses, and executes. This is disastrous on slow connections. Look at the waterfall chart.
            </p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
          <img 
          alt="Firestore page load performance trace"
          src="/assets/articles/firebase-bundle-size/trace-noworker-nossr.png" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              <strong>The problem is how I'm loading the app.</strong> The user has to wait for the JavaScript bundle <strong>311kbs</strong> (86.5 kbs gzipped) <em>and</em> the subsequent network requests for the app to load.
            </p>

            <p>
              This made me sad. Firestore gave me realtime and offline. Realtime made my app interesting, offline made it useful. <strong>But these features come at a cost</strong>. It takes a lot of bytes of code to implement a persistent connection with a server, state synchronization across devices, persisting state offline, and synchronizing state back the server when online once again.
            </p>

            <section class="de-bigidea">
              How can we build modern applications on the web when modern features are too costly for performance?
            </section>

            <p></p>

            <h2 class="de-part-h2-inside">Progressive bootstrapping</h2>
            
            <p>
              It's not always possible to ship less code. <strong>But we can try to ship less code upfront</strong>.
            </p>
            
            <p>
              At 1.8 seconds I could have rendered content. Instead I had to wait 5.3 more seconds to get data back from Firestore. <strong>What if my app didn't need to wait for Firestore to load?</strong>
            </p>

            <p>
              Let's break the app out into three parts.
            </p>

            {/* <p>
              The main problem is simple. My app isn't complete until Firestore is up and running. This takes too long on slow networks and low powered devices. But you know what takes a lot less time? Loading a static HTML page.
            </p> */}

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
          <img 
          alt="Progressive Bootstrapping visual"
          src="/assets/articles/firebase-bundle-size/progressive-bootstrapping.png" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">


          </section>

        </article>

      </div>


      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">


          </section>

        </article>

      </div>



    </div>
  );
};

export default Article;
