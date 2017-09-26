import { h } from 'preact';
import ArticleTitle from '../components/ArticleTitle';
import CodeBox from '../components/CodeBox';

const Article = (props) => {
  const article = props.article;
  const versions = {
    CLI: '1.4.2',
    ANGULAR: '4.4.3'
  };
  const pkg = {
    "name": "ssr-project",
    "version": "0.0.0",
    "license": "MIT",
    "private": true,
    "dependencies": {
      "@angular/animations": "^4.4.3",
      "@angular/common": "^4.4.3",
      "@angular/compiler": "^4.4.3",
      "@angular/core": "^4.4.3",
      "@angular/forms": "^4.4.3",
      "@angular/http": "^4.4.3",
      "@angular/platform-browser": "^4.4.3",
      "@angular/platform-browser-dynamic": "^4.4.3",
      "@angular/platform-server": "^4.4.3",
      "@angular/router": "^4.4.3",
      "core-js": "^2.4.1",
      "rxjs": "^5.4.2",
      "zone.js": "^0.8.14"
    },
    "devDependencies": {
      "@angular/cli": "1.4.3",
      "@angular/compiler-cli": "^4.4.3",
      "@angular/language-service": "^4.4.3",
      "typescript": "~2.3.3"
    }
  };  

  const SAMPLE_WITH_SERVER_TRANSITION = `// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ssr-app' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } `;

  const SAMPLE_REMOVE_SERVER_RENDERED_STYLES = `// angular/packages/platform-browser/src/browser/server-transition.ts
export function appInitializerFactory(transitionId: string, document: any, injector: Injector) {
  return () => {
    // Wait for all application initializers to be completed before removing the styles set by
    // the server.
    injector.get(ApplicationInitStatus).donePromise.then(() => {
      // Get the DOM Adapater
      const dom = getDOM();
      // Find the style[ng-transition] tags
      const styles: any[] =
          Array.prototype.slice.apply(dom.querySelectorAll(document, \`style[ng-transition]\`));
      // Remove any transition tags with the user provided id
      styles.filter(el => dom.getAttribute(el, 'ng-transition') === transitionId)
          .forEach(el => dom.remove(el));
    });
  };
}`;

  const SAMPLE_APP_SERVER_MODULE = ` 
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
  
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule
  ],
  bootstrap: [
    AppComponent
  ]
}) 
export class AppServerModule { }`;

  const SAMPLE_MAIN_SERVER_TS = `export { AppServerModule } from './app/app.server.module';`;

  const TSCONFIG_SERVER = {
    "extends": "../tsconfig.json",
    "compilerOptions": {
      "outDir": "../out-tsc/app",
      "baseUrl": "./",
      "module": "commonjs",
      "types": []
    },
    "exclude": [
      "test.ts",
      "**/*.spec.ts"
    ],
    "angularCompilerOptions": {
      "entryModule": "app/app.server.module#AppServerModule"
    }
  };

  const SAMPLE_SERVER_APP_ENTRY = {
    "platform": "server",
    "root": "src",
    "outDir": "functions",
    "assets": [
      "assets",
      "favicon.ico"
    ],
    "index": "index.html",
    "main": "main.server.ts",
    "test": "test.ts",
    "tsconfig": "tsconfig.server.json",
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
  };

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
              This article is based off {versions.ANGULAR} of Angular Universal, {versions.ANGULAR} Angular, and {versions.CLI} of the Angular CLI.
            </em>
          </div>
          
          <p class="de-tagline">
            Angular Universal can help you improve SEO, perceived performance, and even in <a href="https://davidea.st/articles/measuring-server-side-rendering-performance-is-tricky">some cases page load performance itself</a>.
          </p>

          <p>
            Getting started isn’t difficult. It’s powerful but it’s not magic. The goal of this guide is not only to get you started but to give you a deeper understanding of how Angular Universal works. This guide takes you from zero to production with these steps:
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
          There’s some tedious configuration in the beginning, but then it’s smooth sailing. Open up a terminal. Let’s begin.
          </p>

          <h3>Angular Universal is two parts</h3>
          <p>
            Angular Universal isn't a command-line tool. It's more than running a command to "sprinkle in" server-side rendering. Angular Universal changes how you build, deliver, and load your site. To take advantage of Angular Universal you need to understand the big picture. Angular Universal is two parts: a <strong>universal bundle</strong> and a <strong>server</strong>.
          </p>

          <h3>Universal Bundle</h3>
          <p>
            Your Angular code won't run on a server out-of-the-box. The module format is incorrect and your code may be coupled to the browser. To get your code running on a server you need a <strong>universal bundle</strong>. 
          </p> 

          <p>
            A universal bundle is a build of your site converted for a commonjs environment like nodejs. The <code>import</code> statements turn into <code>require()</code> functions and any browser dependent code will break your server-side rendering.
          </p>

          <ul class="de-list de-list-no-type de-smaller-text">       
            <li>The browser's DOM is not available on the server. Angular uses a browser independent implementation of the DOM: <a href="https://github.com/fgnass/domino">domino</a>. This indepent solution gives you basic DOM support, but it can't do everything the browser does. You'll have to cut any code that directly manipulates the DOM or uses browser API's unsupported by domino. I'll cover this in a later blog post.</li>
          </ul>

          <p>
            The good news is the Angular CLI makes this easy. The bad? This is where the tedious config starts. 
          </p>

          <h3>Install the Angular CLI</h3>
          <p>
            Avoid version pain. Make sure you at least have version <code>1.3.0</code> of the CLI installed. This article uses version <code>{versions.CLI}</code>.
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
          <strong>Make sure you've installed the same version as the other Angular modules.</strong> The CLI may install an older version of Angular such as <code>2.4.2</code> and the <code>@angular/platform-server</code> install may install a newer version. A mismatch of Angular module versions is going to give you a bad time later on. Go to the <code>package.json</code> and make sure every <code>@angular</code> module is on the same version. This article uses Angular <code>{versions.ANGULAR}</code>.
          </p>

          <CodeBox 
            code={pkg} 
            filePath="/package.json" 
            language="json" />

          <h3>Make the browser module aware of a server transition</h3>
          <p>
            Open <code>src/app/app.module.ts</code>. Angular needs to know that this is a server-side rendered app. Use the <code>BrowserModule.withServerTransition()</code> method and provide a unique id. This method acts a generic interface between the client and the server. This allows Angular to do any specific processing to take over a server-side rendered site.
          </p>

          <h3>Create an <code>AppServerModule</code></h3>
          <p>
            The browser needs an <code>AppModule</code> and the server needs one as well. This is a place where you can override or cancel-out any browser specific code for server compatibility.
          </p>

          <p>
            Create the file <code>src/app/app.server.module.ts</code>.
          </p>

          <CodeBox 
            code={SAMPLE_APP_SERVER_MODULE}
            filePath="/src/app/app.server.module.ts" 
            language="ts" />

          <h3>Create an entry point for the server module</h3>
          <p>
            Each top-level Angular module needs an entry point file to start the application. Create a <code>main.server.ts</code> file an export the <code>AppServerModule</code> just like in <code>main.ts</code>.
          </p>

          <CodeBox 
            code={SAMPLE_MAIN_SERVER_TS}
            filePath="src/main.server.ts" 
            language="ts" />

          <h3>Setup the server module's TypeScript configuration</h3>
          <p>
            At the point you've created the <code>ServerModule</code> and it's entry point. However, there's no TypeScript configuration to build it to JavaScript. You might be thinking, <em>"Oh, I'll just add it to the <code>"files"</code> array in the <code>tsconfig.app.json</code>."</em>

            There's a big problem with that. The current configuration is uses the <code>es2015</code> module setting and you need <code>commonjs</code>. The Angular compiler also needs to customize the configuration to know what the entry module is for Angular Universal. The easiest way to fix this by creating a specific server configuration: <code>src/tsconfig.server.json</code>.
          </p>

          <CodeBox 
            code={TSCONFIG_SERVER} 
            filePath="/src/tsconfig.server.json" 
            language="json" />

          <h3>Tell the CLI how to build the universal bundle</h3>
          <p>
            The CLI is a big abstraction on Webpack. It knows how to build Angular, so it sets up the configuration and you command it. You may need to customize your configuration in certain cases. Creating a universal bundle is one of those cases.
          </p>

          <p>
            Open the <code>.angular-cli.json</code> file. This file contains the default configuration options. The <code>"apps"</code> section is the one you care about. To create a universal bundle you need to create a separate "app" entry. Add the follow entry to the <code>"apps"</code> array.
          </p>

          <CodeBox 
            code={SAMPLE_SERVER_APP_ENTRY} 
            filePath="/.angular-cli.json" 
            language="json" />

          <p>
            This configuration is the bow on all the hard work you've done so far. It tells the CLI that this "app" runs on a server <code>"platform"</code>, has an entry file of <code>main.server.ts</code> and is built with the <code>tsconfig.server.json</code> configuration file.
          </p>

          <h3>Now build it</h3>
          <p>
            Use the CLI to specify that you want to build the server app entry.
          </p>

          <pre><code class="language-bash">ng build --app 1 --prod --output-hashing none</code></pre>

          <p>
            Success! You have a server bundle. On top of that by specifying the <code>--prod</code> flag you minified and enabled AoT on your code. With the <code>--output-hashing none</code> flag you remove any hashes from file names. These hashes are good for browser caching which makes them useless and frustrating on the server.
          </p>

        </section>

      </article>

    </div>
  </div>
  );
};

export default Article;
