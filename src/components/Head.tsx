import { h } from 'preact';

const Head = (props) => (
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="manifest" href="/assets/manifest.json" />
    <title>{props.title}</title>
    <style>{props.styles}</style>
    <script defer src="/assets/prism.js"></script>
  </head>
);

export default Head;
