/**
 * ONLY EXPORT THE PUBLIC API!
 *
 * carefully consider what should be part of the public API. Attempt to minimize the overall API surface area.
 */

export { RequestVideoUpload, VideoPlayer } from './components/video-player';
export { ResourceExplorer } from './components';
export { Table } from './components/table';
export { LineChart } from './components/line-chart';
export { BarChart } from './components/bar-chart';
export { ScatterChart } from './components/scatter-chart';
export { KPI } from './components/kpi/kpi';
export { Gauge } from './components/gauge/gauge';
export { StatusTimeline } from './components/status-timeline';
export { Status } from './components/status/status';
export { Tooltip } from './components/tooltip';
export { KnowledgeGraph } from './components/knowledge-graph';
export type {
  NodeData,
  EdgeData,
  IQueryData,
} from './components/knowledge-graph';

export { WebglContext } from '@iot-app-kit/charts';
export { TimeSync } from './components/time-sync';
export { TimeSelection } from './components/time-sync/timeSelection';
export { AppKitConfig } from './components/iot-app-kit-config';

export { useViewport } from './hooks/useViewport';
export { useTimeSeriesData } from './hooks/useTimeSeriesData';
export { useHasFeatureFlag } from './hooks/useHasFeatureFlag';
export { useGetConfigValue } from './store/index';

export { Chart } from './components/chart';

export { AnomalyChart } from './components/anomaly-chart';
export type {
  AnomalyChartWithData,
  AnomalyChartOptions,
  AnomalyChartDataSources,
  AnomalyChartDataSourceOption,
  AnomalyChartQueryOption,
} from './components/anomaly-chart/types';

export type {
  TableColumnDefinition,
  TableItem,
  TableItemRef,
} from './components/table';

export { formatDate } from './utils/time';

export {
  AlarmExplorer,
  AssetModelExplorer,
  AssetExplorer,
  AssetPropertyExplorer,
  TimeSeriesExplorer,
  type AlarmExplorerProps,
  type AssetModelExplorerProps,
  type AssetExplorerProps,
  type AssetPropertyExplorerProps,
  type TimeSeriesExplorerProps,
  type AlarmResource,
  type AssetPropertyResource,
  type AssetResource,
  type TimeSeriesResource,
  type AssetModelResource,
  type SelectionMode,
  resourceExplorerQueryClient,
} from './components/resource-explorers';

export { type TableResourceDefinition } from './components/resource-explorers/types/table';

export { type TimeSeriesResourceWithLatestValue } from './components/resource-explorers/types/resources';

export { type ResourceFieldFilterOperator } from './components/resource-explorers/types/common';

export type {
  AssistantProperty,
  AssistantActionEventDetail,
  AssistantActionType,
} from './common/assistantProps';
export { AssistantChatbot } from './components/assistant-chatbot';
export { useAssistant } from './hooks/useAssistant/useAssistant';
export { useAssistantContext } from './hooks/useAssistantContext/useAssistantContext';
export { MessageType } from './hooks/useAssistant/types';
export type {
  IMessage,
  IMessageParser,
  BaseStateManager,
} from './hooks/useAssistant/types';
export {
  SITUATION_SUMMARY_DEFAULT_UTTERANCE,
  EVENT_SUMMARY_DEFAULT_UTTERANCE,
} from './components/assistant-panels/constants';
