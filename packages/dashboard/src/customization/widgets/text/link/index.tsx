import type { CSSProperties } from 'react';
import React from 'react';
import { defaultFontSettings } from '../styledText/defaultFontSettings';
import type { TextWidget } from '../../types';
import isValidUrl from 'is-url';

type TextLinkProps = TextWidget;

const TextLink: React.FC<TextLinkProps> = (widget) => {
  const { value, href } = widget.properties;

  const { fontSize, fontColor, isBold, isItalic, isUnderlined } =
    widget.properties.fontSettings || defaultFontSettings;

  const className = `text-widget text-widget-link ${
    isItalic ? 'text-widget-italic' : ''
  } ${isBold ? 'text-widget-bold' : ''} ${
    isUnderlined ? 'text-widget-underline' : ''
  }`;

  const style: CSSProperties = {
    fontSize,
    color: fontColor,
  };

  const renderedHref = href && isValidUrl(href) ? href : undefined;

  return (
    <a href={renderedHref} className={className} style={style}>
      {value}
    </a>
  );
};

export default TextLink;
