import { InternalGraphicComponentGroupOption } from '../types';
import React, { useEffect, useState } from 'react';
import { TableProps } from '@cloudscape-design/components/table/interfaces';
import { GraphicComponentTextOption } from 'echarts/types/src/component/graphic/GraphicModel';
import { SeriesOption } from 'echarts';
import { LineSeriesOption } from 'echarts/types/src/chart/line/LineSeries';
import { DataStream } from '@iot-app-kit/core';
import { useHover } from 'react-use';

import { borderRadiusDropdown, colorBackgroundDropdownItemHover, spaceScaledS } from '@cloudscape-design/design-tokens';

import { useChartStore } from '../store';
import { isDataStreamInList } from '../../../utils/isDataStreamInList';

const LegendCell = (e: { datastream: DataStream; lineColor: string; name: string }) => {
  const { datastream, lineColor, name } = e;
  const highlightDataStream = useChartStore((state) => state.highlightDataStream);
  const unHighlightDataStream = useChartStore((state) => state.unHighlightDataStream);
  const highlightedDataStreams = useChartStore((state) => state.highlightedDataStreams);
  const isDataStreamHighlighted = isDataStreamInList(highlightedDataStreams);

  const toggleHighlighted = () => {
    if (isDataStreamHighlighted(datastream)) {
      unHighlightDataStream(datastream);
    } else {
      highlightDataStream(datastream);
    }
  };

  const [lineIcon] = useHover((isHovering) => (
    <div
      style={{
        backgroundColor: isHovering ? colorBackgroundDropdownItemHover : undefined,
        borderRadius: borderRadiusDropdown,
      }}
      className='base-chart-legend-row-line-container'
      onClick={toggleHighlighted}
    >
      <div
        className={`base-chart-legend-row-line-ind ${
          isDataStreamHighlighted(datastream) ? 'base-chart-legend-row-line-ind-highlighted' : ''
        }`}
        style={{
          backgroundColor: lineColor,
        }}
      />
    </div>
  ));

  return (
    <div className='base-chart-legend-row-data-container'>
      {lineIcon}
      <div style={{ marginBlock: spaceScaledS }}>{name}</div>
    </div>
  );
};

const useChartsLegend = ({
  datastreams,
  graphic,
  series,
}: {
  datastreams: DataStream[];
  graphic: InternalGraphicComponentGroupOption[];
  series: SeriesOption[];
}) => {
  const legendColumnDefinition = {
    id: 'Legends',
    header: <div className='base-chart-legend-col-header'>Properties</div>,
    cell: (e: { datastream: DataStream; lineColor: string; name: string }) => <LegendCell {...e} />,
    isRowHeader: true,
  };

  // the string will be a rich text in the format of {title|name}\n{info|timestamp}
  // refer to echarts rich text and addTCHeader method
  const getTcHeader = (text: string) => text.split('\n')[0].split('|')[1].replaceAll('}', '').trim();

  const getHeaderNode = (g: InternalGraphicComponentGroupOption) => (
    <div className='base-chart-legend-tc-header-container'>
      <div>{getTcHeader((g.children[1] as GraphicComponentTextOption)?.style?.text ?? '')}</div>
    </div>
  );

  const [columnDefinitions, setColumnDefinitions] = useState<Array<TableProps.ColumnDefinition<object>>>([
    legendColumnDefinition,
  ]);
  const [items, setItems] = useState<Array<object>>([]);

  const graphicDeps = JSON.stringify(graphic);
  const seriesDeps = JSON.stringify(series);

  useEffect(() => {
    const tcColumnDefinitions = graphic.map((g) => {
      const id = g.id as string;
      return {
        id,
        header: getHeaderNode(g),
        cell: (e: { [x: string]: number }) => e[id],
        sortingField: id,
      };
    });
    setColumnDefinitions([legendColumnDefinition, ...tcColumnDefinitions]);

    // yAxisMarkerValue contains the y values for each TC
    // currItems will hold values in the { gId: value }  format
    const currItems = series.map((lineItem, index) => {
      const values = graphic
        .map((gr) => ({ key: gr.id as string, value: gr.yAxisMarkerValue[index] }))
        .reduce((obj, item) => Object.assign(obj, { [item.key]: item.value }), {});
      return {
        name: lineItem.name,
        // TODO: may need to update this for non-line type graphs
        lineColor: (lineItem as LineSeriesOption)?.lineStyle?.color ?? '',
        datastream: datastreams.find((ds) => lineItem.id === ds.id),
        ...values,
      };
    });

    setItems(currItems);
    // disabling because graphics and series are stringified
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphicDeps, seriesDeps]);
  return { columnDefinitions, items };
};

export default useChartsLegend;
