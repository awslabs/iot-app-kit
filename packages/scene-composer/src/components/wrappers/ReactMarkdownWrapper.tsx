import { colorTextLinkDefault } from '@cloudscape-design/design-tokens';
import React, { CSSProperties, FC } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

export interface ReactMarkdownWrapperProps {
  content: string;
  style?: CSSProperties;
}
export const ReactMarkdownWrapper: FC<ReactMarkdownWrapperProps> = ({ content, style }) => {
  return (
    <div style={style}>
      <ReactMarkdown
        skipHtml
        linkTarget='_blank'
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ node, ...props }) => <a style={{ color: colorTextLinkDefault }} {...props} />,
          img: ({ node, ...props }) => <img style={{ maxWidth: '100%' }} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
