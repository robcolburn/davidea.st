import { h } from 'preact';
import Head from '../components/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleTitle from '../components/ArticleTitle';

const ArticlePage = (props) => {
  const data = props.data;
  return (
  <html>
    
    <Head title={props.title} styles={props.styles} metas={data.metas} />

    <body>

      <Header />
      {props.article}
      <Footer />
  
      <script defer src="/assets/prism.js"></script>
    </body>
  </html>
  );
};

export default ArticlePage;
