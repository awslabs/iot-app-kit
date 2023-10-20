import Checkbox from '@cloudscape-design/components/checkbox';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Toggle from '@cloudscape-design/components/toggle';
import * as awsui from '@cloudscape-design/design-tokens';
import React from 'react';

import ColorPicker from '../shared/colorPicker';
import type { TextWidget } from '~/customization/widgets/types';

const fontSizeOptions = [8, 10, 12, 14, 16, 20, 24, 32, 48].map((size) => ({
  label: `${size} px`,
  value: `${size}`,
}));

type FontSettings = NonNullable<TextWidget['properties']['fontSettings']>;
type FontSetting<T extends keyof FontSettings> = FontSettings[T];

interface TextSettingsProps extends FontSettings, Pick<TextWidget['properties'], 'href' | 'isUrl'> {
  updateFontColor: (newValue: FontSetting<'fontColor'>) => void;
  toggleBold: (newValue: FontSetting<'isBold'>) => void;
  toggleItalic: (newValue: FontSetting<'isItalic'>) => void;
  toggleUnderlined: (newValue: FontSetting<'isUnderlined'>) => void;
  updateFontSize: (newValue: FontSetting<'fontSize'>) => void;
  updateHref: (newValue: string | undefined) => void;
  toggleIsUrl: (newValue: boolean | undefined) => void;
}

export function TextSettings({
  fontColor = awsui.colorTextBodyDefault,
  isBold = false,
  isItalic = false,
  isUnderlined = false,
  fontSize = 16,
  href = '',
  isUrl = false,
  updateFontColor,
  toggleBold,
  toggleItalic,
  toggleUnderlined,
  updateFontSize,
  updateHref,
  toggleIsUrl,
}: TextSettingsProps) {
  return (
    <>
      <FormField label='Text color'>
        <ColorPicker color={fontColor} updateColor={updateFontColor} />
      </FormField>

      <FormField label='Font style'>
        <SpaceBetween size='xxs' direction='vertical'>
          <Toggle checked={isBold} onChange={({ detail: { checked } }) => toggleBold(checked)}>
            Bold
          </Toggle>

          <Toggle checked={isItalic} onChange={({ detail: { checked } }) => toggleItalic(checked)}>
            Italicized
          </Toggle>

          <Toggle checked={isUnderlined} onChange={({ detail: { checked } }) => toggleUnderlined(checked)}>
            Underlined
          </Toggle>
        </SpaceBetween>
      </FormField>

      <FormField label='Font size'>
        <Select
          selectedOption={{ label: `${fontSize} px`, value: `${fontSize}` }}
          options={fontSizeOptions}
          onChange={({
            detail: {
              selectedOption: { value: updatedFontSize },
            },
          }) => {
            if (updatedFontSize) {
              updateFontSize(parseInt(updatedFontSize, 10));
            }
          }}
        />
      </FormField>

      <FormField label='URL'>
        <Toggle
          checked={isUrl}
          onChange={({ detail }) => {
            toggleIsUrl(detail.checked);
          }}
        >
          Create link
        </Toggle>

        {isUrl && <Input value={href} onChange={({ detail: { value: updatedHref } }) => updateHref(updatedHref)} />}
      </FormField>
    </>
  );
}
