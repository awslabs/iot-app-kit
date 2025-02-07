import { FormField } from '@cloudscape-design/components';
import { Checkbox } from '~/features/widget-customization/atoms/checkbox';
import { AggregationField } from '~/features/widget-customization/common/aggregation/aggregation-field';
import { NumberField } from '~/features/widget-customization/atoms/number-input';
import { ResolutionField } from '~/features/widget-customization/common/aggregation/resolution-field';
import { SettingsGroup } from '~/features/widget-customization/atoms/settings-group';
import type { StyleSettingsComponentProps } from '~/features/widget-customization/types';
import { WidgetSetting } from '~/features/widget-customization/settings/widget-setting';
import { TitleField } from '~/features/widget-customization/common/title-field';
import { DecimalPlacesField } from '~/features/widget-customization/common/decimal-places-field';

export function StyleSettings({
  widget,
}: StyleSettingsComponentProps<'gauge'>) {
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
          settingPath='properties.queryConfig.query.requestSettings.resolution'
          render={({
            settingValue: resolution,
            setSettingValue: setResolution,
          }) => (
            <ResolutionField
              resolution={resolution}
              setResolution={setResolution}
            />
          )}
        />

        <WidgetSetting
          widget={widget}
          settingPath='properties.queryConfig.query.requestSettings.aggregationType'
          render={({
            settingValue: aggregationType,
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
            settingPath='properties.showUnit'
            render={({
              settingValue: showUnit,
              setSettingValue: setShowUnit,
            }) => (
              <Checkbox
                label='Show unit'
                settingValue={showUnit}
                setSettingValue={setShowUnit}
              />
            )}
          />
        </FormField>
      </SettingsGroup>

      <SettingsGroup headerText='Y-axis'>
        <FormField label='Range' description='Leave empty to auto calculate.'>
          <WidgetSetting
            widget={widget}
            settingPath='properties.yMin'
            render={({ settingValue: yMin = 0, setSettingValue: setYMin }) => (
              <NumberField
                label='Min'
                settingValue={yMin}
                setSettingValue={setYMin}
              />
            )}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.yMax'
            render={({
              settingValue: yMax = 100,
              setSettingValue: setYMax,
            }) => (
              <NumberField
                label='Max'
                settingValue={yMax}
                setSettingValue={setYMax}
              />
            )}
          />
        </FormField>
      </SettingsGroup>

      <SettingsGroup headerText='Fonts'>
        <WidgetSetting
          widget={widget}
          settingPath='properties.fontSize'
          render={({
            settingValue: fontSize = 40,
            setSettingValue: setFontSize,
          }) => (
            <NumberField
              label='Font size'
              settingValue={fontSize}
              setSettingValue={setFontSize}
              rules={{
                min: {
                  value: 1,
                  message: 'Font size must be greater than 0',
                },
              }}
            />
          )}
        />

        <WidgetSetting
          widget={widget}
          settingPath='properties.unitFontSize'
          render={({
            settingValue: unitFontSize = 16,
            setSettingValue: setUnitFontSize,
          }) => (
            <NumberField
              label='Unit font size'
              settingValue={unitFontSize}
              setSettingValue={setUnitFontSize}
              rules={{
                min: {
                  value: 1,
                  message: 'Font size must be greater than 0',
                },
              }}
            />
          )}
        />

        <WidgetSetting
          widget={widget}
          settingPath='properties.labelFontSize'
          render={({
            settingValue: labelFontSize = 16,
            setSettingValue: setLabelFontSize,
          }) => (
            <NumberField
              label='Labe font size'
              settingValue={labelFontSize}
              setSettingValue={setLabelFontSize}
              rules={{
                min: {
                  value: 1,
                  message: 'Font size must be greater than 0',
                },
              }}
            />
          )}
        />
      </SettingsGroup>
    </>
  );
}
