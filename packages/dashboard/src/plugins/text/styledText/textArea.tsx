import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { useClickOutside } from '~/hooks/useClickOutside';
import { useKeyPress } from '~/hooks/useKeyPress';
import { defaultFontSettings } from './defaultFontSettings';
import {
  colorTextLinkDefault,
  spaceScaledXs,
} from '@cloudscape-design/design-tokens';
import './textArea.css';
import type { TEXT_WIDGET_TYPE } from '../constants';
import { useWidgetSetting } from '~/features/widget-customization/settings/use-widget-setting';
import { type WidgetInstance } from '~/features/widget-instance/instance';

const DEFAULT_FONT_SIZE = 16;

export interface StyledTextAreaProps {
  widget: WidgetInstance<typeof TEXT_WIDGET_TYPE>;
  handleSetEdit: (isEditing: boolean) => void;
}

export const StyledTextArea = ({
  handleSetEdit,
  widget,
}: StyledTextAreaProps) => {
  const [value = '', setValue] = useWidgetSetting(widget, 'properties.value');
  const [isBold, setIsBold] = useWidgetSetting(
    widget,
    'properties.fontSettings.isBold'
  );
  const [isItalic, setIsItalic] = useWidgetSetting(
    widget,
    'properties.fontSettings.isItalic'
  );
  const [isUnderlined, setIsUnderlined] = useWidgetSetting(
    widget,
    'properties.fontSettings.isUnderlined'
  );
  const [fontSize = DEFAULT_FONT_SIZE, setFontSize] = useWidgetSetting(
    widget,
    'properties.fontSettings.fontSize'
  );
  const [isUrl, setIsUrl] = useWidgetSetting(widget, 'properties.isUrl');
  const [_href, setHref] = useWidgetSetting(widget, 'properties.href');

  const { fontSettings: { fontColor } = defaultFontSettings } =
    widget.properties;

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
      setIsUrl(true);
      setHref(value);
      handleSetEdit(false);
    },
    filter,
  });
  useKeyPress('mod+b', {
    callback: () => {
      setIsBold((isBold) => !isBold);
    },
    filter,
  });
  useKeyPress('mod+i', {
    callback: () => {
      setIsItalic((isItalic) => !isItalic);
    },
    filter,
  });
  useKeyPress('mod+u', {
    callback: () => {
      setIsUnderlined((isUnderlined) => !isUnderlined);
    },
    filter,
  });
  useKeyPress('cmd+=', {
    callback: (e) => {
      e.stopPropagation();
      e.preventDefault();
      setFontSize((fontSize = DEFAULT_FONT_SIZE) => fontSize + 1);
    },
    filter,
  });
  useKeyPress('cmd+-', {
    callback: (e) => {
      e.stopPropagation();
      e.preventDefault();
      setFontSize((fontSize = DEFAULT_FONT_SIZE) => fontSize - 1);
    },
    filter,
  });

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder='Add text'
      style={style}
      className={className}
    />
  );
};
