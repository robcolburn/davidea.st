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

const SAMPLE_SIMPLE_WORKER = `const worker = new Worker('worker.js');
worker.addEventListener('message', event => {
  console.log(event.data, 'Message from the worker!');
});
`;

const SAMPLE_WORKER_TIMER = `let count = 0;
// sent a message to the main thread every second!
// Hey, this is kinda like syncing data from Firestore 🤔
setInterval(() => {
  count = count + 1;
  // send message to main thread
  self.postMessage({ event: 'count', count });
}, 1000);
`;

const SAMPLE_FIRESTORE_WORKER = `importScripts('/firebase-bundle.js');

let app = null;
let firebase = firebaseBundle.firebase;

function createCollection(path) {
  return app.firestore().collection(path)
}

// Listen to commands from the main thread and process them here
// in the worker. Magic 💫
self.addEventListener('message', event => {
  switch(event.data.cmd) {
    case 'initializeApp':
      app = firebase.initializeApp(event.data.data);
      const firestore = firebase.firestore();
      const settings = { timestampsInSnapshots: true };
      firestore.settings(settings);
      break;
    case 'firestore.col.add': {
      const { data, path } = event.data.data;
      createCollection(path).add(data);
      break;
    }
    case 'firestore.col.onSnapshot': {
      const path = event.data.data.path;
      createCollection(path).onSnapshot(snap => {
        const docs = snap.docs.map(doc => {
          return {
            id: doc.id,
            data: doc.data(),
            exists: doc.exists,
            metadata: {
              fromCache: doc.metadata.fromCache,
              hasPendingWrites: doc.metadata.hasPendingWrites,
            },
          };
        });
        const size = snap.size;
        const empty = snap.empty;
        self.postMessage({
          name: \`firestore.col.$\{path}.onSnapshot\`,
          response: { 
            data: { docs, size, empty }, 
            type: 'QuerySnapshot',
          }
        });
      });
      break;
    }
  }
}, false);`;

