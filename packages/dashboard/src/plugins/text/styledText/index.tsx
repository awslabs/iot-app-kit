import { spaceScaledXs } from '@cloudscape-design/design-tokens';
import {
  type CSSProperties,
  memo,
  type PointerEventHandler,
  useMemo,
} from 'react';
import type { TEXT_WIDGET_TYPE } from '../constants';
import { defaultFontSettings } from './defaultFontSettings';
import './index.css';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface StyledTextProps {
  widget: WidgetInstance<typeof TEXT_WIDGET_TYPE>;
  onPointerDown?: PointerEventHandler;
  onPointerUp?: PointerEventHandler;
  readonly?: boolean | undefined;
}

export const StyledText = memo(
  ({
    onPointerDown,
    onPointerUp,
    readonly,
    widget: {
      properties: {
        value = '',
        fontSettings: {
          fontSize,
          fontColor,
          isBold,
          isItalic,
          isUnderlined,
        } = defaultFontSettings,
      },
    },
  }: StyledTextProps) => {
    const style: CSSProperties = useMemo(
      () => ({
        fontSize,
        color: fontColor,
        padding: spaceScaledXs,
      }),
      [fontSize, fontColor]
    );

    const showPlaceholder = value.length === 0;
    const textContent = showPlaceholder ? 'Add text' : value;

    const className = `text-widget text-widget-display ${
      isItalic ? 'text-widget-italic' : ''
    } ${isBold ? 'text-widget-bold' : ''} ${
      isUnderlined ? 'text-widget-underline' : ''
    } ${showPlaceholder ? 'text-widget-placeholder' : ''}`;

    return (
      <p
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className={className}
        style={style}
        aria-readonly={readonly}
      >
        {textContent}
      </p>
    );
  }
);
