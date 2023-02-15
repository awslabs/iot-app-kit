import React, { CSSProperties } from 'react';
import { TextWidget } from '~/types';

import './index.css';

type StyledTextProps = TextWidget & {
  onPointerDown?: () => void;
  onPointerUp?: () => void;
};

const StyledText: React.FC<StyledTextProps> = ({ onPointerDown, onPointerUp, ...widget }) => {
  const { text, messageOverrides, font, fontSize, italic, bold, underline, color } = widget;

  const addPlaceholder = text.length === 0;

  const className = `text-widget text-widget-display ${italic ? 'text-widget-italic' : ''} ${
    bold ? 'text-widget-bold' : ''
  } ${underline ? 'text-widget-underline' : ''} ${addPlaceholder ? 'text-widget-placeholder' : ''}`;

  const style: CSSProperties = {
    fontFamily: font,
    fontSize,
    color,
  };

  const textContent = addPlaceholder ? messageOverrides?.placeholder : text;

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
