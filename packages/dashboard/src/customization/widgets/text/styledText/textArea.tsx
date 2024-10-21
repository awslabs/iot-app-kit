import {
  colorTextLinkDefault,
  spaceScaledXs,
} from '@cloudscape-design/design-tokens';
import React, { useEffect, type CSSProperties } from 'react';
import type { TextWidget } from '~/customization/widgets/types';
import { useClickOutside } from '~/hooks/useClickOutside';
import { useKeyPress } from '~/hooks/useKeyPress';
import { useUpdateWidget } from '~/store/dashboard/use-update-widget';
import { defaultFontSettings } from './defaultFontSettings';
import './textArea.css';

type StyledTextAreaProps = TextWidget & {
  handleSetEdit: (isEditing: boolean) => void;
  isUrl?: boolean;
};

const StyledTextArea: React.FC<StyledTextAreaProps> = ({
  handleSetEdit,
  isUrl,
  ...widget
}) => {
  const updateWidget = useUpdateWidget();

  const { value } = widget.properties;

  const { fontSize, fontColor, isBold, isItalic, isUnderlined } =
    widget.properties.fontSettings || defaultFontSettings;

  const addPlaceholder = value.length === 0;

  const className = `text-widget text-widget-editing ${
    isItalic ? 'text-widget-italic' : ''
  } ${isBold ? 'text-widget-bold' : ''} ${
    isUnderlined ? 'text-widget-underline' : ''
  } ${addPlaceholder ? 'text-widget-placeholder' : ''}`;

  const style: CSSProperties = {
    fontSize,
    color: isUrl ? colorTextLinkDefault : fontColor,
    padding: spaceScaledXs,
    background: 'none',
  };

  const handleSetText = (text: string) => {
    const updatedWidget: TextWidget = {
      ...widget,
      properties: {
        ...widget.properties,
        value: text,
      },
    };
    updateWidget(updatedWidget);
  };

  const ref = useClickOutside<HTMLTextAreaElement>(() => handleSetEdit(false));
  useEffect(() => {
    if (ref.current) {
      ref.current.selectionStart = value.length;
      ref.current.focus();
    }
    // disabling because eslint misidentifies the ref as a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.length]);

  const filter = (e: KeyboardEvent | ClipboardEvent) =>
    e.target === ref.current;
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
      updateWidget(updatedWidget);
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
      updateWidget(updatedWidget);
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
      updateWidget(updatedWidget);
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
      updateWidget(updatedWidget);
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
      updateWidget(updatedWidget);
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
      updateWidget(updatedWidget);
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
