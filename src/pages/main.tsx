import { h } from 'preact';
import Header from '../components/Header';
import Head from '../components/Head';
import Headline from '../components/Headline';
import Footer from '../components/Footer';
import ArticleList from '../components/ArticleList';

const title = 'davidea.st - Web Development Articles';
const Main = (props) => {
  return (
    <html>
      <Head title={title} styles={props.styles} />
      <body>
        <Header />

        <div class="de-grid de-row-double de-padding">
          
          <Headline article={props.headlinePost} />

          <ArticleList articles={props.articles} />

        </div>

        <Footer />

        {/* <script src="/sw.reg.js"></script> */}
      </body>
    </html>
  );
}

export default Main;
