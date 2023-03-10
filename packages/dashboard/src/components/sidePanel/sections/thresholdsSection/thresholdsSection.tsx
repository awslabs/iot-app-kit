import React, { FC, MouseEventHandler } from 'react';
import { ExpandableSection, SelectProps, SpaceBetween, Toggle, ToggleProps } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../../shared/expandableSectionHeader';
import { COMPARISON_OPERATOR } from '@synchro-charts/core';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { DEFAULT_THRESHOLD_COLOR } from './defaultValues';
import { ThresholdComponent } from './thresholdComponent';
import { useWidgetLense } from '../../utils/useWidgetLense';
import { ThresholdSettings } from '~/customization/settings';
import { nanoid } from '@reduxjs/toolkit';

import './index.scss';

import {
  BarChartWidget,
  KPIWidget,
  LineChartWidget,
  ScatterChartWidget,
  StatusWidget,
  TableWidget,
} from '~/customization/widgets/types';
import { Widget } from '~/types';

export type ThresholdWidget =
  | KPIWidget
  | StatusWidget
  | LineChartWidget
  | ScatterChartWidget
  | BarChartWidget
  | TableWidget;

export const isThresholdsSupported = (widget: Widget): boolean =>
  ['iot-kpi', 'iot-status', 'iot-line', 'iot-scatter', 'iot-bar', 'iot-table'].some((t) => t === widget.type);

const widgetsSupportsContainOp: string[] = ['iot-kpi', 'iot-status', 'iot-table'];

const defaultMessages = {
  header: 'Thresholds',
  colorDataToggle: 'Apply threshold color across all data',
  containsLabel: 'Contains',
};

const ThresholdsSection: FC<ThresholdWidget> = (widget) => {
  const [thresholdSettings = { colorAcrossThresholds: false, thresholds: [] }, updateThresholds] = useWidgetLense<
    ThresholdWidget,
    ThresholdSettings | undefined
  >(
    widget,
    (w) => w.properties.thresholdSettings,
    (w, thresholdSettings) => ({
      ...w,
      properties: {
        ...w.properties,
        thresholdSettings,
      },
    })
  );

  const onAddNewThreshold: MouseEventHandler = (e) => {
    e.stopPropagation();
    const newThreshold: ThresholdSettings['thresholds'][number] = {
      id: nanoid(),
      color: DEFAULT_THRESHOLD_COLOR,
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      comparisonValue: '',
    };
    updateThresholds({
      ...thresholdSettings,
      thresholds: [...thresholdSettings.thresholds, newThreshold],
    });
  };

  const onDeleteThreshold = (threshold: ThresholdSettings['thresholds'][number]) => () => {
    updateThresholds({
      ...thresholdSettings,
      thresholds: thresholdSettings?.thresholds.filter((t) => t.id !== threshold.id) ?? [],
    });
  };

  const onCheckColorData: NonCancelableEventHandler<ToggleProps.ChangeDetail> = ({ detail: { checked } }) => {
    updateThresholds({ ...thresholdSettings, colorAcrossThresholds: checked });
  };

  const onUpdateThreshold = (updatedThreshold: ThresholdSettings['thresholds'][number]) => {
    updateThresholds({
      ...thresholdSettings,
      thresholds: thresholdSettings.thresholds.map((t) => (t.id === updatedThreshold.id ? updatedThreshold : t)),
    });
  };

  const onUpdateThresholdValue =
    (threshold: ThresholdSettings['thresholds'][number]) =>
    (comparisonValue: ThresholdSettings['thresholds'][number]['comparisonValue']) => {
      onUpdateThreshold({
        ...threshold,
        comparisonValue,
      });
    };

  const onUpdateComparisonOperator =
    (threshold: ThresholdSettings['thresholds'][number]) =>
    (comparisonOperator: ThresholdSettings['thresholds'][number]['comparisonOperator']) => {
      onUpdateThreshold({
        ...threshold,
        comparisonOperator,
      });
    };

  const onUpdateThresholdColor =
    (threshold: ThresholdSettings['thresholds'][number]) =>
    (color: ThresholdSettings['thresholds'][number]['color']) => {
      onUpdateThreshold({
        ...threshold,
        color,
      });
    };

  const comparisonOptions: SelectProps.Option[] = [
    { label: '>', value: COMPARISON_OPERATOR.GREATER_THAN },
    { label: '<', value: COMPARISON_OPERATOR.LESS_THAN },
    { label: '=', value: COMPARISON_OPERATOR.EQUAL },
    { label: '>=', value: COMPARISON_OPERATOR.GREATER_THAN_EQUAL },
    { label: '<=', value: COMPARISON_OPERATOR.LESS_THAN_EQUAL },
    {
      label: defaultMessages.containsLabel,
      value: COMPARISON_OPERATOR.CONTAINS,
      disabled: !widgetsSupportsContainOp.find((tag) => tag === widget.type),
    },
  ];

  const thresholdComponents = thresholdSettings?.thresholds.map((threshold) => {
    return (
      <ThresholdComponent
        key={threshold.id}
        threshold={threshold}
        comparisonOptions={comparisonOptions}
        onDelete={onDeleteThreshold(threshold)}
        onUpdateValue={onUpdateThresholdValue(threshold)}
        onUpdateComparisonOperator={onUpdateComparisonOperator(threshold)}
        onUpdateColor={onUpdateThresholdColor(threshold)}
      />
    );
  });
  return (
    <ExpandableSection
      headerText={
        <ExpandableSectionHeader onClickButton={onAddNewThreshold}>{defaultMessages.header}</ExpandableSectionHeader>
      }
      defaultExpanded
    >
      <SpaceBetween size='xs'>
        <Toggle checked={thresholdSettings?.colorAcrossThresholds ?? false} onChange={onCheckColorData}>
          {defaultMessages.colorDataToggle}
        </Toggle>
        {thresholdComponents}
      </SpaceBetween>
    </ExpandableSection>
  );
};

export default ThresholdsSection;
