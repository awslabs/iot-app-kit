import { InternalGraphicComponentGroupOption } from './types';
import React, { useEffect, useState } from 'react';
import { TableProps } from '@cloudscape-design/components/table/interfaces';
import { GraphicComponentTextOption } from 'echarts/types/src/component/graphic/GraphicModel';
import { SeriesOption } from 'echarts';
import { LineSeriesOption } from 'echarts/types/src/chart/line/LineSeries';
import { YAxisLegendOption } from './converters/defaultConvertedDataStream';
import { Value } from '../shared-components';

const useChartsLegend = ({
  graphic,
  series,
  yMin,
  yMax,
}: {
  graphic: InternalGraphicComponentGroupOption[];
  series: SeriesOption[];
  yMin: YAxisLegendOption[];
  yMax: YAxisLegendOption[];
}) => {
  const legendColumnDefinition = {
    id: 'Legends',
    header: <div className='base-chart-legend-col-header'>Properties</div>,
    cell: (e: { lineColor: string; name: string }) => (
      <div className='base-chart-legend-row-data-container'>
        <div
          className='base-chart-legend-row-line-ind'
          style={{
            backgroundColor: e.lineColor,
          }}
        ></div>
        <div>{e.name}</div>
      </div>
    ),
    isRowHeader: true,
  };

  const axisMinColumnDefinition = {
    id: 'Min',
    header: <div>Min</div>,
    cell: (e: { yMin: YAxisLegendOption }) => (
      <Value value={e.yMin.value?.y} precision={e.yMin.significantDigits} />
    )
  };
  const axisMaxColumnDefinition = {
    id: 'Max',
    header: <div>Max</div>,
    cell: (e: { yMax: YAxisLegendOption }) => (
      <Value value={e.yMax.value?.y} precision={e.yMax.significantDigits} />
    )
  };

  // the string will be a rich text in the format of {title|name}\n{info|timestamp}
  // refer to echarts rich text and addTCHeader method
  const getTcHeader = (text: string) => text.split('\n')[0].split('|')[1].replaceAll('}', '').trim();

  const getHeaderNode = (g: InternalGraphicComponentGroupOption) => (
    <div className='base-chart-legend-tc-header-container'>
      <div>{getTcHeader((g.children[1] as GraphicComponentTextOption).style?.text ?? '')}</div>
      <div style={{ backgroundColor: g.headerColor }} className='base-chart-legend-tc-header-color-marker' />
    </div>
  );

  const [columnDefinitions, setColumnDefinitions] = useState<Array<TableProps.ColumnDefinition<object>>>([
    legendColumnDefinition,
    axisMinColumnDefinition,
    axisMaxColumnDefinition,
  ]);

  const [items, setItems] = useState<Array<object>>([]);
  useEffect(() => {
    const tcColumnDefinitions = graphic.map((g) => ({
      id: g.id as string,
      header: getHeaderNode(g),
      cell: (e: { [x: string]: string }) => e[g.id as string],
    }));
    setColumnDefinitions([legendColumnDefinition, axisMinColumnDefinition, axisMaxColumnDefinition, ...tcColumnDefinitions]);

    // yAxisMarkerValue contains the y values for each TC
    // currItems will hold values in the { gId: value }  format
    const currItems = series.map((lineItem, index) => {
      const lineItemId = lineItem.id;

      const values = graphic
        .map((gr) => ({ key: gr.id as string, value: gr.yAxisMarkerValue[index] }))
        .reduce((obj, item) => Object.assign(obj, { [item.key]: item.value }), {});

      const min = yMin.find(({ id }) => lineItemId === id);
      const max = yMax.find(({ id }) => lineItemId === id);
      return {
        name: lineItem.name,
        yMin: min,
        yMax: max,
        // TODO: may need to update this for non-line type graphs
        lineColor: (lineItem as LineSeriesOption)?.lineStyle?.color ?? '',
        ...values,
      };
    });

    setItems(currItems);
  }, [graphic, series]);
  return { columnDefinitions, items };
};

export default useChartsLegend;
