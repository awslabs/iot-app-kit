import {
  DEFAULT_THRESHOLD_COLOR,
  ThresholdItem,
} from '~/features/widget-customization/common/thresholds/threshold-item';
import type { ThresholdSettingsComponentProps } from '~/features/widget-customization/types';
import { WidgetSetting } from '~/features/widget-customization/settings/widget-setting';
import clone from 'lodash-es/cloneDeep';
import { Button, FormField, Toggle } from '@cloudscape-design/components';
import type { Threshold } from '@iot-app-kit/core';
import { nanoid } from '@reduxjs/toolkit';
import { SettingsGroup } from '~/features/widget-customization/atoms/settings-group';
import { Select } from '~/features/widget-customization/atoms/select';

export function ThresholdSettings({
  widget,
}: ThresholdSettingsComponentProps<'kpi'>) {
  return (
    <>
      <SettingsGroup headerText='Thresholds'>
        <WidgetSetting
          widget={widget}
          settingPath='properties.thresholds'
          render={({
            settingValue: thresholds = [],
            setSettingValue: setThresholds,
          }) => (
            <Toggle
              checked={
                thresholds[0] && !thresholds[0].visible && !thresholds[0].fill
              }
              onChange={({ detail }) => {
                setThresholds((currentThresholds = []) =>
                  currentThresholds.map((t) => ({
                    ...t,
                    visible: detail.checked,
                    fill: t.fill,
                  }))
                );
              }}
            >
              Hide all thresholds
            </Toggle>
          )}
        />

        <WidgetSetting
          widget={widget}
          settingPath='properties.thresholds'
          render={({
            settingValue: thresholds = [],
            setSettingValue: setThresholds,
          }) => {
            return (
              <>
                {thresholds.map((threshold) => {
                  return (
                    <ThresholdItem
                      comparisonOperator={threshold.comparisonOperator}
                      setComparisonOperator={(updatedComparisonOperator) => {
                        setThresholds((currentThresholds = []) =>
                          currentThresholds.map((t) =>
                            t.id === threshold.id
                              ? {
                                  ...clone(t),
                                  comparisonOperator: updatedComparisonOperator,
                                }
                              : t
                          )
                        );
                      }}
                      value={threshold.value}
                      setValue={(updatedValue) => {
                        setThresholds((currentThresholds = []) =>
                          currentThresholds.map((t) =>
                            t.id === threshold.id
                              ? { ...clone(t), value: updatedValue }
                              : t
                          )
                        );
                      }}
                      color={threshold.color}
                      setColor={(updatedColor) => {
                        setThresholds((currentThresholds = []) =>
                          currentThresholds.map((t) =>
                            t.id === threshold.id
                              ? { ...clone(t), color: updatedColor }
                              : t
                          )
                        );
                      }}
                      onDelete={() => {
                        setThresholds((currentThresholds = []) =>
                          currentThresholds.filter((t) => t.id !== threshold.id)
                        );
                      }}
                    />
                  );
                })}

                <Button
                  onClick={() => {
                    const newThreshold = {
                      id: nanoid(),
                      comparisonOperator: 'EQ',
                      value: '',
                      color: DEFAULT_THRESHOLD_COLOR,
                    } satisfies Threshold;

                    setThresholds((currentThresholds = []) => [
                      ...currentThresholds,
                      newThreshold,
                    ]);
                  }}
                >
                  Add a threshold
                </Button>
              </>
            );
          }}
        />
      </SettingsGroup>

      <SettingsGroup headerText='Threshold style'>
        <WidgetSetting
          widget={widget}
          settingPath='properties.thresholds'
          render={({
            settingValue: thresholds = [],
            setSettingValue: setThresholds,
          }) => (
            <FormField label='Show thresholds'>
              <Select
                settingValue={
                  thresholds[0] && thresholds[0].fill === 'color'
                    ? { text: 'As filled widget', value: 'as-filled' }
                    : { text: 'As line', value: 'as-line' }
                }
                options={[
                  { text: 'As line', value: 'as-line' },
                  { text: 'As filled widget', value: 'as-filled' },
                ]}
                setSettingValue={(option) => {
                  setThresholds((currentThresholds = []) =>
                    currentThresholds.map((t) => ({
                      ...t,
                      visible: true,
                      fill: option.value === 'as-line' ? 'color' : undefined,
                    }))
                  );
                }}
              />
            </FormField>
          )}
        />
      </SettingsGroup>
    </>
  );
}
