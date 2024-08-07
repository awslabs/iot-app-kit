import type { CSSProperties, PointerEventHandler } from 'react';
import React from 'react';
import { defaultFontSettings } from './defaultFontSettings';

import './index.css';
import type { TextWidget } from '../../types';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';

type StyledTextProps = TextWidget & {
  onPointerDown?: PointerEventHandler;
  onPointerUp?: PointerEventHandler;
  readonly?: boolean;
};

const StyledText: React.FC<StyledTextProps> = ({
  onPointerDown,
  onPointerUp,
  readonly,
  ...widget
}) => {
  const { value } = widget.properties;

  const { fontSize, fontColor, isBold, isItalic, isUnderlined } =
    widget.properties.fontSettings || defaultFontSettings;

  const addPlaceholder = value.length === 0;

  const className = `text-widget text-widget-display ${
    isItalic ? 'text-widget-italic' : ''
  } ${isBold ? 'text-widget-bold' : ''} ${
    isUnderlined ? 'text-widget-underline' : ''
  } ${addPlaceholder ? 'text-widget-placeholder' : ''}`;

  const style: CSSProperties = {
    fontSize,
    color: fontColor,
    padding: spaceScaledXs,
  };

  const textContent = addPlaceholder ? 'Add text' : value;

  const pointerListeners = {
    onPointerDown,
    onPointerUp,
  };

  return (
    <p
      {...pointerListeners}
      className={className}
      style={style}
      aria-readonly={readonly}
    >
      {textContent}
    </p>
  );
};

export default StyledText;
