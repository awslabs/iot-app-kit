import React from 'react';
import { type TableProps } from '@cloudscape-design/components/table';
import { isNumeric, round } from '@iot-app-kit/core-util';
import { DataStreamInformation, TrendCursor } from '../types';
import { DataStreamCell, DataStreamColumnHeader } from './datastream';
import { TrendCursorCell, TrendCursorColumnHeader } from './trendCursor';
import { MaximumColumnHeader, MaximumCell } from './maximumValue';
import { MinimumColumnHeader, MinimumCell } from './minimumValue';
import { ChartLegend, ChartOptions } from '../../../types';
import { LatestValueCell, LatestValueColumnHeader } from './latestValue';

type LegendTableColumnDefinitions =
  TableProps<DataStreamInformation>['columnDefinitions'];

const createDataStreamColumnDefinition = (
  width: number
): LegendTableColumnDefinitions[0] => ({
  id: 'Legends',
  sortingField: 'name',
  header: <DataStreamColumnHeader />,
  cell: (item) => <DataStreamCell {...item} width={width} />,
  isRowHeader: true,
});

const createMaximumColumnDefinition =
  (): LegendTableColumnDefinitions[number] => ({
    id: 'AssetName',
    sortingField: 'assetName',
    header: <MaximumColumnHeader />,
    cell: (item) => {
      return <MaximumCell {...item} />;
    },
    isRowHeader: true,
  });
const createLatestValueColumnDefinition = (
  significantDigits: ChartOptions['significantDigits']
): LegendTableColumnDefinitions[1] => ({
  id: 'Latest Value',
  sortingField: 'latestValue',
  header: <LatestValueColumnHeader />,
  cell: (item) => {
    const latestValue =
      item.latestValue && isNumeric(item.latestValue)
        ? round(item.latestValue, significantDigits)
        : item.latestValue;

    return <LatestValueCell {...item} latestValue={latestValue} />;
  },
  isRowHeader: true,
});

const createMinimumColumnDefinition =
  (): LegendTableColumnDefinitions[number] => ({
    id: 'AssetName',
    sortingField: 'assetName',
    header: <MinimumColumnHeader />,
    cell: (item) => {
      return <MinimumCell {...item} />;
    },
    isRowHeader: true,
  });

const createTrendCursorColumnDefinition = ({
  id: trendCursorId,
  color,
  date,
}: TrendCursor): LegendTableColumnDefinitions[number] => ({
  id: trendCursorId,
  header: <TrendCursorColumnHeader color={color} date={new Date(date)} />,
  sortingComparator: (a, b) => {
    const aValue = a.trendCursorValues[trendCursorId] ?? 0;
    const bValue = b.trendCursorValues[trendCursorId] ?? 0;
    return aValue - bValue;
  },
  cell: ({ id: datastreamId, trendCursorValues }) => {
    const cellOptions = {
      id: datastreamId,
      color,
      trendCursorValue: trendCursorValues[trendCursorId],
    };
    return <TrendCursorCell {...cellOptions} />;
  },
});

export const createTableLegendColumnDefinitions = ({
  trendCursors,
  width,
  visibleContent,
  significantDigits,
}: {
  trendCursors: TrendCursor[];
  width: number;
  visibleContent: ChartLegend['visibleContent'];
  significantDigits: ChartOptions['significantDigits'];
}) => {
  const trendCursorColumnDefinitions = trendCursors
    .sort((a, b) => a.date - b.date)
    .map(createTrendCursorColumnDefinition);

  return [
    createDataStreamColumnDefinition(width),
    ...(visibleContent?.maxValue ? [createMaximumColumnDefinition()] : []),
    ...(visibleContent?.minValue ? [createMinimumColumnDefinition()] : []),
    ...(visibleContent?.latestValue
      ? [createLatestValueColumnDefinition(significantDigits)]
      : []),
    ...trendCursorColumnDefinitions,
  ];
};
