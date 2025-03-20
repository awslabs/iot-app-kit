import { Toggle } from '@cloudscape-design/components';
import { SettingsGroup } from '~/features/widget-customization/atoms/settings-group';
import type { StyleSettingsComponentProps } from '~/features/widget-customization/types';
import { WidgetSetting } from '~/features/widget-customization/settings/widget-setting';
import { DecimalPlacesField } from '~/features/widget-customization/common/decimal-places-field';
import { TitleField } from '~/features/widget-customization/common/title-field';

export function StyleSettings({
  widget,
}: StyleSettingsComponentProps<'status-timeline'>) {
  return (
    <>
      <WidgetSetting
        widget={widget}
        settingPath='properties.title'
        render={({ settingValue: title, setSettingValue: setTitle }) => (
          <TitleField title={title} setTitle={setTitle} />
        )}
      />

      <SettingsGroup headerText='Format data'>
        <WidgetSetting
          widget={widget}
          settingPath='properties.significantDigits'
          render={({
            settingValue: decimalPlaces,
            setSettingValue: setDecimalPlaces,
          }) => (
            <DecimalPlacesField
              decimalPlaces={decimalPlaces}
              setDecimalPlaces={setDecimalPlaces}
            />
          )}
        />
      </SettingsGroup>

      <SettingsGroup headerText='Axis'>
        <WidgetSetting
          widget={widget}
          settingPath='properties.axis.showX'
          render={({
            settingValue: showX = true,
            setSettingValue: setShowX,
          }) => (
            <Toggle
              checked={showX}
              onChange={({ detail }) => setShowX(detail.checked)}
            />
          )}
        />
      </SettingsGroup>
    </>
  );
}
