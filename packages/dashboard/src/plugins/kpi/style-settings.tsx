import { FormField } from '@cloudscape-design/components';
import { Checkbox } from '../../features/widget-customization/atoms/checkbox';
import { AggregationField } from '../../features/widget-customization/common/aggregation/aggregation-field';
import { ResolutionField } from '../../features/widget-customization/common/aggregation/resolution-field';
import { SettingsGroup } from '../../features/widget-customization/atoms/settings-group';
import type { StyleSettingsComponentProps } from '../../features/widget-customization/types';
import { WidgetSetting } from '../../features/widget-customization/settings/widget-setting';
import { TitleField } from '../../features/widget-customization/common/title-field';
import { DecimalPlacesField } from '../../features/widget-customization/common/decimal-places-field';
import { DEFAULT_AGGREGATION } from './constants';

export function StyleSettings({ widget }: StyleSettingsComponentProps<'kpi'>) {
  console.log('StyleSettings received widget: ', widget);
  return (
    <>
      <WidgetSetting
        widget={widget}
        settingPath='properties.title'
        render={({ settingValue, setSettingValue }) => (
          <TitleField title={settingValue} setTitle={setSettingValue} />
        )}
      />

      <SettingsGroup headerText='Resolution and Aggregation'>
        <WidgetSetting
          widget={widget}
          settingPath='properties.queryConfig.query.requestSettings.resolution'
          render={({ settingValue, setSettingValue }) => (
            <ResolutionField
              resolution={settingValue}
              setResolution={setSettingValue}
            />
          )}
        />

        <WidgetSetting
          widget={widget}
          settingPath='properties.queryConfig.query.requestSettings.aggregationType'
          render={({ settingValue = DEFAULT_AGGREGATION, setSettingValue }) => (
            <AggregationField
              settingValue={settingValue}
              setSettingValue={setSettingValue}
            />
          )}
        />
      </SettingsGroup>

      <SettingsGroup headerText='Format data'>
        <WidgetSetting
          widget={widget}
          settingPath='properties.significantDigits'
          render={({ settingValue, setSettingValue }) => (
            <DecimalPlacesField
              decimalPlaces={settingValue}
              setDecimalPlaces={setSettingValue}
            />
          )}
        />
      </SettingsGroup>

      <SettingsGroup headerText='Display'>
        <FormField label='Display primary values'>
          <WidgetSetting
            widget={widget}
            settingPath='properties.showName'
            render={(setting) => (
              <Checkbox {...setting} label='Show property name' />
            )}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.showTimestamp'
            render={(setting) => (
              <Checkbox {...setting} label='Show timestamp' />
            )}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.showUnit'
            render={(setting) => <Checkbox {...setting} label='Show unit' />}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.showAggregationAndResolution'
            render={(setting) => (
              <Checkbox {...setting} label='Show aggregation & resolution' />
            )}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.showDataQuality'
            render={(setting) => (
              <Checkbox {...setting} label='Show data quality' />
            )}
          />
        </FormField>
      </SettingsGroup>
    </>
  );
}
