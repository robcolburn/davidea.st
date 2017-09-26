import { h } from 'preact';

const CodeBox = (props) => {
  let { code, filePath, language } = props;
  const type = typeof code;
  if(type === 'object') {
    code = JSON.stringify(code, null, 3);
  }
  let languageClass = `language-${language}`;
  const iconClass = `de-codeboxfull-icon ${languageClass}`;
  if(language === 'ts') {
    languageClass = `language-javascript`;
  } 
  return (
    <div className="de-codeboxfull">
      <div className="de-codeboxfull-tab">
        <span className={iconClass}></span>
        <code className="de-codeboxfull-file">{filePath}</code>
      </div>
      <pre><code className={languageClass}>{code}</code></pre>
    </div>
  );
};

export default CodeBox;
