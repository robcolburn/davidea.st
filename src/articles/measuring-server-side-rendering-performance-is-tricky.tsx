import { h } from 'preact';
import ArticleTitle from '../components/ArticleTitle';

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
              Most things in web development are difficult.
            </p>
          
            <p>
              I started this post two weeks ago as a simple "How to use SSR to boost performance" article. After hours of profiling and
              consulting people smarter than me, I know one thing. <strong>Server-side Rendering is more nuanced than you would like.</strong>
            </p>
          
            <p>
              You've probably been told that server-side rendering your JavaScript framework site will boost performance. But is that the truth? This article is going to test this assumption. <strong>Spoiler alert:</strong> the answer is maybe.
            </p>
          
            <p>
              This is not a "beware SSR" article. SSR can still help with performance in certain scenarios. You just need to remember why
              you want to use SSR in the first place.
            </p>
          
            <h3>JavaScript handcuffs the content of a single-page app</h3>
          
            <p>
              The default setup for a single-page app is an "app" element with some scripts. The "app" element inflates into meaningful
              content once the scripts run.
            </p>
          
            <pre><code class="language-html">&lt;html&gt;
          &lt;head&gt;
            &lt;title&gt;My non ssr app&lt;/title&gt;
          &lt;/head&gt;
          &lt;body&gt;
            &lt;my-app&gt;&lt;/my-app&gt;
            &lt;!-- "my-app" is a white page until these big scripts load --&gt;
            &lt;script src="big-script.876aa678as463sf7.js"&gt;&lt;/script&gt;
            &lt;script src="other-big-script.876aa678as463sf7.js"&gt;&lt;/script&gt;
          &lt;/body&gt;
          &lt;/html&gt;
          </code></pre>
          
            <p>
              This is not an optimal loading pattern. The browser is able to render a page with just HTML and CSS. We could have content
              on the screen before the browser ever touches a script.
            </p>
          
            <h3>The point of SSR is a faster render of meaningful content</h3>
          
            <p>
              The goal of SSR: offset the cost of tying up meaningful content in JavaScript. If JavaScript ties up the content, you can
              expect to stare at a white screen longer than desired. What if you could have your cake and eat it too?
            </p>
          
            <p>
              What if you sent down a static HTML version of the app while JavaScript loads? Once the JavaScript is ready, it can take
              over the page and everyone is happy. Problem solved, right?
            </p>
          
            <h3>Compare SSR vs. Non-SSR versions</h3>
          
            <p>
              I built <a href="https://shoeniversal.firebaseapp.com">a fake shoe site called "Shoeniversal".</a> You either love or
              hate the name. I built it with <a href="https://github.com/angular/universal">Angular Universal</a>, but the concepts apply to other frameworks that support SSR. <a href="https://github.com/davideast/shoeniversal">You can view the source on Github</a>.
            </p>
          
          </section>

        </article>

      </div>

      <div class="de-blogimg-frame-full">
        <img alt="Shoenivesal website image"src="/assets/articles/measuring-server-side-rendering-performance-is-tricky/shoeniversal.jpg" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content de-article-content-top">
            <p>
              I published two versions of the site to <a href="https://firebase.google.com/docs/hosting/">Firebase Hosting</a>. One version is <a href="https://shoeniversal.firebaseapp.com">server-side rendered</a> and <a href="https://non-ssr-shoeniversal.firebaseapp.com">the other is not</a>. 
            </p>
            <p>
              The Non-SSR site is static. The SSR site is static with a dynamic twist. <a href="https://firebase.google.com/docs/hosting/functions">Cloud Functions</a> generates the SSR site and then
              sends it to a CDN edge. The edge caches the server rendered content as if it were a static site. This way you can expect
              a similar delivery for each site.
            </p>

            <p>
              To get a fair test I used <a href="https://www.webpagetest.org/">Webpagetest</a>. WPT is great because it allows you to test on real mobile devices, on slow networks,
              in different parts of the world... <strong>for free</strong>.
            </p>

            <h3>Disclaimer</h3>
            <p>
              I want to point out that this article uses data found only while building this sample. SSR is a fuzzy topic. As a community
              we're still trying to figure out proper guidance on implementation. This article is an attempt to pitch in towards this
              effort. Don't hesitate to <a href="https://twitter.com/_davideast">start a conversation</a> if you find any errors or have any comments.
            </p>

            <h3>Test on real devices on slow networks</h3>

            <p>
              I ran a set of tests on "Emerging Markets" (EM) using a Moto G4. The latency on the EM setting is brutal. Getting to the
              server and back from the phone costs 400ms. This doesn't even include download time of the asset.
            </p>

            <div class="de-blogimg-frame">
                <img class="de-blogimg" src="/assets/articles/measuring-server-side-rendering-performance-is-tricky/wpt-home.jpg" />
            </div>

            <p>
              Given these parameters I figured that the SSR site would win. The initial results proved me wrong.
            </p>

            <h3>The SSR version was slower</h3>
          </section>

        </article>

      </div>

      <div class="de-blogimg-frame-full">
          <img 
          alt="Initial Metrics Comparison"
          src="/assets/articles/measuring-server-side-rendering-performance-is-tricky/initial-metrics.jpg" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              <a href="https://www.webpagetest.org/result/170920_VF_82a7877ce2aa82f433d021b19b106375/#run2">Non-SSR test run</a>. <a href="https://www.webpagetest.org/result/170920_E1_94e8c42994184338d290319a68fc9d00/#run3">SSR test run.</a>
            </p>

            <p>
              Test after test Webpagetest gave me better metrics for the Non-SSR site. The Load Time and Interactive times were better. Something stood out to me. Start Render was and Speed Index were faster on the SSR site. This didn't add up.
            </p>

            <p>
              How is it possible to obtain a faster paint but result in a slower load time? How can performance start to deteriorate when you begin incorporating best practices? If you really want to see what's going on, you'll need to give it the old eye test.
            </p>

            <h3>SSR sites become interactive and then block the main thread again
            </h3>

            <p>Take a look at the Chrome DevTools timeline for the SSR site.
            </p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
        <img
          alt="Server-side Rendered performance profile"
          src="/assets/articles/measuring-server-side-rendering-performance-is-tricky/ssr-performance-profile.jpg" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content de-article-content-top">

            <ul class="de-list">
              <li><strong>~2400ms</strong>: HTML and CSS loads.The meaningful content appears. </li>
              <li><strong>~3800ms</strong>: Angular, its polyfills, and the application code loads. </li>
              <li><strong>~4300ms</strong>: JavaScript execution finishes. The site is interactive. </li>
              <li><strong>~4900ms</strong>: Load Time. The Document Complete event fires. </li>
              <li>
                <a href="https://www.webpagetest.org/chrome/inspector-20170320/inspector.html?experiments=true&loadTimelineFromURL=/getTimeline.php?timeline=t:170920_E1_94e8c42994184338d290319a68fc9d00,r:3,c:0">Timeline</a>
              </li>
            </ul>

            <p>
              <strong>We've played a trick on the browser.</strong> At 2.4 seconds the browser considers the site interactive for just
              a moment. Then comes the JavaScript.
          </p>

            <p>
              At about 3.6 seconds JavaScript execution begins and locks up the main thread until 4.3 seconds. This is a bait-and-switch.
              The browser thinks it's ready to go, but then the JavaScript comes and freezes the site.
            </p>

            <p>
              Webpagetest tells us the load time is 4.9 seconds. However, we're able to see the full app at 2.4 seconds and interact with
              it at 4.3 seconds. The "Load Time" metric is not that important here.
            </p>

            <p>
              The timeline and the initial metrics tell a similar story. <strong>However, that isn't the case for the Non-SSR version.</strong>
            </p>

            <h3>Late HTTP requests are tricky for interactivity metrics</h3>

            <p>The Non-SSR site may have faster "Load Time" and interactive metrics, but that doesn't tell the whole story.</p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
        <img
          alt="Non-server-side rendered performance profile"
          src="/assets/articles/measuring-server-side-rendering-performance-is-tricky/non-ssr-performance-profile.jpg" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content de-article-content-top">

            <ul class="de-list">
              <li><strong>~2400ms</strong>: HTML and CSS loads. No meaningful content.</li>
              <li><strong>~3500ms</strong>: Angular, its polyfills, and the application code loads.</li>
              <li><strong>~3800ms</strong>: JavaScript execution finishes. Site is reported as interactive.</li>
              <li><strong>~4100ms</strong>: Load time. The Document Complete event fires. Framework sends HTTP requests for data.</li>
              <li><strong>~6200ms</strong>: Payload received from API calls. Angular renders the meaningful content.</li>
              <li>
                <a href="https://www.webpagetest.org/chrome/inspector-20170320/inspector.html?experiments=true&loadTimelineFromURL=/getTimeline.php?timeline=t:170920_VF_82a7877ce2aa82f433d021b19b106375,r:2,c:0">Timeline</a>
              </li>
            </ul>

            <p>
              This does not look like a 4.1 second "Load Time". Yes, at four seconds the Document Complete event fired. However, this did not reflect reality. This app has HTTP requests to retrieve the data and those don't finish until 6.2 seconds. And still, the browser needs to download and render the hero image.
            </p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
          <img 
          alt="Non-server-side rendered performance profile"
          src="/assets/articles/measuring-server-side-rendering-performance-is-tricky/combined-strip.jpg" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content de-article-content-top">

            <p>
              This is a tricky situation. The metrics tell you the Non-SSR is faster to interactive. However, you can see that the site is unusable until 6.2 seconds and the SSR version is interactive at 4.3 seconds. 
            </p>

            <p>
              This a soft example. There's at least something to paint in the Non-SSR version. Imagine if the API call blocked the entire render. There's another API call for content below the fold that doesn't finish until 6.6 seconds. If the site is issuing all these API calls, <strong>why didn't they push back interactivity?</strong>
            </p>

            <h3>JavaScript execution under 50ms doesn't affect interactivity</h3>

            <p>
              You might consider this an unfair test. The SSR version doesn't make client-side API calls. However, this is a benefit of
              SSR. API calls are executed server-side and the application state is transferred to the client. The API calls must be made on the Non-SSR site to retrieve the data. This is what tricks our interactivity metrics.
            </p>

            <p>
              Time to Interactive (TTI) tells us how the length of time between navigation and interactivity. The metric is defined by
              looking at a five second window. In this window no JavaScript tasks can take longer than 50ms. If a task over 50ms occurs,
              the search for a five second window starts over.
            </p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
          <img 
          alt="Main Thread Performance Comparison"
          src="/assets/articles/measuring-server-side-rendering-performance-is-tricky/main-thread.jpg" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content de-article-content-top">

            <p>
              After the API calls finished, it took only 26ms to execute the JavaScript that rendered content to the page. This did not
              trigger a push back in interactivity. This puts the user in an uncanny valley. The site is interactive, but it's useless until the data returns.
            </p>

            <ul class="de-list de-list-no-type">
              <li>
                It's also worth pointing out that Angular was able to process this change in 26ms on a low powered device.
              </li>
            </ul>

            <h3>SSR won in this scenario</h3>

            <p>
              In this scenario SSR was beneficial. The cost of waiting for API calls to finish on the client was too high. The Non-SSR
              site became interactive sooner. But, an interactive site without meaningful content isn't really the interactive we're looking for.
            </p>

            <h3>SSR comes at a cost</h3>

            <p>
              On high latency connections round-trip time is an expensive tax on performance. Server-side rendering delivers the content
              in a single piece. This keeps the user from waiting on several HTTP calls to see the completed site.
            </p>

            <p>
              However, it does come at a cost. The user may have a jarring experience on the page. The page will go from interactive to frozen and back to interactive.
            </p>

            <p>
              The SSR site slowed the processing of the images. The SSR site processed the images while the main thread was busy. <strong>This took an extra 2-3 seconds.</strong>  
            </p>
            
          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
          <img 
          alt="Main Thread Performance Comparison"
          src="/assets/articles/measuring-server-side-rendering-performance-is-tricky/slow-image-load.jpg" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content de-article-content-top">
          <p>
            Despite this slow processing, the SSR site's images appeared sooner than the Non-SSR site's images. This is due to the late discovery of the images in the Non-SSR version.
          </p>

          <h3>Takeaway #1: SSR can improve performance when HTTP calls block a meanginful paint</h3>
          <p>
            In this scenario SSR was a benefit because it shorten the chain of requests needed to use the site. The most important being no HTTP calls for data. However, if your site is not dependent on client-side HTTP calls for data, then SSR may not benefit you.
          </p>

          <h3>Takeaway #2: Use the eye test</h3>
          <p>
            Pre-classified metrics are a good signal for measuring performance. At the end of the day though, they may not properly reflect your site's performance story. Profile each possibility and give it the eye test.
          </p>

          <h3>Takeaway #3: Choose static where possible</h3>
          <p>
            The best way to prioritize content by building a static site. Ask yourself if the content needs JavaScript. Shoeniversal is a "read-only" landing page, it should be static. I can still use Angular Universal to server side render this app. Making the site static is easy as dropping the JavaScript tags from the document.
          </p>

          <p>
            Without JavaScript the site loads and is <a href="https://www.webpagetest.org/result/170921_TS_9ce3797ea2cbce216f7ab274f4cb01b9/">interactive in 2 seconds</a>.
          </p>

          <div class="de-blogimg-frame">
              <iframe src="https://www.webpagetest.org/video/view.php?id=170921_TS_9ce3797ea2cbce216f7ab274f4cb01b9.3.0&embed=1&width=408&height=592" width="408" height="592"></iframe>
          </div>

          <h3>SSR is not "one-size-fits-all"</h3>
          <p>
            Server-side rendering is a great technique for prioritizing content. However, it's far from having your cake and eating it too. It's not going to boost everyone's performance. Use your judgement to choose the technique that best fits your situation.
          </p>

          <div class="de-thx">
            <em>
              Want more content like this? I'm starting a newsletter! <a href="https://frontendweekly.news">Sign up here!</a>
            </em>
          </div>

        </section>
      </article>
    </div>
  </div>
  );
};

export default Article;

