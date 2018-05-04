import { h } from 'preact';
import ArticleTitle from '../components/ArticleTitle';
import CodeBox from '../components/CodeBox';

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
              This all started when I was building a Firestore app with Webpack. Webpack has this nifty little notification that informs you if any asset is over 244kb in size.
            </p>

            <p>
              <em>Why 244kb?</em> Well that's because that's a lot of JavaScript to put in your critical path. If you rely on 244kb+ of JavaScript to load before the page can render, you're going to have a bad time. <strong>And here I sat, looking at the following notification</strong>:
            </p>

            <CodeBox
              code={SAMPLE_WEBPACK_WARN}
              language="bash" />

            <p>
              Webpack was right indeed. This did impact web performance. <strong>Thanks, Webpack</strong>.
            </p>

            <h2 class="de-part-h2-inside">The problem: Poor page load performance</h2>

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
          src="/assets/articles/firebase-bundle-size/trace-noworker-nossr.jpg" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              <strong>The problem is how I'm loading the app.</strong> The user has to wait for the JavaScript bundle <strong>311kbs</strong> (86.5 kbs gzipped) <em>and</em> the subsequent network requests for the app to load.
            </p>

            <h2 class="de-part-h2-inside">More features, less performance?</h2>

            <p>
              This is the point in the article where you throw your hands up and say <em>"This is why we can't have nice things on the web!"</em> 
            </p>
            
            <p>
              Sometimes it feels like you can't build anything significant on the web without sacrificing page load. Features <code>===</code> code. The more code you ship the slower the page load, right? Not exactly.
            </p>

            <p>
              It's not about shipping less code. <strong>It's about shipping less code upfront</strong>.
            </p>
            
            <h2 class="de-part-h2-inside">Progressive loading</h2>

            <p>
              The main problem is simple. My app isn't complete until Firestore is up and running. This takes too long on slow networks and low powered devices. But you know what takes a lot less time? Loading a static HTML page.
            </p>

            <p>
              At 1.8 seconds I could have rendered content. Instead I had to wait 5.3 more seconds to get data back from Firestore. <strong>What if my app didn't need to wait for Firestore to load?</strong> What if I server side render the content and then have Preact and Firestore take over when they load?
            </p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
          <img 
          alt="Firestore page load performance trace"
          src="/assets/articles/firebase-bundle-size/progressive-loading.png" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            {/* <p>
              Now, you might be asking <em>"Why is the Firestore SDK is 304kb?! Is all that JavaScript is going to clog my critical path?"</em> There's got to be another way. I don't want to have a bad time.
            </p>

            <h3>Why Firestore is so large</h3>

            <p>
              Firestore is large because it's a database... in your browser. It manages a realtime connection to a server. It persists data in IndexedDB. It synchronizes remotely changed data. It does a lot.
            </p>

            <p>
              Now, could it stand to lose a little bit a weight? Of course. But at the end of the day, it's a complex library. It's not going to shed KBs to the point of Preact levels.
            </p>

            <h3>Why can't we have nice things on the web?</h3>

            <p>

            </p> */}

          </section>

        </article>

      </div>



    </div>
  );
};

export default Article;
