import { h } from 'preact';
import ArticleTitle from '../components/ArticleTitle';

const Article = (props) => {
  const article = props.article;
  return (
    <div class="de-grid de-row-double de-padding">

      <article class="de-post">

        <section class="de-article-content">
          <ArticleTitle article={article} />
        </section>

        <div>
        <section class="de-article-content de-article-content-top">

          <div class="de-blockquote-border">
            <div class="de-blockquote-frame">
              <blockquote class="de-blockquote">
                  Enthusiasm is common. Endurance is rare.          
              </blockquote>
              <a class="de-blockquote-attribution" href="https://www.amazon.com/Grit-Passion-Perseverance-Angela-Duckworth/dp/1501111108">Grit by Angela Duckworth</a>
            </div>
          </div>
            
          <div class="de-blogimg-frame">
            <img class="de-blogimg" src="/assets/articles/github-graveyard/side-projects.png" />
          </div>

          <p class="de-tagline">
            There's a graveyard of side-projects in my Github account.
          </p>

          <ul class="de-list">
            <li><a href="https://github.com/davideast/TappyBase">TappyBase</a> was a nearly-finished "tap all the Firebases" iOS game.</li> 
            <li><a href="https://github.com/davideast/recaller">Recaller</a> was a half-built email reminder iOS app.</li> 
            <li><a href="https://github.com/davideast/understanding-underscore">understanding-underscore</a> was a short-lived attempt to read through the underscore source code.</li>  
            <li><a href="https://github.com/davideast/perf-js">perf.js</a> was an over-engineered Resource Timing API listener.</li> 
            <li><a href="https://github.com/davideast/slack-budget">slack-budget</a> was a "built but never used" budget management Slack bot.</li>  
            <li><a href="https://github.com/davideast/wontfix">wontfix</a> was a GitHub issue manager that I lost interest in making.</li> 
          </ul>

          <p>
            This blog almost made the list. 
          </p>

          <h3>A commitment to grit</h3>

          <p>
            As of today, I'm finally moving past all the reasons not to finish something. No more: <em>"I don't have time"</em>, <em>"This isn't good enough"</em>, and most importantly <em>"I'm bored of this."</em>
          </p>
          
          <p>
            Here's to grit. Here's to focus. Here's to finishing things, even if they're not perfect.
          </p>

        </section>


        </div>

      </article>

    </div>
  );
};

export default Article;
