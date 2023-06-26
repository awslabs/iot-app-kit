import { ECElementEvent, EChartsOption, EChartsType, SeriesOption } from 'echarts';
import { DataStream } from '@iot-app-kit/charts-core';
import { StreamType } from '../../common/constants';
import { DataPoint } from '@iot-app-kit/core';
import {
  DEFAULT_MARGIN,
  tooltipColors,
  tooltipLineColor,
  tooltipNameHeight,
  tooltipNameWidth,
} from './eChartsConstants';
import { v4 as uuid } from 'uuid';

// specifically converts dataStreams to series for bar, scatter, line charts
export const dataStreamsToEChartSeries = (dataStreams: DataStream[], chartType: string): SeriesOption[] =>
  dataStreams
    .filter(({ streamType }) => streamType !== StreamType.ALARM) // need to filter out alarm streams. not supported in bar, scatter, line
    .map(
      (stream) =>
        ({
          name: stream.name ?? '',
          data: stream.data.map((point: DataPoint) => [point.x, point.y]),
          type: chartType,
          itemStyle: { color: stream.color } ?? {},
          lineStyle: { color: stream.color } ?? {},
        } as SeriesOption)
    );

export type GraphicInternal = { timestamp: number[] } & {
  children: Array<{ shape: { x1: number; x2: number; x: number } }>;
};

export type SeriesInternal = Array<{ data: Array<number[]> }>;

export const updatePositions = (option: EChartsOption, series: SeriesOption[], chart?: EChartsType) => {
  const graphic = option.graphic as GraphicInternal[];
  if (graphic?.length === 0) {
    return [];
  }
  const timestamps = new Set();

  (series as SeriesInternal).forEach((stream) => {
    stream.data.forEach((data) => {
      timestamps.add(data[0]);
    });
  });
  const timestampsArray = Array.from(timestamps);

  const widthPerTime = ((chart?.getWidth() ?? 0) - Number(DEFAULT_MARGIN) * 2) / (timestamps.size - 1);

  return graphic?.map((g) => {
    const index = timestampsArray.indexOf(g.timestamp[0]);
    const newX = widthPerTime * index + Number(DEFAULT_MARGIN);

    g.children[0].shape.x1 = newX;
    g.children[0].shape.x2 = newX;
    g.children[1].shape.x = newX - 30;
    return g;
  });
};

export const getToolTipGraphic = (
  e: ECElementEvent,
  length: number,
  chart?: EChartsType | undefined,
  size?: { width: number; height: number }
) => {
  return {
    id: `tooltip-${uuid()}`,
    action: '$merge',
    type: 'group',
    draggable: 'horizontal',
    timestamp: e.data as number[],
    children: [
      {
        type: 'line',
        id: `line-${uuid()}`,
        shape: {
          x1: (e.event?.offsetX ?? 0) - 1,
          x2: (e.event?.offsetX ?? 0) - 1,
          y1: Number(DEFAULT_MARGIN),
          y2: (chart?.getHeight() ?? size?.width ?? 0) - Number(DEFAULT_MARGIN),
        },
        style: {
          stroke: tooltipLineColor,
          lineWidth: 2,
        },
      },
      {
        type: 'rect',
        z: 1,
        id: `rect-${uuid()}`,
        shape: {
          x: (e.event?.offsetX ?? 0) - tooltipNameWidth / 2,
          y: Number(DEFAULT_MARGIN) - tooltipNameHeight,
          width: tooltipNameWidth,
          height: tooltipNameHeight,
        },
        style: {
          fill: tooltipColors[length],
        },
        textContent: { z: 2, style: { text: `SCOOTER ${length}`, fill: 'white', fontSize: 9 } },
        textConfig: { position: 'inside' },
      },
    ],
  };
};
