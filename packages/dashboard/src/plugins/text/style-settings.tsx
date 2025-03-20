import { FormField, Toggle } from '@cloudscape-design/components';
import { SettingsGroup } from '~/features/widget-customization/atoms/settings-group';
import type { StyleSettingsComponentProps } from '~/features/widget-customization/types';
import { WidgetSetting } from '~/features/widget-customization/settings/widget-setting';
import { InputField } from '~/features/widget-customization/atoms/input-field';

export function StyleSettings({ widget }: StyleSettingsComponentProps<'text'>) {
  return (
    <>
      <SettingsGroup headerText='Text'>
        {/*
        <FormField label='Color'>
          <WidgetSetting
            widget={widget}
            settingPath='properties.fontSettings.fontColor'
            render={({
              settingValue: fontColor,
              setSettingValue: setFontColor,
            }) => <div>color picker</div>}
          />
        </FormField>

        <FormField label='Style'>
          <WidgetSetting
            widget={widget}
            settingPath='properties.fontSettings.isBold'
            render={({ settingValue: isBold, setSettingValue: setIsBold }) => (
              <div>isBold</div>
            )}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.fontSettings.isItalic'
            render={({
              settingValue: isItalic,
              setSettingValue: setIsItalic,
            }) => <div>isItalic</div>}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.fontSettings.isUnderlined'
            render={({
              settingValue: isUnderlined,
              setSettingValue: setIsUnderlined,
            }) => <div>isUnderlined</div>}
          />
        </FormField>

        <FormField label='Size'>
          <WidgetSetting
            widget={widget}
            settingPath='properties.fontSettings.fontSize'
            render={({
              settingValue: fontSize,
              setSettingValue: setFontSize,
            }) => <div>font size</div>}
          />
        </FormField>
        */}
      </SettingsGroup>

      <SettingsGroup
        headerText='Link'
        controls={
          <WidgetSetting
            widget={widget}
            settingPath='properties.isUrl'
            render={({
              settingValue: isUrl = false,
              setSettingValue: setIsUrl,
            }) => (
              <Toggle
                checked={isUrl}
                onChange={({ detail }) => setIsUrl(detail.checked)}
              >
                Create link
              </Toggle>
            )}
          />
        }
      >
        <FormField label='URL'>
          <WidgetSetting
            widget={widget}
            settingPath='properties.href'
            render={(setting) => <InputField {...setting} type='text' />}
          />
        </FormField>
      </SettingsGroup>
    </>
  );
}
