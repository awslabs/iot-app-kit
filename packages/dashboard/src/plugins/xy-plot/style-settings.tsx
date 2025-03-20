import { FormField, Input } from '@cloudscape-design/components';
import { Checkbox } from '~/features/widget-customization/atoms/checkbox';
import { AggregationField } from '~/features/widget-customization/common/aggregation/aggregation-field';
import { NumberField } from '~/features/widget-customization/atoms/number-input';
import { ResolutionField } from '~/features/widget-customization/common/aggregation/resolution-field';
import { SettingsGroup } from '~/features/widget-customization/atoms/settings-group';
import type { StyleSettingsComponentProps } from '~/features/widget-customization/types';
import { WidgetSetting } from '~/features/widget-customization/settings/widget-setting';
import { DecimalPlacesField } from '~/features/widget-customization/common/decimal-places-field';
import { TitleField } from '~/features/widget-customization/common/title-field';
import type { XY_PLOT_WIDGET_TYPE } from './constants';

export function StyleSettings({
  widget,
}: StyleSettingsComponentProps<typeof XY_PLOT_WIDGET_TYPE>) {
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

      <SettingsGroup headerText='Axis'>
        <WidgetSetting
          widget={widget}
          settingPath='properties.axis.yLabel'
          render={({
            settingValue: yLabel = '',
            setSettingValue: setYLabel,
          }) => (
            <FormField label='Label'>
              <Input
                value={yLabel}
                onChange={({ detail }) => setYLabel(detail.value)}
                placeholder='Input Y-axis label'
              />
            </FormField>
          )}
        />

        <FormField label='Range' description='Leave empty to auto calculate.'>
          <WidgetSetting
            widget={widget}
            settingPath='properties.axis.yMin'
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
            settingPath='properties.axis.yMax'
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

      {/*
      <SettingsGroup headerText='WidgetStyle'>
        <WidgetSetting
          widget={widget}
          settingPath='properties.line.connectionStyle'
          render={({
            settingValue: lineType,
            setSettingValue: setLineType,
          }) => <div>line type</div>}
        />

        <WidgetSetting
          widget={widget}
          settingPath='properties.line.style'
          render={({
            settingValue: lineStyle,
            setSettingValue: setLineStyle,
          }) => <div>line style</div>}
        />

        <WidgetSetting
          widget={widget}
          settingPath='properties.line.thickness'
          render={({
            settingValue: lineThickness,
            setSettingValue: setLineThickness,
          }) => <div>line thickness</div>}
        />

        <WidgetSetting
          widget={widget}
          settingPath='properties.symbol.style'
          render={({
            settingValue: dataPointShape,
            setSettingValue: setDataPointShape,
          }) => <div>data point shape</div>}
        />
      </SettingsGroup>
      */}

      <SettingsGroup headerText='Legend'>
        {/*
        <WidgetSetting
          widget={widget}
          settingPath='properties.legend.position'
          render={({
            settingValue: alignment,
            setSettingValue: setAlignment,
          }) => <FormField label='Alignment'></FormField>}
        />
        */}

        <FormField label='Display'>
          <WidgetSetting
            widget={widget}
            settingPath='properties.legend.visibleContent.unit'
            render={({
              settingValue: showUnit,
              setSettingValue: setShowUnit,
            }) => (
              <Checkbox
                label='Unit'
                settingValue={showUnit}
                setSettingValue={setShowUnit}
              />
            )}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.legend.visibleContent.asset'
            render={({
              settingValue: showAssetName,
              setSettingValue: setShowAssetName,
            }) => (
              <Checkbox
                label='Asset name'
                settingValue={showAssetName}
                setSettingValue={setShowAssetName}
              />
            )}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.legend.visibleContent.maxValue'
            render={({
              settingValue: showMaxValue,
              setSettingValue: setShowMaxValue,
            }) => (
              <Checkbox
                label='Maximum value'
                settingValue={showMaxValue}
                setSettingValue={setShowMaxValue}
              />
            )}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.legend.visibleContent.minValue'
            render={({
              settingValue: showMinValue,
              setSettingValue: setShowMinValue,
            }) => (
              <Checkbox
                label='Minimum value'
                settingValue={showMinValue}
                setSettingValue={setShowMinValue}
              />
            )}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.legend.visibleContent.latestValue'
            render={({
              settingValue: showLatestValue,
              setSettingValue: setShowLatestValue,
            }) => (
              <Checkbox
                label='Latest value'
                settingValue={showLatestValue}
                setSettingValue={setShowLatestValue}
              />
            )}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.legend.visibleContent.latestAlarmStateValue'
            render={({
              settingValue: showLatestAlarmStateValue,
              setSettingValue: setShowLatestAlarmStateValue,
            }) => (
              <Checkbox
                label='Latest alarm state value'
                settingValue={showLatestAlarmStateValue}
                setSettingValue={setShowLatestAlarmStateValue}
              />
            )}
          />

          <WidgetSetting
            widget={widget}
            settingPath='properties.legend.visibleContent.unit'
            render={({
              settingValue: showUnit,
              setSettingValue: setShowUnit,
            }) => (
              <Checkbox
                label='Unit'
                settingValue={showUnit}
                setSettingValue={setShowUnit}
              />
            )}
          />
        </FormField>
      </SettingsGroup>
    </>
  );
}
