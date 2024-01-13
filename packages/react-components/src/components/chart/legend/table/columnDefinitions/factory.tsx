import React from 'react';
import { type TableProps } from '@cloudscape-design/components/table';
import { DataStreamInformation, TrendCursor } from '../types';
import { DataStreamCell, DataStreamColumnHeader } from './datastream';
import { TrendCursorCell, TrendCursorColumnHeader } from './trendCursor';

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
}: {
  trendCursors: TrendCursor[];
  width: number;
}) => {
  const trendCursorColumnDefinitions = trendCursors
    .sort((a, b) => a.date - b.date)
    .map(createTrendCursorColumnDefinition);

  return [
    createDataStreamColumnDefinition(width),
    ...trendCursorColumnDefinitions,
  ];
};
