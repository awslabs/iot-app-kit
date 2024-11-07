import { useComponentId } from '../../hooks/useComponentId/useComponentId';
import { AssistantWrapperPanel } from '../assistant-panels/assistantWrapperPanel';
import BaseChart from './baseChart';
import { DEFAULT_CHART_SETTINGS } from './eChartsConstants';
import { ChartStoreProvider } from './store';
import { type ChartOptions } from './types';

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
