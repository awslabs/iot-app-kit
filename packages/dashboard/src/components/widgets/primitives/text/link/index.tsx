import React, { CSSProperties } from 'react';

import { TextWidget } from '../../../../../types';

type TextLinkProps = TextWidget;

const TextLink: React.FC<TextLinkProps> = (widget) => {
  const { text, link, font, fontSize, italic, bold, underline, color } = widget;

  const className = `text-widget text-widget-link ${italic ? 'text-widget-italic' : ''} ${
    bold ? 'text-widget-bold' : ''
  } ${underline ? 'text-widget-underline' : ''}`;

  const style: CSSProperties = {
    fontFamily: font,
    fontSize,
    color,
  };

  return (
    <a href={link} className={className} style={style}>
      {text}
    </a>
  );
};

export default TextLink;
