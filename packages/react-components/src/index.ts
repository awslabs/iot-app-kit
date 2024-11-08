import './load-synchro-charts';

/**
 * ONLY EXPORT THE PUBLIC API!
 *
 * carefully consider what should be part of the public API. Attempt to minimize the overall API surface area.
 */

export { BarChart } from './components/bar-chart';
export { Gauge } from './components/gauge/gauge';
export { KnowledgeGraph } from './components/knowledge-graph';
export type {
  EdgeData,
  IQueryData,
  NodeData,
} from './components/knowledge-graph';
export { KPI } from './components/kpi/kpi';
export { LineChart } from './components/line-chart';
export { ScatterChart } from './components/scatter-chart';
export { StatusTimeline } from './components/status-timeline';
export { Status } from './components/status/status';
export { Table } from './components/table';
export { Tooltip } from './components/tooltip';
export { RequestVideoUpload, VideoPlayer } from './components/video-player';

export { WebglContext } from '@iot-app-kit/charts';
export { AppKitConfig } from './components/iot-app-kit-config';
export { TimeSync } from './components/time-sync';
export { TimeSelection } from './components/time-sync/timeSelection';

export { useHasFeatureFlag } from './hooks/useHasFeatureFlag';
export { useTimeSeriesData } from './hooks/useTimeSeriesData';
export { useViewport } from './hooks/useViewport';
export { useGetConfigValue } from './store/index';

export { Chart } from './components/chart';

export { AnomalyChart } from './components/anomaly-chart';
export type {
  AnomalyChartDataSourceOption,
  AnomalyChartDataSources,
  AnomalyChartOptions,
  AnomalyChartQueryOption,
  AnomalyChartWithData,
} from './components/anomaly-chart/types';

export type {
  TableColumnDefinition,
  TableItem,
  TableItemRef,
} from './components/table';

export { formatDate } from './utils/time';

export {
  AlarmExplorer,
  AssetExplorer,
  AssetModelExplorer,
  AssetPropertyExplorer,
  TimeSeriesExplorer,
  resourceExplorerQueryClient,
  type AlarmExplorerProps,
  type AlarmResource,
  type AssetExplorerProps,
  type AssetModelExplorerProps,
  type AssetModelResource,
  type AssetPropertyExplorerProps,
  type AssetPropertyResource,
  type AssetResource,
  type SelectionMode,
  type TimeSeriesExplorerProps,
  type TimeSeriesResource,
} from './components/resource-explorers';

export { type TableResourceDefinition } from './components/resource-explorers/types/table';

export { type TimeSeriesResourceWithLatestValue } from './components/resource-explorers/types/resources';

export { type ResourceFieldFilterOperator } from './components/resource-explorers/types/common';

export type {
  AssistantActionEventDetail,
  AssistantActionTarget,
  AssistantActionType,
  AssistantProperty,
  AssistantWidgetTypes,
} from './common/assistantProps';
export { AssistantChatbot } from './components/assistant-chatbot';
export {
  EVENT_SUMMARY_DEFAULT_UTTERANCE,
  SITUATION_SUMMARY_DEFAULT_UTTERANCE,
} from './components/assistant-panels/constants';
export { MessageType } from './hooks/useAssistant/types';
export type {
  AssistantAction,
  IMessage,
  IMessageParser,
} from './hooks/useAssistant/types';
export { useAssistant } from './hooks/useAssistant/useAssistant';
export { useAssistantContext } from './hooks/useAssistantContext/useAssistantContext';
