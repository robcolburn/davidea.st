import { h } from 'preact';

const Head = (props) => (
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="manifest" href="/assets/manifest.json" />
    <title>davidea.st - Web Development Articles</title>
    <style>{props.styles}</style>
  </head>
);

export default Head;
