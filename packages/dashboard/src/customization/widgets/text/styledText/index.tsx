import type { CSSProperties, PointerEventHandler } from 'react';
import React from 'react';
import { defaultFontSettings } from './defaultFontSettings';

import './index.css';
import type { TextWidget } from '../../types';

type StyledTextProps = TextWidget & {
  onPointerDown?: PointerEventHandler;
  onPointerUp?: PointerEventHandler;
};

const StyledText: React.FC<StyledTextProps> = ({ onPointerDown, onPointerUp, ...widget }) => {
  const { value } = widget.properties;

  const { fontSize, fontColor, isBold, isItalic, isUnderlined } = widget.properties.fontSettings || defaultFontSettings;

  const addPlaceholder = value.length === 0;

  const className = `text-widget text-widget-display ${isItalic ? 'text-widget-italic' : ''} ${
    isBold ? 'text-widget-bold' : ''
  } ${isUnderlined ? 'text-widget-underline' : ''} ${addPlaceholder ? 'text-widget-placeholder' : ''}`;

  const style: CSSProperties = {
    fontSize,
    color: fontColor,
  };

  const textContent = addPlaceholder ? 'Add text' : value;

  const pointerListeners = {
    onPointerDown,
    onPointerUp,
  };

  return (
    <p {...pointerListeners} className={className} style={style}>
      {textContent}
    </p>
  );
};

export default StyledText;
