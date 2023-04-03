import type { FC, MouseEventHandler } from 'react';
import React, { useState } from 'react';
import type { SelectProps, ToggleProps } from '@cloudscape-design/components';
import { ExpandableSection, SpaceBetween, Toggle } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../../shared/expandableSectionHeader';
import { DEFAULT_THRESHOLD_COLOR } from './defaultValues';
import { ThresholdComponent } from './thresholdComponent';
import { useWidgetLense } from '../../utils/useWidgetLense';
import { nanoid } from '@reduxjs/toolkit';
import type {
  BarChartWidget,
  KPIWidget,
  LineChartWidget,
  ScatterChartWidget,
  StatusWidget,
  TableWidget,
} from '~/customization/widgets/types';
import type { DashboardWidget } from '~/types';
import type { ThresholdWithId } from '~/customization/settings';
import { COMPARISON_OPERATOR, ThresholdSettings } from '@iot-app-kit/core';
import { isEmpty } from 'lodash';

export type ThresholdWidget =
  | KPIWidget
  | StatusWidget
  | LineChartWidget
  | ScatterChartWidget
  | BarChartWidget
  | TableWidget;

type AnnotationWidget = LineChartWidget | ScatterChartWidget | BarChartWidget;

export const isThresholdsSupported = (widget: DashboardWidget): widget is ThresholdWidget =>
  ['kpi', 'status', 'line-chart', 'scatter-chart', 'status-timeline', 'bar-chart', 'table'].some(
    (t) => t === widget.type
  );

const isAnnotationsSupported = (widget: DashboardWidget): widget is AnnotationWidget =>
  ['line-chart', 'scatter-chart', 'bar-chart'].some((t) => t === widget.type);

const widgetsSupportsContainOp: string[] = ['kpi', 'status', 'table'];

const defaultMessages = {
  header: 'Thresholds',
  colorDataToggle: 'Apply threshold color across all data',
  containsLabel: 'Contains',
};

const ThresholdsSection: FC<ThresholdWidget> = (widget) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [thresholds = [], updateThresholds] = useWidgetLense<ThresholdWidget, ThresholdWithId[] | undefined>(
    widget,
    (w) => w.properties.thresholds,
    (w, thresholds) => ({
      ...w,
      properties: {
        ...w.properties,
        thresholds,
      },
    })
  );

  const [thresholdSettings, updateThresholdSettings] = useWidgetLense<AnnotationWidget, ThresholdSettings | undefined>(
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
    !isExpanded && setIsExpanded(true);
    const newThreshold: ThresholdWithId = {
      value: '',
      id: nanoid(),
      color: DEFAULT_THRESHOLD_COLOR,
      comparisonOperator: `EQ`,
    };
    updateThresholds([...thresholds, newThreshold]);
  };

  const onDeleteThreshold = (threshold: ThresholdWithId) => () => {
    updateThresholds(thresholds.filter((t) => t.id !== threshold.id));
  };

  const onCheckColorData: ToggleProps['onChange'] = ({ detail: { checked } }) => {
    updateThresholdSettings({ ...thresholdSettings, colorBreachedData: checked });
  };

  const onUpdateThreshold = (updatedThreshold: ThresholdWithId) => {
    updateThresholds(
      thresholds.map((t) => {
        if (t.id === updatedThreshold.id) {
          return updatedThreshold;
        }
        return t;
      })
    );
  };

  const onUpdateThresholdValue = (threshold: ThresholdWithId) => (value: ThresholdWithId['value']) => {
    onUpdateThreshold({
      ...threshold,
      value,
    });
  };
  const onUpdateComparisonOperator =
    (threshold: ThresholdWithId) => (comparisonOperator: ThresholdWithId['comparisonOperator']) => {
      onUpdateThreshold({
        ...threshold,
        comparisonOperator,
      });
    };

  const onUpdateThresholdColor = (threshold: ThresholdWithId) => (color: ThresholdWithId['color']) => {
    onUpdateThreshold({
      ...threshold,
      color,
    });
  };

  const comparisonOptions: SelectProps.Option[] = [
    { label: '>', value: COMPARISON_OPERATOR.GT },
    { label: '<', value: COMPARISON_OPERATOR.LT },
    { label: '=', value: COMPARISON_OPERATOR.EQ },
    { label: '>=', value: COMPARISON_OPERATOR.GTE },
    { label: '<=', value: COMPARISON_OPERATOR.LTE },
    {
      label: defaultMessages.containsLabel,
      value: COMPARISON_OPERATOR.CONTAINS,
      disabled: !widgetsSupportsContainOp.find((tag) => tag === widget.type),
    },
  ];

  const thresholdComponents = thresholds.map((threshold) => {
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
      expanded={isExpanded}
      onChange={(event) => setIsExpanded(event.detail.expanded)}
    >
      <SpaceBetween size='m' direction='vertical'>
        {isAnnotationsSupported(widget) && !isEmpty(thresholds) && (
          <Toggle checked={thresholdSettings?.colorBreachedData ?? true} onChange={onCheckColorData}>
            {defaultMessages.colorDataToggle}
          </Toggle>
        )}
        <SpaceBetween size='m' direction='vertical'>
          {thresholdComponents}
        </SpaceBetween>
      </SpaceBetween>
    </ExpandableSection>
  );
};

export default ThresholdsSection;
