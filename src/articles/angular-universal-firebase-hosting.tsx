import { h } from 'preact';
import ArticleTitle from '../components/ArticleTitle';
import CodeBox from '../components/CodeBox';

const Article = (props) => {
  const article = props.article;
  const versions = {
    CLI: '1.4.2',
    ANGULAR: '4.4.3',
    FIREBASE_CLI: '3.12.0',
    FIREBASE_FUNCTIONS: ''
  };
  const SAMPLE_DOWNLOAD_FIREBASE_CLI = `npm i -g firebase-tools
# OR! Install locally and run from node_modules/.bin/firebase (recommended)
npm i firebase-tools --save-dev  
`;
const SAMPLE_DIST_APP_ENTRY = `{
  "root": "src",
  "outDir": "dist",
  "assets": [
    "assets",
    "favicon.ico"
  ],
  "index": "index.html",
  "main": "main.ts",
  "polyfills": "polyfills.ts",
  "test": "test.ts",
  "tsconfig": "tsconfig.app.json",
  "testTsconfig": "tsconfig.spec.json",
  "prefix": "app",
  "styles": [
    "styles.css"
  ],
  "scripts": [],
  "environmentSource": "environments/environment.ts",
  "environments": {
    "dev": "environments/environment.ts",
    "prod": "environments/environment.prod.ts"
  }
}`;
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
                This article is based off {versions.ANGULAR} of Angular Universal, {versions.ANGULAR} Angular, {versions.CLI}  of the Angular CLI, {versions.FIREBASE_CLI} of the Firebase CLI, and {versions.FIREBASE_FUNCTIONS} of the Cloud Functions for Firebase SDK.
              </em>
            </div>

            <p class="de-tagline">
              Server-side rendered sites are a great fit for Firebase Hosting. Firebase Hosting is build for performance. It's HTTP/2 enabled, CDN backed, and has a CLI that makes deployment a breeze. Plus, Firebase Hosting gives you control over the CDN cache, which means you can cache server generated content for as long (or as little) as you like.            
            </p>

            <p>
              This guide will cover the fundamentals of deploying Angular Universal apps to Firebase Hosting. However, it will not cover how to set up a universal app. For getting started with Angular Universal see my article: <a href="/articles/the-beginners-guide-to-angular-universal">The beginners guide to Angular Universal</a>. Then you can get started here.
            </p>

            <p>
              This article will take you through the following steps:
            </p>

            <ul className="de-list">
              <li>Setting up Firebase Hosting for static files</li>
              <li>Setting up Cloud Functions for Firebase for server generated content</li>
              <li>Setting up the CDN cache with the <code>"Cache-Control"</code> header</li>
              <li>Setting up multiple deployment environments</li>
            </ul>

            <p>
              You've already built the universal app, this is the easy part. Open up a terminal. Let's begin.
            </p>

          </section>
        </article>
      </div>

      <h2 class="de-part-h2">Part One: Setting up Firebase Hosting</h2>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              Let's take a look at your project structure. This article assumes you have a traditional(ish) Angular CLI project structure. The key folders are the ones that contain the browser and server bundles. If you followed the previous guide your server code is located in <code>/functions</code> and your browser bundle is located in <code>/functions/dist</code>. You're going to change the brower bundle location.
            </p>

            <p>
              Make sure the browser bundle deploys to the <code>dist</code> directory. It actually doesn't matter what the name is as long as it's not in the <code>functions</code> folder.
            </p>

            <p>
              Modify the browser app entry in <code>.angularcli.json</code>.
            </p>

            <CodeBox
              code={SAMPLE_DIST_APP_ENTRY}
              filePath="/.angularcli.json"
              language="json" />

            <ul class="de-list de-list-no-type de-smaller-text">
              <li>
                The <code>functions</code> folder is deployed to Cloud Functions and the <code>dist</code> directory is deployed to Firebase Hosting. This separation means you'll serve your static <code>dist</code> content over a CDN.
              </li>
            </ul>

            <p>
              Make sure you have a Firebase account and download the Firebase CLI from npm.
            </p>

            <CodeBox
              code={SAMPLE_DOWNLOAD_FIREBASE_CLI}
              language="bash" />

            <p>
              Login to your Firebase account from the CLI.
            </p>

            <CodeBox
              code="firebase login"
              language="bash" />

            <p>
              This will pop up a tab in your browser prompting you to log in. This screen sets the CLI up to have the proper crendentials and permissions to perform operations on your account. After you click accept you'll be good to go in the terminal.
            </p>

            <p>
              At the root of your project run the following command to initialize Firebase Hosting:
            </p>

            <CodeBox 
              code="firebase init hosting"
              language="bash" />

            <p>
              Go though the setup process provided by the CLI: <strong>make sure to select <code>dist</code></strong> as the public directory.
            </p>

            <ul className="de-list">
              <li>Pick your project name</li>
              <li>Select <code>dist</code> as the public directory</li>
              <li>Select No for Single-page app redirect setup</li>
              <li>Do not let the CLI overwrite any files</li>
            </ul>

            <p>
              Firebase Hosting configuration complete! It's time to configure the server code.
            </p>

          </section>
        </article>
      </div>


      <h2 class="de-part-h2">Part Two: Setting up Cloud Functions</h2>

      <div class="de-grid de-padding">
        <article class="de-post">
          <section class="de-article-content">

            <p>
              Now that you're familiar with the Firebase CLI, let's use it again to initialize Cloud Functions for Firebase. Run the following command:
            </p>

            <CodeBox
              code="firebase init functions"
              language="bash" />
            

          </section>
        </article>
      </div>

    </div>
  );
};

export default Article;
