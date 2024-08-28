import React, { useEffect } from 'react';
import { ChartOptions } from './types';
import { ChartStoreProvider } from './store';
import BaseChart from './baseChart';
import { useComponentId } from '../../hooks/useComponentId/useComponentId';
import { DEFAULT_CHART_SETTINGS } from './eChartsConstants';
import { ActionPanel } from '../assistant-action-panel/actionPanel';
import { useViewport } from '../../hooks/useViewport';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';

export const Chart: React.FC<ChartOptions> = (options) => {
  const chartId = useComponentId(options.id);
  const chartOptions = { ...DEFAULT_CHART_SETTINGS, ...options };
  const { queries } = chartOptions;
  const { viewport } = useViewport();
  const { setContextByComponent } = useAssistantContext();

  const component = (
    <ChartStoreProvider id={chartId}>
      <BaseChart {...chartOptions} id={chartId} />
    </ChartStoreProvider>
  );

  useEffect(() => {
    setContextByComponent(chartId, {
      timerange: viewport,
      queries: queries.map((query) => query.toQueryString()).join(''),
    });
  }, [viewport, queries]);

  const [firstQuery] = queries;
  if (options.assistant && firstQuery) {
    return (
      <ActionPanel
        width='min-content'
        componentId={chartId}
        assistant={options.assistant}
      >
        {component}
      </ActionPanel>
    );
  } else {
    return component;
  }
};
