import { h } from 'preact';
import Head from '../components/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleTitle from '../components/ArticleTitle';

const ArticlePage = (props) => {
  const article = props.article;
  return (
  <html>
    
    <Head title={props.title} styles={props.styles} metas={article.metas} />

    <body>

      <Header />
    
      <div class="de-grid de-row-double de-padding">
  
        <article class="de-post">
  
          <section class="de-article-content">
            <ArticleTitle article={article} />
          </section>

          <div dangerouslySetInnerHTML={{__html: props.content}}></div>
          
        </article>
  
      </div>
  
      <Footer />
  
      <script defer src="/assets/prism.js"></script>
    </body>
  </html>
  );
};

export default ArticlePage;
