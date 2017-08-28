import { h } from 'preact';

const Head = (props) => {
  const metas = props.metas || [];
  const twitterCard = metas.map(meta => {
    return <meta name={"twitter:" + meta.name} content={meta.content} />
  });
  return (
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="manifest" href="/assets/manifest.json" />
      <title>{props.title}</title>
      <style>{props.styles}</style>
      {twitterCard}
      <script defer src="/assets/prism.js"></script>
      <script async src="/assets/ga.js"></script>
    </head>
  )
};

export default Head;
