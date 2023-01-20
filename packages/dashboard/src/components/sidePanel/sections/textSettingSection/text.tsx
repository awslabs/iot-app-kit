import React, { FC, MouseEventHandler } from 'react';
import { DashboardMessages } from '../../../../messages';
import { useTextWidgetInput } from '../../utils';
import { ExpandableSection, Grid, Select, SelectProps } from '@cloudscape-design/components';
import ColorPicker from '../../shared/colorPicker';
import { fontFamilyBase, fontFamilyMonospace } from '@cloudscape-design/design-tokens';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import './index.scss';

export type TextComponentProps = {
  messageOverride: DashboardMessages;
};

const ButtonWithState: FC<{ checked: boolean; onToggle: MouseEventHandler }> = ({ checked, children, onToggle }) => {
  return (
    <div className={`text-style-button ${checked ? 'checked' : ''}`} onClick={onToggle}>
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

const TextSettings: FC<TextComponentProps> = ({ messageOverride }) => {
  const {
    sidePanel: { textSettings },
  } = messageOverride;
  const [font = 'unset', updateFont] = useTextWidgetInput('font');
  const [color = '#000000', updateColor] = useTextWidgetInput('color');
  const [bold = false, toggleBold] = useTextWidgetInput('bold');
  const [italic = false, toggleItalic] = useTextWidgetInput('italic');
  const [underline = false, toggleUnderline] = useTextWidgetInput('underline');
  const fontOptions: SelectProps.Options = Object.keys(fontLabelMap).map((font) => ({
    label: getFontLabel(fontLabelMap[font]),
    value: font,
  }));
  const onFontChange: NonCancelableEventHandler<SelectProps.ChangeDetail> = ({
    detail: {
      selectedOption: { value },
    },
  }) => {
    updateFont(value);
  };

  return (
    <ExpandableSection headerText={textSettings.title} defaultExpanded>
      <Grid gridDefinition={[{ colspan: 2 }, { colspan: 4 }, { colspan: 2 }, { colspan: 4 }]}>
        <label className="section-item-label">{textSettings.font}</label>
        <Select
          selectedOption={{ label: getFontLabel(font), value: font }}
          options={fontOptions}
          onChange={onFontChange}
        />
        <label className="section-item-label">{textSettings.color}</label>
        <div className="grid-content-align-item-center">
          <ColorPicker color={color} updateColor={updateColor} />
        </div>
      </Grid>
      <Grid gridDefinition={[{ colspan: 2 }, { colspan: 4 }, { colspan: 2 }, { colspan: 4 }]}>
        <label className="section-item-label">{textSettings.style}</label>
        <div className="text-setting-style-button-container">
          <ButtonWithState checked={bold} onToggle={() => toggleBold(!bold)}>
            <b>B</b>
          </ButtonWithState>
          <ButtonWithState checked={italic} onToggle={() => toggleItalic(!italic)}>
            <i>I</i>
          </ButtonWithState>
          <ButtonWithState checked={underline} onToggle={() => toggleUnderline(!underline)}>
            <u>U</u>
          </ButtonWithState>
        </div>
        <label className="section-item-label">{textSettings.size}</label>
        <Select selectedOption={null} disabled />
      </Grid>

      <Grid gridDefinition={[{ colspan: 2 }, { colspan: 4 }, { colspan: 2 }, { colspan: 4 }]}>
        <label className="section-item-label">{textSettings.horizontal}</label>
        <Select selectedOption={null} disabled />
        <label className="section-item-label">{textSettings.vertical}</label>
        <Select selectedOption={null} disabled />
      </Grid>

      <Grid gridDefinition={[{ colspan: 2 }, { colspan: 4 }, { colspan: 2 }, { colspan: 4 }]}></Grid>
    </ExpandableSection>
  );
};

export default TextSettings;
