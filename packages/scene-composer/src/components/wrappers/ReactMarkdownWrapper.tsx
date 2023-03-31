import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

import './ReactMarkdownWrapper.scss';

export interface ReactMarkdownWrapperProps {
  content: string;
  className?: string;
}
export const ReactMarkdownWrapper: FC<ReactMarkdownWrapperProps> = ({ content, className }) => {
  return (
    <ReactMarkdown
      skipHtml
      className={`markdown-wrapper ${className}`}
      linkTarget='_blank'
      rehypePlugins={[rehypeSanitize]}
    >
      {content}
    </ReactMarkdown>
  );
};
