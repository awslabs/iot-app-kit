import type { FC, MouseEventHandler, ReactNode } from 'react';
import React from 'react';
import type { NonCancelableCustomEvent, SelectProps } from '@cloudscape-design/components';
import { ExpandableSection, Select, SpaceBetween } from '@cloudscape-design/components';
import * as awsui from '@cloudscape-design/design-tokens';
import ColorPicker from '../shared/colorPicker';

import type { TextWidget } from '~/customization/widgets/types';

import './text.css';

interface ButtonWithStateProps {
  checked: boolean;
  onToggle: MouseEventHandler;
  children: ReactNode;
}

const ButtonWithState: FC<ButtonWithStateProps> = ({
  checked,
  children,
  onToggle,
  ...others // passing other attributes like data-test-id
}) => {
  return (
    <button
      role='checkbox'
      aria-checked={checked}
      {...others}
      className={`text-button-toggle ${checked ? 'checked' : ''}`}
      onClick={onToggle}
    >
      {children}
    </button>
  );
};

const fontSizeOptions = [8, 10, 12, 14, 16, 20, 24, 32, 48].map((size) => ({
  label: `${size} px`,
  value: `${size}`,
}));

const defaultMessages = {
  title: 'Text',
  font: 'Font',
  color: 'Color',
  style: 'Style',
  size: 'Size',
  horizontal: 'Horizontal',
  vertical: 'Vertical',
};

type FontSettings = NonNullable<TextWidget['properties']['fontSettings']>;
type FontSetting<T extends keyof FontSettings> = FontSettings[T];

type TextSettingsProps = FontSettings & {
  updateFontColor: (newValue: FontSetting<'fontColor'>) => void;
  toggleBold: (newValue: FontSetting<'isBold'>) => void;
  toggleItalic: (newValue: FontSetting<'isItalic'>) => void;
  toggleUnderlined: (newValue: FontSetting<'isUnderlined'>) => void;
  updateFontSize: (newValue: FontSetting<'fontSize'>) => void;
};

const TextSettings: FC<TextSettingsProps> = ({
  fontColor = awsui.colorTextBodyDefault,
  updateFontColor,
  isBold = false,
  toggleBold,
  isItalic = false,
  toggleItalic,
  isUnderlined = false,
  toggleUnderlined,
  fontSize = 16,
  updateFontSize,
}) => {
  const onFontSizeChange = ({
    detail: {
      selectedOption: { value },
    },
  }: NonCancelableCustomEvent<SelectProps.ChangeDetail>) => {
    if (value) {
      updateFontSize(parseInt(value, 10));
    }
  };

  return (
    <ExpandableSection headerText={defaultMessages.title} defaultExpanded>
      <div className='text-configuration' style={{ gap: awsui.spaceScaledS }}>
        <label>{defaultMessages.color}</label>
        <ColorPicker color={fontColor} updateColor={updateFontColor} />

        <label>{defaultMessages.style}</label>
        <SpaceBetween size='xxs' direction='horizontal'>
          <ButtonWithState aria-label='toggle bold text' checked={isBold} onToggle={() => toggleBold(!isBold)}>
            <b>B</b>
          </ButtonWithState>
          <ButtonWithState
            aria-label='toggle italicize text'
            checked={isItalic}
            onToggle={() => toggleItalic(!isItalic)}
          >
            <i>I</i>
          </ButtonWithState>
          <ButtonWithState
            aria-label='toggle underline text'
            checked={isUnderlined}
            onToggle={() => toggleUnderlined(!isUnderlined)}
          >
            <u>U</u>
          </ButtonWithState>
        </SpaceBetween>

        <label>{defaultMessages.size}</label>
        <Select
          selectedOption={{ label: `${fontSize} px`, value: `${fontSize}` }}
          options={fontSizeOptions}
          onChange={onFontSizeChange}
          ariaLabel='dropdown font size'
          data-test-id='text-widget-setting-font-size'
        />
      </div>
    </ExpandableSection>
  );
};

export default TextSettings;
