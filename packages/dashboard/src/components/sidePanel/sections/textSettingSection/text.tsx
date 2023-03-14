import merge from 'lodash/merge';
import React from 'react';
import { ExpandableSection, Grid, Select } from '@cloudscape-design/components';
import { fontFamilyBase, fontFamilyMonospace } from '@cloudscape-design/design-tokens';
import ColorPicker from '../../shared/colorPicker';
import { useWidgetLense } from '../../utils/useWidgetLense';

import './index.css';
import type { FC, MouseEventHandler, ReactNode } from 'react';
import type { SelectProps } from '@cloudscape-design/components';
import type { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import type { DashboardMessages } from '~/messages';
import type { TextWidget } from '~/customization/widgets/types';

export type TextComponentProps = {
  messageOverride: DashboardMessages;
};

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
    <div {...others} className={`text-style-button${checked ? ' checked' : ''}`} onClick={onToggle}>
      {children}
    </div>
  );
};

const fontLabelMap: { [font: string]: string } = {
  [fontFamilyBase]: 'Base font',
  [fontFamilyMonospace]: 'Mono Space',
  unset: 'Unset',
};
const getFontLabel = (font: string) => {
  return fontLabelMap[font] || font;
};

const fontOptions = Object.keys(fontLabelMap).map((key) => ({
  label: getFontLabel(fontLabelMap[key]),
  value: fontLabelMap[key],
}));

const defaultMessages = {
  title: 'Text',
  font: 'Font',
  color: 'Color',
  style: 'Style',
  size: 'Size',
  horizontal: 'Horiz',
  vertical: 'Vertical',
};

const TextSettings: FC<TextWidget> = (widget) => {
  const [font = 'unset', updateFont] = useWidgetLense<TextWidget, string | undefined>(
    widget,
    (w) => w.properties.fontSettings?.fontFamily,
    (w, fontFamily) => merge(w, { properties: { fontSettings: { fontFamily } } })
  );

  const [color = '#000000', updateColor] = useWidgetLense<TextWidget, string | undefined>(
    widget,
    (w) => w.properties.fontSettings?.fontColor,
    (w, fontColor) => merge(w, { properties: { fontSettings: { fontColor } } })
  );

  const [bold = false, toggleBold] = useWidgetLense<TextWidget, boolean | undefined>(
    widget,
    (w) => w.properties.fontSettings?.isBold,
    (w, isBold) => merge(w, { properties: { fontSettings: { isBold } } })
  );

  const [italic = false, toggleItalic] = useWidgetLense<TextWidget, boolean | undefined>(
    widget,
    (w) => w.properties.fontSettings?.isItalic,
    (w, isItalic) => merge(w, { properties: { fontSettings: { isItalic } } })
  );

  const [underline = false, toggleUnderline] = useWidgetLense<TextWidget, boolean | undefined>(
    widget,
    (w) => w.properties.fontSettings?.isUnderlined,
    (w, isUnderlined) => merge(w, { properties: { fontSettings: { isUnderlined } } })
  );

  const onFontChange: NonCancelableEventHandler<SelectProps.ChangeDetail> = ({
    detail: {
      selectedOption: { value },
    },
  }) => {
    if (value) {
      updateFont(value);
    }
  };

  return (
    <ExpandableSection headerText={defaultMessages.title} defaultExpanded>
      <Grid gridDefinition={[{ colspan: 2 }, { colspan: 4 }, { colspan: 2 }, { colspan: 4 }]}>
        <label className='section-item-label'>{defaultMessages.font}</label>
        <div>
          <Select
            selectedOption={{ label: getFontLabel(font), value: font }}
            options={fontOptions}
            onChange={onFontChange}
            data-test-id='text-widget-setting-font-dropdown'
          />
        </div>
        <label className='section-item-label'>{defaultMessages.color}</label>
        <div className='grid-content-align-item-center'>
          <ColorPicker color={color} updateColor={updateColor} />
        </div>
      </Grid>
      <Grid gridDefinition={[{ colspan: 2 }, { colspan: 4 }, { colspan: 2 }, { colspan: 4 }]}>
        <label className='section-item-label'>{defaultMessages.style}</label>
        <div className='text-setting-style-button-container'>
          <ButtonWithState
            checked={bold}
            onToggle={() => toggleBold(!bold)}
            data-test-id='text-widget-setting-toggle-text-bold'
          >
            <b>B</b>
          </ButtonWithState>
          <ButtonWithState
            checked={italic}
            onToggle={() => toggleItalic(!italic)}
            data-test-id='text-widget-setting-toggle-text-italic'
          >
            <i>I</i>
          </ButtonWithState>
          <ButtonWithState
            checked={underline}
            onToggle={() => toggleUnderline(!underline)}
            data-test-id='text-widget-setting-toggle-text-underline'
          >
            <u>U</u>
          </ButtonWithState>
        </div>
        <label className='section-item-label'>{defaultMessages.size}</label>
        <div>
          <Select selectedOption={null} disabled data-test-id='text-widget-setting-font-size' />
        </div>
      </Grid>

      <Grid gridDefinition={[{ colspan: 2 }, { colspan: 4 }, { colspan: 2 }, { colspan: 4 }]}>
        <label className='section-item-label'>{defaultMessages.horizontal}</label>
        <Select selectedOption={null} disabled data-test-id='text-widget-setting-horizontal-align' />
        <label className='section-item-label'>{defaultMessages.vertical}</label>
        <Select selectedOption={null} disabled data-test-id='text-widget-setting-vertical-align' />
      </Grid>
    </ExpandableSection>
  );
};

export default TextSettings;
