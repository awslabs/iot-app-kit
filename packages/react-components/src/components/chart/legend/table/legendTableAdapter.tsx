import React from 'react';
import { DataStream, Primitive } from '@iot-app-kit/core';
import { ChartLegend, ChartOptions } from '../../types';
import { ChartLegendTable } from './table';
import { DataStreamInformation, TrendCursor } from './types';
import { TrendCursorValues } from '../../../../echarts/extensions/trendCursors/store';
import { useDataStreamMaxMin } from '../../hooks/useDataStreamMaxMin';
import { MinMaxMap } from '../../store/dataStreamMinMaxStore';
import type { TableProps } from '@cloudscape-design/components/table';
import type { AssistantProperty } from '../../../../common/assistantProps';
import { AlarmAssistantContext } from '../../../assistant-common/types';

type LegendTableDataStream = Pick<
  DataStream,
  'id' | 'color' | 'name' | 'unit' | 'assetName' | 'refId'
> & {
  latestValue: Primitive | undefined;
  latestAlarmStateValue: string | undefined;
} & AlarmAssistantContext;

const mapDataStreamInformation = ({
  datastreams,
  trendCursorValues,
  chartId,
  visibleContent,
  dataStreamMaxes,
  dataStreamMins,
}: {
  datastreams: LegendTableDataStream[];
  trendCursorValues: TrendCursorValues[];
  chartId: string;
  visibleContent: ChartLegend['visibleContent'];
  dataStreamMaxes: MinMaxMap;
  dataStreamMins: MinMaxMap;
}): DataStreamInformation[] =>
  datastreams.map(
    ({
      id,
      name,
      color,
      unit,
      assetName,
      latestValue,
      latestAlarmStateValue,
      assetId,
      alarmName,
      refId,
    }) => {
      const values = trendCursorValues.reduce<
        DataStreamInformation['trendCursorValues']
      >((valueMap, next) => {
        const valueId = chartId + id;
        const value = next[valueId];
        if (!value) return valueMap;
        valueMap[value.trendCursorId] = value.value;
        return valueMap;
      }, {});

      const dataStreamName =
        visibleContent?.unit && unit ? `${name} (${unit})` : name;
      const maxValue = dataStreamMaxes[id] ?? '-';
      const minValue = dataStreamMins[id] ?? '-';

      return {
        id,
        name: dataStreamName,
        color,
        assetName,
        latestValue,
        latestAlarmStateValue,
        assetId,
        alarmName,
        trendCursorValues: values,
        maxValue,
        minValue,
        refId,
      };
    }
  );

type ChartLegendTableAdapterOptions = ChartLegend & {
  datastreams: LegendTableDataStream[];
  trendCursorValues: TrendCursorValues[];
  trendCursors: TrendCursor[];
  chartId?: string;
  significantDigits: ChartOptions['significantDigits'];
  assistant?: AssistantProperty;
  selectedItems?: DataStreamInformation[];
  setSelectedItems?: (selectedItems: DataStreamInformation[]) => void;
  selectionType?: TableProps.SelectionType;
};

export const ChartLegendTableAdapter = ({
  datastreams,
  trendCursors,
  trendCursorValues,
  chartId = '',
  visibleContent,
  significantDigits,
  ...options
}: ChartLegendTableAdapterOptions) => {
  const { dataStreamMaxes, dataStreamMins } = useDataStreamMaxMin();
  const datastreamItems = mapDataStreamInformation({
    datastreams,
    trendCursorValues,
    chartId,
    visibleContent,
    dataStreamMaxes,
    dataStreamMins,
  });

  return (
    <ChartLegendTable
      datastreams={datastreamItems}
      trendCursors={trendCursors}
      visibleContent={visibleContent}
      significantDigits={significantDigits}
      {...options}
    />
  );
};
