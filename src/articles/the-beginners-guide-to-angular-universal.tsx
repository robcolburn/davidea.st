import { h } from 'preact';
import ArticleTitle from '../components/ArticleTitle';

const Article = (props) => {
  const article = props.article;
  const versions = {
    CLI: '1.4.2',
    ANGULAR: '4.4.3'
  };
  return (
    <div class="de-grid de-row-double de-padding">

      <article class="de-post">

        <section class="de-article-content">
          <ArticleTitle article={article} />
        </section>

        <section class="de-article-content de-article-content-top">

          <div class="de-thx">
            <em>
              This article is based off {versions.ANGULAR} of Angular Universal, {versions.ANGULAR} Angular, and {versions.CLI} of the Angular CLI.
            </em>
          </div>
          
          <p class="de-tagline">
            Angular Universal can help you improve SEO, perceived performance, and even in <a href="https://davidea.st/articles/measuring-server-side-rendering-performance-is-tricky">some cases page load performance itself</a>.
          </p>

          <p>
            Getting started isn’t difficult. It’s powerful but it’s not magic.  There’s some tedious configuration in the beginning, but then it’s smooth sailing. The goal of this guide is not only to get you started but to give you a deeper understand of how Angular Universal works. This guide takes you from zero to production with these steps:
          </p>

          <ul class="de-list">
            <li>Create an minimal Angular build with the CLI.</li>
            <li>Configure the CLI to create a Universal Bundle.</li>
            <li>Set up a server to generate Angular Universal content.</li>
            <li>Configure the server to serve content over a CDN.</li>
            <li>Deploy to production.</li>
            <li>Read the source code to learn more than just configuration.</li>
          </ul>   

          <p>
            Open up a terminal. Let’s begin.
          </p>

          <h3>Angular Universal is two parts</h3>
          <p>
            Angular Universal isn't a command-line tool. It's more than running a command to generate a server-side rendered site. Angular Universal changes how you build, deliver, and load your site. To take advantage of Angular Universal you need to understand the big picture. Angular Universal is two parts: a <strong>universal bundle</strong> and a <strong>server</strong>.
          </p>

          <h3>Universal Bundle</h3>
          <p>
            Your Angular code won't run on a server out-of-the-box. The module format is incorrect and your code may be coupled to the browser. To get your code running on a server you need to create a <strong>universal bundle</strong>. 
          </p> 

          <p>
            A universal bundle is a version of your app converted to run in a commonjs evironment like nodejs. The <code>import</code> statements turn into <code>require()</code> and any browser specific code will break your server-side rendering.
          </p>

          <ul class="de-list de-list-no-type de-smaller-text">       
            <li>The browser's DOM is not available on the server. Angular uses a browser independent implementation of the DOM: <a href="https://github.com/fgnass/domino">domino</a>. This indepent solution gives you basic DOM support, but it can't do everything the browser does. You'll have to cut any code that directly manipulates the DOM or uses browser API's unsupported by domino. I'll cover this in a later blog post.</li>
          </ul>

          <p>
            The good news is the Angular CLI makes this easy. The bad? This is where the tedious config starts. 
          </p>

          <h3>Install the Angular CLI</h3>
          <p>
            Avoid version pain. Make sure you at least have version <code>1.3.0</code> of the CLI installed. This article uses version <code>{versions.CLI}</code> which includes the <code>--build-optimizer</code> flag. This feature helps reduce bundle size.
          </p>

          <pre><code class="language-bash">npm i -g @angular/cli
          </code></pre>

          <h3>Set up a minimal project</h3>
          <p>
            Use the CLI to create a new project. The CLI provides a command that creates an Angular project with a minimal setup.
          </p>

          <pre><code class="language-bash">ng new ssr-project --minimal
          </code></pre>

          <h3>Install platform server</h3>
          <p>
            Angular Universal works through the <code>@angular/platform-server</code> module. It doesn't come with the Angular CLI setup. You need to install it separately. 
          </p>

          <pre><code class="language-bash">npm i @angular/platform-server --save
          </code></pre>

          <p>
          <strong>Make sure you've installed the same version as the other Angular modules.</strong> The CLI may install an older version of Angular such as <code>2.4.2</code> and the <code>@angular/platform-server</code> install may install a newer version. A mismatch of Angular module versions is going to cause you a bad time later on. Go to the <code>package.json</code> and make sure every <code>@angular</code> module is on the same version. This article uses Angular <code>{versions.ANGULAR}</code>.
          </p>

          <h3>Make the browser module aware of a server transition</h3>
          <p>

          </p>


        </section>

      </article>

    </div>
  );
};

export default Article;
