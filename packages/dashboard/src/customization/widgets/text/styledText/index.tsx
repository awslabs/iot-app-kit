import React, { CSSProperties } from 'react';
import { TextWidget } from '../../types';
import { defaultFontSettings } from './defaultFontSettings';

import './index.css';

type StyledTextProps = TextWidget & {
  onPointerDown?: () => void;
  onPointerUp?: () => void;
};

const StyledText: React.FC<StyledTextProps> = ({ onPointerDown, onPointerUp, ...widget }) => {
  const { value } = widget.properties;

  const { fontSize, fontColor, fontFamily, isBold, isItalic, isUnderlined } =
    widget.properties.fontSettings || defaultFontSettings;

  const addPlaceholder = value.length === 0;

  const className = `text-widget text-widget-display ${isItalic ? 'text-widget-italic' : ''} ${
    isBold ? 'text-widget-bold' : ''
  } ${isUnderlined ? 'text-widget-underline' : ''} ${addPlaceholder ? 'text-widget-placeholder' : ''}`;

  const style: CSSProperties = {
    fontFamily,
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
