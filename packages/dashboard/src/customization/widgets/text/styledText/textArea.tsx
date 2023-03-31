import type { CSSProperties } from 'react';
import React, { useEffect } from 'react';
import { useWidgetActions } from '~/customization/hooks/useWidgetActions';
import { useClickOutside } from '~/hooks/useClickOutside';
import { useKeyPress } from '~/hooks/useKeyPress';
import { defaultFontSettings } from './defaultFontSettings';

import './textArea.css';
import type { TextWidget } from '../../types';

type StyledTextAreaProps = TextWidget & {
  handleSetEdit: (isEditing: boolean) => void;
};

const StyledTextArea: React.FC<StyledTextAreaProps> = ({ handleSetEdit, ...widget }) => {
  const { update } = useWidgetActions();

  const { value } = widget.properties;

  const { fontSize, fontColor, isBold, isItalic, isUnderlined } = widget.properties.fontSettings || defaultFontSettings;

  const addPlaceholder = value.length === 0;

  const className = `text-widget text-widget-editing ${isItalic ? 'text-widget-italic' : ''} ${
    isBold ? 'text-widget-bold' : ''
  } ${isUnderlined ? 'text-widget-underline' : ''} ${addPlaceholder ? 'text-widget-placeholder' : ''}`;

  const style: CSSProperties = {
    fontSize,
    color: fontColor,
  };

  const handleSetText = (text: string) => {
    const updatedWidget: TextWidget = {
      ...widget,
      properties: {
        ...widget.properties,
        value: text,
      },
    };
    update(updatedWidget);
  };

  const ref = useClickOutside<HTMLTextAreaElement>(() => handleSetEdit(false));
  useEffect(() => {
    if (ref.current) {
      ref.current.selectionStart = value.length;
      ref.current.focus();
    }
  }, [ref]);

  const filter = (e: KeyboardEvent) => e.target === ref.current;
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
    callback: (e) => {
      e.stopPropagation();
      e.preventDefault();
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
    callback: (e) => {
      e.stopPropagation();
      e.preventDefault();
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
      ref={ref}
      value={value}
      onChange={(e) => handleSetText(e.target.value)}
      placeholder='Add text'
      style={style}
      className={className}
    ></textarea>
  );
};

export default StyledTextArea;
