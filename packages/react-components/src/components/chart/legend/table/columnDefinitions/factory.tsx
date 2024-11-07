import { type TableProps } from '@cloudscape-design/components/table';
import { isNumeric, round } from '@iot-app-kit/core-util';
import { type DataStreamInformation, type TrendCursor } from '../types';
import { DataStreamCell, DataStreamColumnHeader } from './datastream';
import { TrendCursorCell, TrendCursorColumnHeader } from './trendCursor';
import { MaximumColumnHeader, MaximumCell } from './maximumValue';
import { AssetNameCell, AssetNameColumnHeader } from './assetName';
import { MinimumColumnHeader, MinimumCell } from './minimumValue';
import { type ChartLegend, type ChartOptions } from '../../../types';
import { LatestValueCell, LatestValueColumnHeader } from './latestValue';
import {
  LEGEND_ASSET_NAME_COL_MAX_WIDTH,
  LEGEND_ASSET_NAME_COL_MIN_WIDTH,
} from '../../../eChartsConstants';
import {
  LatestAlarmStateValueCell,
  LatestAlarmStateValueColumnHeader,
} from './latestAlarmStateValue';

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
    id: 'MaxColumn',
    header: <MaximumColumnHeader />,
    cell: (item) => {
      return <MaximumCell {...item} />;
    },
    sortingComparator: (a, b) => {
      const aValue = typeof a.maxValue === 'number' ? a.maxValue : 0;
      const bValue = typeof b.maxValue === 'number' ? b.maxValue : 0;
      return aValue - bValue;
    },
  });

const createAssetNameColumnDefinition =
  (): LegendTableColumnDefinitions[1] => ({
    id: 'AssetName',
    sortingField: 'assetName',
    header: <AssetNameColumnHeader />,
    minWidth: LEGEND_ASSET_NAME_COL_MIN_WIDTH,
    maxWidth: LEGEND_ASSET_NAME_COL_MAX_WIDTH,
    cell: (item) => <AssetNameCell {...item} />,
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

const createLatestAlarmStateValueColumnDefinition =
  (): LegendTableColumnDefinitions[1] => ({
    id: 'Latest Alarm State Value',
    sortingField: 'latestAlarmStateValue',
    header: <LatestAlarmStateValueColumnHeader />,
    cell: (item) => {
      return (
        <LatestAlarmStateValueCell
          {...item}
          latestAlarmStateValue={item.latestAlarmStateValue}
        />
      );
    },
    isRowHeader: true,
  });

const createMinimumColumnDefinition =
  (): LegendTableColumnDefinitions[number] => ({
    id: 'MinColumn',
    header: <MinimumColumnHeader />,
    cell: (item) => {
      return <MinimumCell {...item} />;
    },
    sortingComparator: (a, b) => {
      const aValue = typeof a.minValue === 'number' ? a.minValue : 0;
      const bValue = typeof b.minValue === 'number' ? b.minValue : 0;
      return aValue - bValue;
    },
  });

const createTrendCursorColumnDefinition = ({
  id: trendCursorId,
  color,
  date,
}: TrendCursor): LegendTableColumnDefinitions[number] => ({
  id: trendCursorId,
  header: <TrendCursorColumnHeader color={color} date={date} />,
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
    ...(visibleContent?.asset ? [createAssetNameColumnDefinition()] : []),
    ...(visibleContent?.maxValue ? [createMaximumColumnDefinition()] : []),
    ...(visibleContent?.minValue ? [createMinimumColumnDefinition()] : []),
    ...(visibleContent?.latestValue
      ? [createLatestValueColumnDefinition(significantDigits)]
      : []),
    ...(visibleContent?.latestAlarmStateValue
      ? [createLatestAlarmStateValueColumnDefinition()]
      : []),
    ...trendCursorColumnDefinitions,
  ];
};
