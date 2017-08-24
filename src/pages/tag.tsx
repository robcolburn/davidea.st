import { h } from 'preact';
import Head from '../components/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleList from '../components/ArticleList';

const TagPage = (props) => {
  const title = `davidea.st - ${props.tag} Articles`;
  return (
    <html>
      <Head title={title} styles={props.styles} />
      <body>
    
        <Header />
    
        <div class="de-padding de-tag-row de-grid de-tagheader">
          <h2>Articles tagged: <span class="capitalize">{props.tag}</span></h2>
        </div>
    
        <div class="de-grid de-tag-padding">
          <ArticleList articles={props.articles} />
        </div>
        
        <Footer />
        
      </body>
    </html>    
  );
};

export default TagPage;
