import { FormField, Input, Toggle } from '@cloudscape-design/components';
import { AggregationField } from '~/features/widget-customization/common/aggregation/aggregation-field';
import { ResolutionField } from '~/features/widget-customization/common/aggregation/resolution-field';
import { SettingsGroup } from '~/features/widget-customization/atoms/settings-group';
import type { StyleSettingsComponentProps } from '~/features/widget-customization/types';
import { WidgetSetting } from '~/features/widget-customization/settings/widget-setting';
import { TitleField } from '~/features/widget-customization/common/title-field';
import { DecimalPlacesField } from '~/features/widget-customization/common/decimal-places-field';
import type { BAR_CHART_WIDGET_TYPE } from './constants';

export function StyleSettings({
  widget,
}: StyleSettingsComponentProps<typeof BAR_CHART_WIDGET_TYPE>) {
  return (
    <>
      <WidgetSetting
        widget={widget}
        settingPath='properties.title'
        render={({ settingValue: title, setSettingValue: setTitle }) => (
          <TitleField title={title} setTitle={setTitle} />
        )}
      />

      <SettingsGroup headerText='Resolution and Aggregation'>
        <WidgetSetting
          widget={widget}
          settingPath='properties.resolution'
          render={({
            settingValue: resolution,
            setSettingValue: setResolution,
          }) => (
            <ResolutionField
              resolution={resolution}
              setResolution={setResolution}
              excludeRaw
            />
          )}
        />

        <WidgetSetting
          widget={widget}
          settingPath='properties.aggregationType'
          render={({
            settingValue: aggregationType = 'AVERAGE',
            setSettingValue: setAggregationType,
          }) => (
            <AggregationField
              settingValue={aggregationType}
              setSettingValue={setAggregationType}
            />
          )}
        />
      </SettingsGroup>

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
            >
              View X axis
            </Toggle>
          )}
        />

        <WidgetSetting
          widget={widget}
          settingPath='properties.axis.showY'
          render={({
            settingValue: showY = true,
            setSettingValue: setShowY,
          }) => (
            <Toggle
              checked={showY}
              onChange={({ detail }) => setShowY(detail.checked)}
            >
              View Y axis
            </Toggle>
          )}
        />

        <WidgetSetting
          widget={widget}
          settingPath='properties.axis.yAxisLabel'
          render={({
            settingValue: yAxisLabel = '',
            setSettingValue: setYAxisLabel,
          }) => (
            <FormField label='Y axis label'>
              <Input
                value={yAxisLabel}
                onChange={({ detail }) => setYAxisLabel(detail.value)}
              />
            </FormField>
          )}
        />
      </SettingsGroup>
    </>
  );
}
