import React from 'react';
import LinkPreview from './LinkPreview';

const Sources = ({sources}: any) => {
  const paragraphs = sources.split('\n');

  // Helper function to detect and transform source links
  const parseLinks = (str: any, index: any) => {
    const regex = /\[(.*?)\]\((.*?)\)/g;
    let match;
    const elements = [];

    let lastEnd = 0;
    while ((match = regex.exec(str)) !== null) {
      // Add text before the match
      if (match.index > lastEnd) {
        elements.push(str.substring(lastEnd, match.index));
      }

      // Add LinkPreview component
      elements.push(<LinkPreview key={`${index}-${match[2]}`} url={match[2]} />);

      lastEnd = match.index + match[0].length;
    }

    // Add remaining text
    if (lastEnd < str.length) {
      elements.push(str.substring(lastEnd));
    }

    return elements;
  };

  return (
    <div>
      {paragraphs.map((para: any, index: any) => (
        <div key={index}>
          {parseLinks(para, index)}
        </div>
      ))}
    </div>
  );
}

export default Sources;