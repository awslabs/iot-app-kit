import { colorTextLinkDefault } from '@cloudscape-design/design-tokens';
import React, { useEffect, useRef, type CSSProperties } from 'react';
import useClickAway from 'react-use/lib/useClickAway';

import { defaultFontSettings } from './defaultFontSettings';
import { useWidgetActions } from '~/customization/hooks/useWidgetActions';
import { useKeyPress } from '~/hooks/useKeyPress';
import type { TextWidget } from '../../types';

import './styledTextArea.css';

export interface StyledTextAreaProps extends TextWidget {
  handleSetEdit: (isEditing: boolean) => void;
  isUrl?: boolean;
}

export function StyledTextArea({ handleSetEdit, isUrl, ...widget }: StyledTextAreaProps) {
  const { update } = useWidgetActions();

  const { value } = widget.properties;
  const isEmpty = value.length === 0;
  const { fontSize, fontColor, isBold, isItalic, isUnderlined } = widget.properties.fontSettings || defaultFontSettings;

  const className = `text-widget text-widget-editing ${isItalic ? 'text-widget-italic' : ''} ${
    isBold ? 'text-widget-bold' : ''
  } ${isUnderlined ? 'text-widget-underline' : ''} ${isEmpty ? 'text-widget-placeholder' : ''}`;

  const style: CSSProperties = {
    fontSize,
    color: isUrl ? colorTextLinkDefault : fontColor,
  };

  function handleChange(text: string) {
    const updatedWidget: TextWidget = {
      ...widget,
      properties: {
        ...widget.properties,
        value: text,
      },
    };

    update(updatedWidget);
  }

  const textAreaElement = useRef<HTMLTextAreaElement>(null);
  useClickAway(textAreaElement, () => handleSetEdit(false));

  useEffect(() => {
    if (textAreaElement.current) {
      textAreaElement.current.selectionStart = value.length;
      textAreaElement.current.focus();
    }
  }, [textAreaElement]);

  const filter = (e: KeyboardEvent) => e.target === textAreaElement.current;

  useKeyPress('mod+shift+l', {
    callback: () => {
      const updatedWidget: TextWidget = {
        ...widget,
        properties: {
          ...widget.properties,
          isUrl: true,
          href: value,
        },
      };

      update(updatedWidget);
      handleSetEdit(false);
    },
    filter,
  });

  useKeyPress('mod+b', {
    callback: () => {
      const updatedWidget: TextWidget = {
        ...widget,
        properties: {
          ...widget.properties,
          fontSettings: {
            ...widget.properties.fontSettings,
            isBold: !isBold,
          },
        },
      };

      update(updatedWidget);
    },
    filter,
  });

  useKeyPress('mod+i', {
    callback: () => {
      const updatedWidget: TextWidget = {
        ...widget,
        properties: {
          ...widget.properties,
          fontSettings: {
            ...widget.properties.fontSettings,
            isItalic: !isItalic,
          },
        },
      };

      update(updatedWidget);
    },
    filter,
  });

  useKeyPress('mod+u', {
    callback: () => {
      const updatedWidget: TextWidget = {
        ...widget,
        properties: {
          ...widget.properties,
          fontSettings: {
            ...widget.properties.fontSettings,
            isUnderlined: !isUnderlined,
          },
        },
      };

      update(updatedWidget);
    },
    filter,
  });

  useKeyPress('cmd+=', {
    callback: (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (!fontSize) return;

      const updatedWidget: TextWidget = {
        ...widget,
        properties: {
          ...widget.properties,
          fontSettings: {
            ...widget.properties.fontSettings,
            fontSize: fontSize + 1,
          },
        },
      };

      update(updatedWidget);
    },
    filter,
  });

  useKeyPress('cmd+-', {
    callback: (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (!fontSize) return;

      const updatedWidget: TextWidget = {
        ...widget,
        properties: {
          ...widget.properties,
          fontSettings: {
            ...widget.properties.fontSettings,
            fontSize: fontSize - 1,
          },
        },
      };

      update(updatedWidget);
    },
    filter,
  });

  return (
    <textarea
      ref={textAreaElement}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder='Add text'
      style={style}
      className={className}
    />
  );
}