const SAMPLE_FIREWORKER_MAIN = `export class FireWorker {
  worker: Worker;
  listeners: ListenerHash = {};
  constructor() { 
    this.worker = new Worker('./worker.js');
    this.worker.addEventListener('message', event => {
      let data = event.data.response.data;
      if(event.data.response.type === 'QuerySnapshot') {
        data.docs = data.docs.map(d => {
          const _data = d.data;
          d.data = () => _data
          return d;
        });
      }
      this.listeners[event.data.name](data);
    });
  }

  initializeApp(opts: any) {
    this.worker.postMessage({ cmd: 'initializeApp', data: opts });
    return new FireWorkerApp(this);
  }

  postMessage(message: PostMessage) {
    this.worker.postMessage(message);
  }

  registerListener(namespace: string, callback: any) {
    this.listeners[namespace] = callback;
  }
}`;

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

            <div class="de-thx">
              <em>
                I've said this before, but for real, I'm starting a newsletter! One-topic covered in-depth each week, plus a bunch of links on the latest in frontend development topics. <a href="https://frontendweekly.news">Sign up here!</a>
              </em>
            </div>

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
              I'm a Developer Advocate for Google on the <a href="http://firebase.google.com/">Firebase team</a>. I have been for over 4 years, an eternity in the tech industry. We have this cloud database called <a href="https://firebase.google.com/products/firestore/">Firestore</a>. Firebase hosts the database and you interface with it using <a href="https://firebase.google.com/docs/firestore/quickstart#set_up_your_development_environment">our JavaScript library</a>. It's awesome. Firestore synchronizes data in realtime and works fully offline. <strong>Fully</strong>. <strong>Offline</strong>.
            </p>

            <p>
              These features make Firestore a great tool for building apps on the web. However, there is one problem. <strong>It's not exactly the lightest JavaScript library around</strong>.
            </p>
          </section>
        </article>
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">
            <h2 class="de-part-h2-inside">This is Webpack's fault</h2>
            <p>
              This all started when I was building a Firestore app with <a href="https://webpack.js.org/">Webpack</a>. I started off with a basic <a href="https://preactjs.com/">Preact</a> setup. This lead to a nice a tiny JavaScript bundle.
            </p>

            <CodeBox
              code={SAMPLE_WEBPACK_PREACT}
              language="bash" />

            <p>
              Only 12.3kb (4.5kb gzipped!)? Nice. But then I added Firestore.
            </p>

            <p>
              Webpack has this nifty little notification that informs you if any JavaScript asset is over 244kb in size. <em>Why 244kb?</em> If you rely on 244kb+ of JavaScript to load before the page can render, you're going to have a bad time. <strong>And here I sat looking at the following notification</strong>:
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

            <section class="de-idea de-bigidea">
              <p>
                How can we build modern applications on the web when modern features are too costly for performance?
              </p>
            </section>

            <p></p>

            <h2 class="de-part-h2-inside">Progressive bootstrapping</h2>

            <p>
              It's not always possible to ship less code. <strong>But we can try to ship less code upfront</strong>.
            </p>

            <p>
              Break the app out into small layers. Each layer of the app provides use to the user. The app becomes more useful as each feature loads. This is much better then waiting for the entire app load to be of any use to the user. This concept is known as <strong>progressive bootstrapping</strong>.
            </p>

            <p>
              <a href="https://twitter.com/addyosmani">Addy Osmani</a> put it best in his <a href="https://medium.com/dev-channel/the-cost-of-javascript-84009f51e99e">Cost of JavaScript</a> article:
            </p>

            <section class="de-idea de-smallidea">
              <p>
                Progressive Bootstrapping may be a better approach. Send down a minimally functional page (composed of just the HTML/JS/CSS needed for the current route). As more resources arrive, the app can lazy-load and unlock more features.
              </p>
            </section>

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

            <p>
              At 1.8 seconds I could have rendered content. Instead I had to wait 5.3 more seconds to get data back from Firestore. <strong>What if my app didn't need to wait for Firestore to load?</strong> I could load my app in smaller pieces. The features enhance the app when they load. Static content first, JavaScript interactivity next, and lastly load offline and realtime to put the icing on the cake.
            </p>

            {/* <p>
              Following this approach means I can split out nearly all Firestore code and have it load last. It becomes its own layer of the app. It separates itself from having to load with the other layers.
            </p> */}

            <p>
              I'm going to need more than one trick to improve the performance of this app.  <strong>It's time to break things up.</strong>
            </p>

          </section>

        </article>

      </div>


      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <h2 class="de-part-h2-inside">Trick 1: Create a minimally functional page</h2>

            <p>
              <strong>Server side rendering</strong> is available in modern JavaScript frameworks. Preact makes server side rendering easy with <code><a href="https://github.com/developit/preact-render-to-string">preact-render-to-string</a></code>. I use the same components on the client to create a server rendered version of the app.
          </p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
        <img
          alt="Progressive Bootstrapping visual"
          src="/assets/articles/firebase-bundle-size/server-side-rendering.png" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              A server side rendered app needs three things: <strong>HTML rendered from initial data</strong>, <strong>embedded critical CSS</strong>, and <strong>initial data transferred as a JSON object</strong>.
          </p>

            <p>
              The HTML is available for immediate rendering. The browser renders the embedded CSS without loading a stylesheet. The JavaScript framework uses the initial JSON to provide functionality before the network data loads from Firestore.
          </p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
        <img
          alt="Server side rendering code"
          src="/assets/articles/firebase-bundle-size/ssr-code.png" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              Watch the app load with <a href="https://www.webpagetest.org/video/compare.php?tests=180514_N2_3dc2dbd5419d2390daee025b4e6e87a2-r%3A1-c%3A0&thumbSize=200&ival=100&end=full">server side rendering implemented</a>.
            </p>

            <div class="de-blogimg-frame">
              <iframe src="https://www.webpagetest.org/video/view.php?id=180514_60a58fa5b0fd99e3eb03211878c4c77c10ae48d5&embed=1&width=408&height=592" width="408" height="592"></iframe>
            </div>

            <p>
              The content appears to load in just 2.3 seconds! Sadly, there's more to the story.
            </p>

            <p>
              Server side rendering isn't a silver bullet for increasing performance. What server side rendering gives you is a faster first paint of your content. However, the JavaScript framework is not yet ready. <strong>The app still isn't usable until the JavaScript is downloaded, executed, and parsed</strong>. It just appears to be.
            </p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
        <img
          alt="Server side app trace"
          src="/assets/articles/firebase-bundle-size/trace-noworker-ssr.png" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              The app has content at 2.3 seconds, <em>which is great!</em> But look at those red blocks at the bottom. Those are times where the main thread becomes too busy to process any user input. The result is a frozen user interface. The app isn't fully interactive until around 9.2 seconds. This isn't better than before and on lower powered devices this version might be worse.
          </p>

            <p>
              There's still room for improvement even if you're okay with the frozen thread. It took 4.5 seconds for the browser to download, parse, and execute the JavaScript bundle. This is where I need to add another layer. <strong>This is where I can drop my Firestore out of my JavaScript bundle</strong>.
          </p>

          </section>
        </article>
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <h2 class="de-part-h2-inside">Trick 2: Firestore in a Web Worker</h2>

            <p>
              This is the moment you've been waiting for. <em>How did I drop 95% of JavaScript bundle?</em> Well... I put it in another bundle. Preact, Firestore, and my own app code add up to 86.5kbs of gzipped JavaScript. Firestore is the bulk of that weight.
            </p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
        <img
          alt="Firestore is 95% of the JavaScript bundle size. Preact is only 5%."
          src="/assets/articles/firebase-bundle-size/bundle-size-large.png" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              Removing Firestore drops the gzipped bundle to 4.5kbs. That's a 95% reduction in bundle size! <em>How can I remove Firestore without removing the features?</em> <strong>Web Workers</strong>.
            </p>

            <h3>Web Workers</h3>

            <p>
              Web Workers are scripts that run in background threads. They are useful beacuse they give you another thread to perform operations in. When your code is clogs the main thread, it might help to move that code to a worker. This can help free up the main thread and keep the app interactive.
            </p>

            <CodeBox
              code={SAMPLE_SIMPLE_WORKER}
              filePath="index.ts"
              language="ts" />

            <p></p>

            <CodeBox
              code={SAMPLE_WORKER_TIMER}
              filePath="worker.js"
              language="ts" />

            <p>
              In the example above the main thread recieves a message every second from the worker. This is exactly the type of synchronization I need from Firestore.
            </p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
        <img
          alt=""
          src="/assets/articles/firebase-bundle-size/web-workers.png" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              There are two main benefits to using Web Workers with Firestore.
            </p>

            <p>
              The first is the <strong>processing work in another thread</strong>. The server side rendered app freezes at 9.1 seconds when Firestore data loads and Preact has to render new changes. We can free up the thread by off-loading Firestore processing to a worker.
            </p>

            <p>
              The second is the <strong>async loading of Firestore</strong>. The worker script isn't a part of the bundle because it loads asynchronously. The worker object on the main thread acts as a proxy to the worker thread. I can start to post messages to the worker thread to act on before it loads.
            </p>

            <p>
              A large drawback is managing workers. Web Workers are highly unstructured and always async. It is really difficult to manage work through one <code>postMessage</code> method and listener.
            </p>

            <CodeBox
              code={SAMPLE_FIRESTORE_WORKER}
              filePath="worker.js"
              language="ts" />

            <p>
              The worker above loads Firestore with the <code>importScripts()</code> method. It then responds to messages from the main thread and kicks off Firestore work and posts messages back to the main thread. <strong>I attempted to mirror the Firestore API to provide a familar experience</strong>. This technique worked out well since a lot of the Firestore API is asynchronous. However, data over <code>postMessage()</code> must be serializable. This means no functions. This means I had to do some ugly coercing on the main thread.
            </p>

            <CodeBox
              code={SAMPLE_FIREWORKER_MAIN}
              filePath="index.ts"
              language="ts" />

            <p>
              This was some ugly work, but it allowed me to use my existing Firestore API. This was just a snippet too. You can see the <a href="https://github.com/davideast/table-tracer/blob/master/src/client/worker/index.tsx">full source here</a>. 
            </p>

            <section class="de-idea de-bigidea">
              <p>
                There's one lesson for writing Web Worker code. Stand <a href="https://twitter.com/dassurma">on the shoulders</a> of those <a href="https://twitter.com/_developit">who came before you</a>. Libraries like <code><a href="https://github.com/GoogleChromeLabs/comlink">Comlink</a></code> and <code><a href="https://github.com/developit/workerize">wokerize</a></code> simplify your worker code.
              </p>
            </section>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
        <img
          alt="Firestore is now it's own worker bundle and Preact is only responsible for the view."
          src="/assets/articles/firebase-bundle-size/bundle-size-split.png" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              Now my app is split into separate layers for view code and data code. The main thread is responsible for processing only 5% of my total JavaScript bundle. The worker code processes the other 95% percent. The app will boot up quickly and become functional with the server transferred JSON. <strong>The realtime and offline features gracefully load when Firestore finally loads in the worker</strong>. The app can get to interactive a lot faster with this smaller bundle.
          </p>

            <p>
              <strong>Take a look at the page load with Firestore in a Web Worker</strong>.
          </p>

            <div class="de-blogimg-frame-full">
              <iframe src="https://www.webpagetest.org/video/view.php?id=180514_60a58fa5b0fd99e3eb03211878c4c77c10ae48d5&embed=1&width=408&height=592" width="408" height="592"></iframe>
            </div>

            <p>
              The app renders content in 2.3 seconds, just like before. There's just one big difference. <a href="https://www.webpagetest.org/video/compare.php?tests=180515_V8_f213a1b976d62d2cab420b0d00051baf-r%3A3-c%3A0&thumbSize=200&ival=100&end=full">The main thread hums along</a>, nice and easy.
          </p>

          </section>
        </article>
      </div>

      <div class="de-blogimg-frame-full">
        <img
          alt="Trace with Workers and SSR. Main thread is frozen briefly at first and then is fine."
          src="/assets/articles/firebase-bundle-size/trace-worker-ssr.png" />
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              The main thread is frozen while the JavaScript bundle parses and executes, but this is only for <code>300ms</code> up front. Afterwards it's smooth sailing.
            </p>

            <p>
              <strong>While this progressively bootstrapped app loads content faster and gets to interactive faster, there are still some draw backs</strong>.
            </p>

            <p>
              The original version of the app took 7.1 seconds to load to a useful state. The progressively loaded version provides the user with state content and interactivity in 2.5 seconds. However, the realtime and offline won't load in the progressive version until around 9 seconds. That's 2 seconds slower than the original version. The compromise is delaying advanced features and prioritizing core content.
          </p>

            <p>
              I could have tried using HTTP/2 push or <code>link[rel="preload"]</code> tags for the Web Worker and Firestore code. This would have helped them load faster and decreased the delay of the realtime and offline features. However, HTTP/2 push is a finnicky beast and that fight is for another blog post.
          </p>

          </section>
        </article>
      </div>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <h2 class="de-part-h2-inside">Think progressively</h2>

            <section class="de-idea de-bigidea">
              <p>
                So yes, I lied. I didn't remove 95% of JavaScript code. But, I did split the code up in a way the browser could digest and quickly delivered a useful app to the user.
            </p>
            </section>

            <p>
              Web development will always be a battle between features and performance. It's up to us to find that compromise.
            </p>

            <div class="de-thx">
              <em>
                Want more content like this? I'm starting a newsletter! <a href="https://frontendweekly.news">Sign up here!</a>
              </em>
            </div>

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
