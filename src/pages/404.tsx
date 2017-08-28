import { h } from 'preact';
import Head from '../components/Head';
import Header from '../components/Header';

const title = 'davidea.st - Web Development, Firebase, and Productivity articles';
const NotFoundPage = (props) => {
  return (
    <html>
      <Head title={title} styles={props.styles} />
      <body>

        <Header />

        <div class="layout layout-full layout-center">
          <h1 class="header-big">¯\_(ツ)_/¯</h1>
          <a class="header-medium" href="/">Go Home</a>
        </div>

      </body>
    </html>
  );
};

export default NotFoundPage;
