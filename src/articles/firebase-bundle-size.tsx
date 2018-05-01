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
          src="/assets/articles/firebase-bundle-size/trace-noworker-nossr.jpg" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <h3>~1800ms</h3>
            <p>
              The HTML loads, but it's useless. It's just an empty document waiting for Preact to render the content. 
            </p>

            <h3>~3800ms</h3>
            <p>
              Fast forward 1.8 more seconds and the bundle has downloaded, parsed, and executed. When gzipped the bundle size drops to 85.6kb (The browser parses all 311kb however). We're not loaded yet though. At 4 seconds the app is still blank. <em>Why?</em> Because there's no data yet from Firestore. Our trip down the waterfall continues.
            </p>

            <h3>~7100ms</h3>
            <p>
              At 4 seconds the app makes a request to Firestore's servers for data. It's not until 2.6 seconds later that sends data to render the page. That brings us to a full 7.1 seconds just to see how many people are eating at Bamboo Sushi. If I'm downtown, I would have left the page and just walked there myself.
            </p>

            <h3>Waiting on a 311 kilobyte bundle</h3>
            <p>
              I wanted provide users with a realtime experience. I wanted the app work when offline. But all I gave them was a performance mess.
            </p>

            <p>
              <strong>The problem is how I'm loading the app.</strong> The user has to wait for the JavaScript bundle <strong>311kbs</strong> (86.5 kbs gzipped) <em>and</em> the subsequent network requests for the app to load. 
            </p>

            <p>
              At 1.8 seconds I could have had content, instead I had to wait 5.3 more seconds to get data back from Firestore. This sounds like a job for Server Side Rendering.
            </p>

            <h2 class="de-part-h2-inside">Server Side Rendering, not to the rescue</h2>

            <p>
              I need the content immediately if I want to get the page loaded quickly. Adding in Server Side Rendering will solve my problems, right? Not so much.
            </p>

            

          </section>
        </article>
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

      {/* <div class="de-grid de-padding">
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
      </div> */}

    </div>
  );
};

export default Article;
