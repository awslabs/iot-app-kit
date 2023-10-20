import { ECharts, ElementEvent, SeriesOption } from 'echarts';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import {
  GraphicComponentElementOption,
  GraphicComponentGroupOption,
} from 'echarts/types/src/component/graphic/GraphicModel';
import { TrendCursorGroup } from '../../../../store/trendCusorSlice';
import { SizeConfig, ViewportInMs, Visualization } from '../../types';

export type InternalGraphicComponentGroupOption = {
  timestampInMs: number;
  yAxisMarkerValue: number[];
  dragDeltaInPixels?: number;
} & GraphicComponentGroupOption;

export interface TrendCursorProps {
  graphic: InternalGraphicComponentGroupOption[];
  size: SizeConfig;
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>;
  series: SeriesOption[];
  groupId?: string;
  visualization: Visualization;
  chartRef: MutableRefObject<ECharts | null>;
}

export interface UseEventsProps extends TrendCursorProps {
  isInCursorAddMode: boolean;
  isInSyncMode: boolean;
  onContextMenu: (e: ElementEvent) => void;
}

export interface UseSyncProps extends TrendCursorProps {
  isInSyncMode: boolean;
}

export interface UseTrendCursorsProps {
  chartRef: MutableRefObject<ECharts | null>;
  chartId?: string;
  onContextMenu: (e: ElementEvent) => void;
  initialGraphic?: InternalGraphicComponentGroupOption[];
  viewportInMs: ViewportInMs;
  series: SeriesOption[];
  groupId?: string;
  size: SizeConfig;
  visualization: Visualization;
}

export interface GetNewTrendCursorProps {
  e?: ElementEvent;
  size: SizeConfig;
  series: SeriesOption[];
  tcId?: string;
  x?: number;
  timestamp?: number;
  chartRef: MutableRefObject<ECharts | null>;
  visualization: Visualization;
}

export interface SyncChanges {
  graphic: InternalGraphicComponentGroupOption[];
  syncedTrendCursors?: TrendCursorGroup;
}

export interface ondragUpdateGraphicProps {
  graphic: InternalGraphicComponentGroupOption;
  posX: number;
  timeInMs: number;
  size: SizeConfig;
  series: SeriesOption[];
  chartRef: MutableRefObject<ECharts | null>;
  visualization: Visualization;
}

export interface ondragUpdateTrendCursorElementsProps {
  elements: GraphicComponentElementOption[];
  trendCursorsSeriesMakersInPixels: number[];
  timeInMs: number;
}
