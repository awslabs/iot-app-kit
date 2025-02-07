import DOMPurify from 'dompurify';
import type { CSSProperties } from 'react';
import { isURL } from 'validator';
import type { TEXT_WIDGET_TYPE } from './constants';
import { defaultFontSettings } from './styledText/defaultFontSettings';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface TextLinkProps {
  widget: WidgetInstance<typeof TEXT_WIDGET_TYPE>;
}

export const TextLink = ({ widget }: TextLinkProps) => {
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
