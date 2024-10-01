import React from 'react';
import { ChartOptions } from './types';
import { ChartStoreProvider } from './store';
import BaseChart from './baseChart';
import { useComponentId } from '../../hooks/useComponentId/useComponentId';
import { DEFAULT_CHART_SETTINGS } from './eChartsConstants';
import { AssistantWrapperPanel } from '../assistant-panels/assistantWrapperPanel';

export const Chart: React.FC<ChartOptions> = (options) => {
  const chartId = useComponentId(options.id);
  const chartOptions = { ...DEFAULT_CHART_SETTINGS, ...options };
  const { queries } = chartOptions;

  const component = (
    <ChartStoreProvider id={chartId}>
      <BaseChart {...chartOptions} id={chartId} />
    </ChartStoreProvider>
  );

  const [firstQuery] = queries;
  if (options.assistant && firstQuery) {
    options.assistant.componentId = chartId;
    return (
      <AssistantWrapperPanel
        width='min-content'
        assistant={options.assistant}
        componentType='chart'
      >
        {component}
      </AssistantWrapperPanel>
    );
  } else {
    return component;
  }
};
