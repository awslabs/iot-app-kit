import { DecimalPlacesField } from '~/features/widget-customization/common/decimal-places-field';
import { SettingsGroup } from '~/features/widget-customization/atoms/settings-group';
import type { StyleSettingsComponentProps } from '~/features/widget-customization/types';
import { WidgetSetting } from '~/features/widget-customization/settings/widget-setting';
import { TitleField } from '~/features/widget-customization/common/title-field';
import type { TABLE_WIDGET_TYPE } from './constants';

export function StyleSettings({
  widget,
}: StyleSettingsComponentProps<typeof TABLE_WIDGET_TYPE>) {
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
    </>
  );
}
