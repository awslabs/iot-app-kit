import type { CSSProperties } from 'react';
import React from 'react';
import { defaultFontSettings } from '../styledText/defaultFontSettings';
import type { TextWidget } from '../../types';

type TextLinkProps = TextWidget;

const TextLink: React.FC<TextLinkProps> = (widget) => {
  const { value, href } = widget.properties;

  const { fontSize, fontColor, isBold, isItalic, isUnderlined } = widget.properties.fontSettings || defaultFontSettings;

  const className = `text-widget text-widget-link ${isItalic ? 'text-widget-italic' : ''} ${
    isBold ? 'text-widget-bold' : ''
  } ${isUnderlined ? 'text-widget-underline' : ''}`;

  const style: CSSProperties = {
    fontSize,
    color: fontColor,
  };

  return (
    <a href={href} className={className} style={style}>
      {value}
    </a>
  );
};

export default TextLink;
