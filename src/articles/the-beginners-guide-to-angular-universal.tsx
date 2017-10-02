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

  const SAMPLE_WITH_SERVER_TRANSITION = `import { BrowserModule } from '@angular/platform-browser';
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

  const SAMPLE_NG_BUILD_OUTPUT = `Date: 2017-09-26T12:39:17.053Z
Hash: 53b3312d5cbe854aac7c
Time: 4791ms
chunk {0} main.bundle.js (main) 7.13 kB [entry] [rendered]
chunk {1} styles.bundle.css (styles) 0 bytes [entry] [rendered]`;

  const SAMPLE_TS_FUNCTIONS_CONFIG = {
    "compilerOptions": {
      "module": "commonjs",
      "target": "es2015",
      "outDir": "../functions"
    }
  };

  const SAMPLE_SERVER_EXPRESS_SETUP = `import 'zone.js/dist/zone-node';
import * as express from 'express';
import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import * as fs from 'fs-extra';

enableProdMode();

const app = express();
app.get('**', async (request, response) => {

  // Do magical Angular universal stuff here

});

const PORT = process.env.PORT || 3022;
app.listen(PORT, () => { console.log(\`Listening on \${PORT}...\`); });`;

const SAMPLE_SERVER_UNIVERSAL_SETUP = `import 'zone.js/dist/zone-node';
import * as express from 'express';
import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import * as fs from 'fs-extra';

const app = express();
app.get('**', async (request, response) => {
  // renderModuleFactory parameters
  const { AppServerModuleNgFactory } = require(__dirname + '/main.bundle');
  const document = await fs.readFile(__dirname + '/index.html', 'utf8');
  const url = request.path;
  const options = { document, url };
});

const PORT = process.env.PORT || 3022;
app.listen(PORT, () => { console.log(\`Listening on \${PORT}...\`); });`;

const SAMPLE_SERVER_UNIVERSAL_FINAL = `import 'zone.js/dist/zone-node';
import * as express from 'express';
import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import * as fs from 'fs-extra';

const app = express();
app.get('**', async (request, response) => {
    // renderModuleFactory parameters
    const url = request.path;
    const { AppServerModuleNgFactory } = require(__dirname + '/main.bundle');
    const document = await fs.readFile(__dirname + '/index.html', 'utf8');
    const options = { document, url };
    
    try {
      // generate the server-side rendered html
      const html = await renderModuleFactory(AppServerModuleNgFactory, options);
      response.send(html);
    } catch(e) {
      console.log(e);
      response.status(500).send('¯\_(ツ)_/¯');
    }
});

const PORT = process.env.PORT || 3022;
app.listen(PORT, () => { console.log(\`Listening on \${PORT}...\`); });`

const SAMPLE_VIEW_SOURCE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>SsrProject</title><base href="/"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/x-icon" href="favicon.ico"><link href="styles.d41d8cd98f00b204e980.bundle.css" rel="stylesheet"></head><body><app-root ng-version="4.4.3">
<p>
  app Works!
</p>
</app-root><script type="text/javascript" src="inline.0895b7ae96be5a907c9a.bundle.js"></script><script type="text/javascript" src="polyfills.81bfb9793231bc1ae345.bundle.js"></script><script type="text/javascript" src="vendor.ea461c51d3a0d717e482.bundle.js"></script><script type="text/javascript" src="main.caefc3854b783c29b2ef.bundle.js"></script></body></html>`;

const SAMPLE_PLATFORM_ID = `import { isPlatformBrowser } from '@angular/common;`;

const SAMPLE_STATIC_DIR = `import 'zone.js/dist/zone-node';
import * as express from 'express';
import { renderModuleFactory } from '@angular/platform-server';
import * as fs from 'fs-extra';

const app = express();
// Assign a static directory
app.use(express.static(__dirname + '/dist'));
app.get('**', async (request, response) => {
    // renderModuleFactory parameters
    const url = request.path;
    const { AppServerModuleNgFactory } = require(__dirname + '/main.bundle');
    const document = await fs.readFile(__dirname + '/index.html', 'utf8');
    const options = { document, url };
    
    try {
      // generate the server-side rendered html
      const html = await renderModuleFactory(AppServerModuleNgFactory, options);
      response.send(html);
    } catch(e) {
      console.log(e);
      response.status(500).send('¯\_(ツ)_/¯');
    }
});

const PORT = process.env.PORT || 3022;
app.listen(PORT, () => { console.log(\`Listening on \${PORT}...\`); });`;

const SAMPLE_FUNCTIONS_DIST_APP_ENTRY = `{
  "root": "src",
  "outDir": "functions/dist",
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
              This article is based off {versions.ANGULAR} of Angular Universal, {versions.ANGULAR} Angular, and {versions.CLI} of the Angular CLI.
            </em>
          </div>
          
          <p class="de-tagline">
            Angular Universal can help you improve SEO, perceived performance, and even in <a href="/articles/measuring-server-side-rendering-performance-is-tricky">some cases page load performance itself</a>.
          </p>

          <p>
            Getting started isn’t difficult. It’s powerful but it’s not magic. The goal of this guide is not only to get you started but to give you a deeper understanding of how Angular Universal works. This guide takes you from zero to universal with these steps:
          </p>

          <ul class="de-list">
            <li>Create an minimal Angular build with the CLI.</li>
            <li>Configure the CLI to create a universal bundle.</li>
            <li>Set up a server.</li>
            <li>Generate Angular Universal content per route.</li>
            <li>Configure serving for static files.</li>
          </ul>   

          <p>
            There’s some tedious configuration in the beginning, but then it’s smooth sailing. Open up a terminal. Let’s begin.
          </p>

          <h3>Angular Universal is two parts</h3>
          <p>
            Angular Universal isn't a command-line tool. It's more than running a command to "sprinkle in" server-side rendering. Angular Universal changes how you build, deliver, and load your site. To take advantage of Angular Universal you need to understand the big picture. Angular Universal is two parts: a <strong>universal bundle</strong> and a <strong>server</strong>.
          </p>

          </section>
      
      </article>

    </div>

    <h2 class="de-part-h2">Part One: The universal bundle</h2>

    <div class="de-grid de-padding">
      <article class="de-post">
        <section class="de-article-content">

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

          <CodeBox 
            code="npm i -g @angular/cli" 
            language="bash" />

          <h3>Set up a minimal project</h3>
          <p>
            Use the CLI to create a new project. The CLI provides a command that creates an Angular project with a minimal setup.
          </p>

          <CodeBox 
            code="ng new ssr-project --minimal" 
            language="bash" />

          <h3>Install platform server</h3>
          <p>
            Angular Universal works through the <code>@angular/platform-server</code> module. It doesn't come with the Angular CLI setup. You need to install it separately. 
          </p>

          <CodeBox 
            code="npm i @angular/platform-server --save" 
            language="bash" />

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

          <CodeBox 
            code={SAMPLE_WITH_SERVER_TRANSITION}
            filePath="/src/app/app.server.module.ts" 
            language="ts" />


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

          <h3>Set up the server module's TypeScript configuration</h3>
          <p>
            At the point you've created the <code>ServerModule</code> and it's entry point. However, there's no TypeScript configuration to build it to JavaScript. You might be thinking, <em>"Oh, I'll just add it to the <code>"files"</code> array in the <code>tsconfig.app.json</code>." </em>

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
            Open the <code>.angular-cli.json</code> file. This file contains the default configuration options. To create a universal bundle you need to create a separater <code>"app"</code> entry. Add the following entry to the <code>"apps"</code> array.
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

          <CodeBox 
            code="ng build --app 1 --prod --output-hashing none" 
            language="bash" />
            
          <p>
            This should give you an output that looks something like this:
          </p>

          <CodeBox 
            code={SAMPLE_NG_BUILD_OUTPUT} 
            language="bash" />

          <p>
            Success! You have a universal bundle. What about those flags? The <code>--prod</code> flag minified and enabled AoT. The <code>--output-hashing none</code> flag removed any hashes from file names. These hashes are good for browser caching, but this makes them useless and frustrating on the server.
          </p>

          <p>
            Speaking of servers, it's time that you set one up.
          </p>

        </section>
      </article>
    </div>

    <h2 class="de-part-h2">Part Two: The server</h2>

    <div class="de-grid de-padding">
      <article class="de-post">
        <section class="de-article-content">

        <p>
          A server is the second part of an Angular Universal app. The server is where you will use Angular's <code>@angular/platform-server</code>. This module generates static HTML and CSS from the universal bundle.
        </p>

        <p>
           There is an Angular Universal integration with .NET, but for this example you're going to use a nodejs server. You've been writing in TypeScript this whole time so it won't be too different.
        </p>

        <h3>Configure the server code for TypeScript</h3>
        <p>
          It's not required to write the server code in TypeScript, but it's useful. Create a <code>server</code> folder at the root of your project. Inside that folder create yet another configuration file: <code>tsconfig.functions.json</code>. You'll use this configuration file to build your server code to the <code>functions</code> folder in a commonjs format.
        </p>

        <CodeBox 
          code={SAMPLE_TS_FUNCTIONS_CONFIG} 
          filePath="/server/tsconfig.functions.json" 
          language="json" />

        <h3>Build the browser app</h3>
        <p>
          There are two entries in your <code>"apps"</code> array. The one you created is for the server and the original one is for the browser. When the browser apps builds it stores the resulting files in the <code>dist</code> folder. Angular Universal requires the <code>index.html</code> document to generate the server-side rendered page. You need to build the browser app and move the <code>index.html</code> into the functions folder.
        </p>

        <CodeBox 
          code="ng build --prod && mv dist/index.html functions" 
          language="bash" />

        <h3>Install express</h3>
        <p>
          You're going to use express.js as your server framework. It's easy to use and has integrations across hosting platforms. You'll also install a helper library: <code>fs-extra</code>.
        </p>

        <CodeBox 
          code="npm i express @types/express fs-extra @types/fs-extra --save"
          language="bash" />

        <h3>Set up the express app</h3>
        <p>
          Create a file at <code>server/index.ts</code>. This file is this entry point to your server. Here you'll create an express app, listen for requests, and use Angular Universal to generate HTML and CSS from your universal bundle.
        </p>

        <CodeBox 
          code={SAMPLE_SERVER_EXPRESS_SETUP} 
          filePath="/server/index.ts" 
          language="ts" />

        <p>
          This server code does the following things:
        </p>
        <ul className="de-list">
          <li><strong>Imports zone.js:</strong> A node-specific version of zone.js. Things will totally break if you forget this.</li>
          <li><strong>Imports express:</strong> This is the server framework.</li>
          <li><strong>Imports Angular Universal:</strong> The <code>renderModuleFactory</code> from <code>@angular/platform-server</code>. This function is responsible for generating HTML and CSS from a universal bundle.</li>
          <li><strong>Creates an express app</strong>: An app is where you attach http handlers like: <code>GET</code> and <code>POST</code> methods.</li>
          <li><strong>Creates a greedy <code>**</code> route</strong>: This route handles any <code>GET</code> request to the server.</li>
          <li><strong>Launches the server</strong>: Uses a default port of 3022.</li>
        </ul>

        <h3>Require the assets for Angular Universal</h3>
        <p>
          You can now respond to all <code>GET</code> requests. To use Angular Universal you need to first get the assets it requires. This includes the <strong>universal bundle</strong>, the <code>index.html</code>, and the <strong>current url</strong>.
        </p>

        <CodeBox 
          code={SAMPLE_SERVER_UNIVERSAL_SETUP} 
          filePath="/server/index.ts" 
          language="ts" />
          
        <p>
          The additions you made do the following things:
        </p>
        <ul>
          <li><strong>Requires the universal bundle</strong>: The <code>AppServerModuleNgFactory</code> is from the universal bundle. This is an AoT version of your <code>AppServerModule</code>. A require is used because no module or type information is available for TypeScript to use.</li>
          <li><strong>Reads the <code>index.html</code></strong>: Angular Universal needs the <code>index.html</code> document. Using the <code>fs-extra</code> library you retrieve the file back as a <code>Promise</code>.</li>
          <li><strong>Retrieves the current url</strong>: Angular Universal also needs the url for the path you are trying to render. This helps it work with the router.</li>
        </ul>

        <h3>Server-side render your Angular app</h3>
        <p>
          Now you can get to the good part. Using Angular Unviersal to server-side render your app.
        </p>

        <CodeBox 
          code={SAMPLE_SERVER_UNIVERSAL_FINAL} 
          filePath="/server/index.ts" 
          language="ts" />

        <p>
          Angular Universal's <code>renderModuleFactory</code> takes in the universal bundle and a set of options. In your case you provide the <code>index.html</code> document and current url as the options. This returns a promise containing the server-side rendered HTML if successful. If there's an error you can catch it and send back a 500 status page.          
        </p>

        <h3>Build and run the server</h3>
        <p>
          Build the server code to test your Angular Universal app.
        </p>

        <CodeBox 
          code="node_modules/.bin/tsc server/tsconfig.functions.json" 
          language="bash" />

        <p>
          Now you can run the server.
        </p>

        <CodeBox 
          code="node server/index.js" 
          language="bash" />
        
        <h3>Open the browser and view source</h3>
        <p>
          Open up the app in your favorite browser. If you're running off the default Angular CLI project you should see something like "app Works!" on the screen. Right-click and view the source of the document. You should see the content of your app inside the source of the document like below:
        </p>

        <CodeBox 
          code={SAMPLE_VIEW_SOURCE} 
          language="html" />

        <h3>What if you don't see your content?</h3>
        <p>
          If your source looks like your regular non-server-side rendered app then a few things may have happened. When Angular Universal encounters an unsupported DOM API or some error in your universal bundle it will return the default <code>index.html</code>. You'll need to inspect any places where you could be directly accessing the DOM. 
        </p>

        <p>
          I've hit this error when I've used the <code>PerformanceObserver</code> API. One solution is to use the <code>isPlatformBrowser</code> helper function to guard against browser dependent code.
        </p>

        <CodeBox 
          code={SAMPLE_PLATFORM_ID} 
          language="ts" />

        <h3>Inspecting 404s</h3>
        <p>
          Inspect the Network panel in your browser's DevTools. You'll notice that you receive back a set of <code>404</code>s. These are your static assets for your site. It's the browser version of your app. 
        </p>

        </section>
      </article>
    </div>

    <div class="de-blogimg-frame-full">
      <img 
        alt="Unexpected token &lt; error"
        src="/assets/articles/the-beginners-guide-to-angular-universal/static-requests-error.jpg" />
    </div>

    <div class="de-grid de-padding">
      <article class="de-post">
        <section class="de-article-content">

        <p>
          The only route is a <code>**</code> greedy route. This means every single <code>GET</code> request is processed by this handler. When the browser requests your static assets the server will run Angular Universal for that url. For the <code>/</code> route this will generate the proper Angular Universal HTML.          
        </p>
        <p>
          However, when the browser requests a static asset like the vendor bundle this will cause an error. You receive the <code>Unexpected token &lt;</code> error because the server is sending back the default HTML and not the browser bundle. The browser is expecting JavaScript and it's getting HTML.
        </p>

        <h3>Delivering static assets</h3>
        <p>
          At this point you have a decision to make. You can either set up the server to deliver these static assets or serve them over a Content Delivery Network (CDN).
        </p>

        <p>
          Delivering static assets from the server is simple. You need to change your configuration to build the browser app to the <code>functions/dist</code> folder. 
        </p>

        <CodeBox 
            code={SAMPLE_FUNCTIONS_DIST_APP_ENTRY} 
            filePath="/.angular-cli.json" 
            language="json" />

        <p>
          This way the files are located with the server. Then all you need to do is use express's <code>static</code> method to designate the <code>dist</code> folder as static. This ensures the files are not processed by the <code>**</code> handler and are delivered "as-is".
        </p>

        <CodeBox 
          code={SAMPLE_STATIC_DIR}
          filePath="/server/index.ts" 
          language="ts" />

        <h3>You're done!</h3>
        <p>
          You've done it. The tedious part is over. The configuration. The build files. The server. You have a bonafide Angular Universal site. Now you just have to worry about deployment. 
        </p>

        <h3>A note on performance</h3>
        <p>
          This is not the most performant way to deliver your site. Delivering files from a single server in a single location will incur high latency for most users. Your files can travel only at a fraction of the speed of light and will incur network overhead as well. The fastest way to deliver your site is to get as close to the user as possible. This is what a CDN does.
        </p>

        <p>          
          A CDN places your assets phyiscally close to the user by copying them in edge servers across the world. Every user will have the files served from an edge near them.
        </p>

        <p>
          I deploy my Angular Universal sites (well, all my sites) to Firebase Hosting. Firebase Hosting is backed by a CDN and it handles asset deployment, CDN cache purging, and all the other complicated things. 
        </p>

        <p>
          In the next article I'll cover how deploy and deliver your Angular Universal site on Firebase Hosting.
        </p>

        <div class="de-thx">
          <em>
            Thanks for making it all the way to the bottom! If you enjoyed the piece please gave it a share. If you have any questions feel free to <a href="https://twitter.com/_davideast">reach out to me on Twitter</a>.
          </em>
        </div>

        </section>
      </article>
    </div>
  </div>
  );
};

export default Article;
