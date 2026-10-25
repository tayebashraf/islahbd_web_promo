import React from 'react';
import './articlebody.css';

export const ArticleBody = ({ content, fontSize = 'normal' }) => {
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'font-size--sm';
      case 'large':
        return 'font-size--lg';
      case 'xlarge':
        return 'font-size--xl';
      default:
        return '';
    }
  };

  return (
    <div className="article-body-container">
      <div
        className={`article-body-content ${getFontSizeClass()}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default ArticleBody;
