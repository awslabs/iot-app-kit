import type { CSSProperties } from 'react';
import React from 'react';
import { defaultFontSettings } from '../styledText/defaultFontSettings';
import type { TextWidget } from '../../types';
import DOMPurify from 'dompurify';
import { isURL } from 'validator';

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

  const sanitizedHref = href ? DOMPurify.sanitize(href) : undefined;
  const isValidUrl = sanitizedHref ? isURL(sanitizedHref) : false;
  const renderedHref = isValidUrl ? sanitizedHref : undefined;

  return (
    <a href={renderedHref} className={className} style={style}>
      {value}
    </a>
  );
};

export default TextLink;
