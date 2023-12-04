import React, { useEffect, useRef, useState } from 'react';
import { TableProps } from '@cloudscape-design/components/table/interfaces';
import { GraphicComponentTextOption } from 'echarts/types/src/component/graphic/GraphicModel';
import { SeriesOption } from 'echarts';
import { LineSeriesOption } from 'echarts/types/src/chart/line/LineSeries';
import { DataStream } from '@iot-app-kit/core';
import { useHover } from 'react-use';

import {
  borderRadiusDropdown,
  colorBackgroundDropdownItemHover,
  spaceStaticXxs,
} from '@cloudscape-design/design-tokens';

import { useChartStore } from '../store';
import { isDataStreamInList } from '../../../utils/isDataStreamInList';
import { InternalGraphicComponentGroupOption } from '../trendCursor/types';
import { LEGEND_NAME_MIN_WIDTH_FACTOR } from '../eChartsConstants';

const LegendCell = (e: { datastream: DataStream; lineColor: string; name: string; width: number }) => {
  const { datastream, lineColor, name, width } = e;
  const highlightDataStream = useChartStore((state) => state.highlightDataStream);
  const unHighlightDataStream = useChartStore((state) => state.unHighlightDataStream);
  const highlightedDataStreams = useChartStore((state) => state.highlightedDataStreams);
  const isDataStreamHighlighted = isDataStreamInList(highlightedDataStreams);
  const nameRef = useRef<HTMLDivElement | null>(null);
  const isNameTruncated = nameRef.current?.scrollWidth && nameRef.current?.scrollWidth > nameRef.current?.clientWidth;
  const toggleHighlighted = () => {
    if (isDataStreamHighlighted(datastream)) {
      unHighlightDataStream(datastream);
    } else {
      highlightDataStream(datastream);
    }
  };

  const [lineIcon] = useHover((isHovering) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
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
      <div
        className='base-chart-legend-row-data'
        style={{
          marginBlock: spaceStaticXxs,
          minWidth: `${width / LEGEND_NAME_MIN_WIDTH_FACTOR}px`,
        }}
        ref={nameRef}
        title={isNameTruncated ? name : undefined}
      >
        {name}
      </div>
    </div>
  );
};

const useChartsLegend = ({
  datastreams,
  graphic,
  series,
  width,
}: {
  datastreams: DataStream[];
  graphic: InternalGraphicComponentGroupOption[];
  series: SeriesOption[];
  width: number;
}) => {
  const legendColumnDefinition = {
    id: 'Legends',
    header: <div className='base-chart-legend-col-header'>Data streams</div>,
    cell: (e: { datastream: DataStream; lineColor: string; name: string; width: number }) => <LegendCell {...e} />,
    isRowHeader: true,
  };

  // the string will be a rich text in the format of {timestampStyle|timestamp}
  // refer to echarts rich text and addTCHeader method
  const getTcHeader = (text: string) => {
    const fullString = text.split('|')[1].replaceAll('}', '').trim();

    const tcDateTime = new Date(fullString);
    return (
      <>
        <span>{tcDateTime.toLocaleDateString()}</span>
        <br />
        <span>{tcDateTime.toLocaleTimeString()}</span>
      </>
    );
  };

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
        width: width,
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
