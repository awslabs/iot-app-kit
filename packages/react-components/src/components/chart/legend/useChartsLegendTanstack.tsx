import React, { useEffect, useRef, useState } from 'react';
import {
  GraphicComponentGroupOption,
  GraphicComponentTextOption,
} from 'echarts/types/src/component/graphic/GraphicModel';
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
import Hide from './hide.svg';
import Show from './show.svg';
import Button from '@cloudscape-design/components/button';
import {
  ColumnDef,
  createColumnHelper,
  CellContext as TanCellContext,
  RowData,
} from '@tanstack/react-table';

type CellContext<TData extends RowData, TValue> = TanCellContext<
  TData,
  TValue
> & {
  additionalProp: string;
};

type TableRowType = {
  datastream: DataStream;
  lineColor: string;
  name: string;
  width: number;
};

const LegendCell = (e: {
  datastream: DataStream;
  lineColor: string;
  name: string;
  width: number;
}) => {
  const { datastream, lineColor, name, width } = e;
  const highlightDataStream = useChartStore(
    (state) => state.highlightDataStream
  );
  const unHighlightDataStream = useChartStore(
    (state) => state.unHighlightDataStream
  );
  const highlightedDataStreams = useChartStore(
    (state) => state.highlightedDataStreams
  );
  const isDataStreamHighlighted = isDataStreamInList(highlightedDataStreams);
  const nameRef = useRef<HTMLDivElement | null>(null);
  const isNameTruncated =
    nameRef.current?.scrollWidth &&
    nameRef.current?.scrollWidth > nameRef.current?.clientWidth;
  const toggleHighlighted = () => {
    if (isDataStreamHighlighted(datastream)) {
      unHighlightDataStream(datastream);
    } else {
      highlightDataStream(datastream);
    }
  };
  const hideDataStream = useChartStore((state) => state.hideDataStream);
  const unHideDataStream = useChartStore((state) => state.unHideDataStream);
  const hiddenDataStreams = useChartStore((state) => state.hiddenDataStreams);
  const isDataStreamHidden = isDataStreamInList(hiddenDataStreams);
  const propertyVisibilityIcon = isDataStreamHidden(datastream) ? (
    <img alt='hide property' src={Hide}></img>
  ) : (
    <img alt='show property' src={Show}></img>
  );

  const toggleVisibility = () => {
    if (isDataStreamHidden(datastream)) {
      unHideDataStream(datastream);
    } else {
      if (isDataStreamHighlighted(datastream)) {
        unHighlightDataStream(datastream);
      }
      hideDataStream(datastream);
    }
  };

  const [lineIcon] = useHover((isHovering) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      style={{
        backgroundColor: isHovering
          ? colorBackgroundDropdownItemHover
          : 'white', //white background color matches surroundings to display that it is diabled
        borderRadius: borderRadiusDropdown,
      }}
      className={`base-chart-legend-row-line-container ${
        isDataStreamHidden(datastream) ? 'disabled' : ''
      }`}
      onClick={toggleHighlighted}
      aria-disabled={isDataStreamHidden(datastream)}
      title={
        isDataStreamHighlighted(datastream)
          ? `Un-Highlight ${datastream.name} Proprerty`
          : `Highlight ${datastream.name} Property`
      }
      role='button'
      tabIndex={isDataStreamHidden(datastream) ? -1 : 0}
    >
      <div
        className={`base-chart-legend-row-line-ind ${
          isDataStreamHighlighted(datastream)
            ? 'base-chart-legend-row-line-ind-highlighted'
            : ''
        }`}
        style={{
          backgroundColor: lineColor,
        }}
      />
    </div>
  ));

  const [hideShowButton] = useHover((isHovering) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      style={{
        backgroundColor: isHovering
          ? colorBackgroundDropdownItemHover
          : undefined,
        borderRadius: borderRadiusDropdown,
      }}
      className='base-chart-legend-row-line-container'
    >
      <div
        title={
          isDataStreamHidden(datastream)
            ? `Show ${datastream.name} Proprerty`
            : `Hide ${datastream.name} Property`
        }
      >
        <Button
          onClick={toggleVisibility}
          variant='icon'
          iconSvg={propertyVisibilityIcon}
        />
      </div>
    </div>
  ));

  return (
    <div className='base-chart-legend-row-data-container'>
      {hideShowButton}
      {lineIcon}
      <div
        className={`base-chart-legend-row-data ${
          isDataStreamHidden(datastream) ? 'hidden-legend' : ''
        }`}
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

const useChartsLegendTanstack = ({
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
  const columnHelper = createColumnHelper<TableRowType>();

  const legendColumnDefinitions = columnHelper.accessor(() => 'Legends', {
    id: 'Legends',
    header: () => (
      <div className='base-chart-legend-col-header'>Data streams</div>
    ),
    cell: (info: unknown) => {
      const e = info as CellContext<TableRowType, string>;
      return <LegendCell {...e.row.original} />;
    },
    enableSorting: false,
  });

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

  const getHeaderNode = (g: InternalGraphicComponentGroupOption) => {
    const headerGroup = g.children[1] as GraphicComponentGroupOption;
    if (!headerGroup) {
      return null;
    }
    const text = headerGroup.children.find(
      (c) => c.type === 'text'
    ) as GraphicComponentTextOption;
    return (
      <div className='base-chart-legend-tc-header-container'>
        <div>{getTcHeader(text?.style?.text ?? '')}</div>
        <div
          className='base-chart-legend-tc-header-color'
          style={{ backgroundColor: g.color }}
        />
      </div>
    );
  };

  const [columnDefinitions, setColumnDefinitions] = useState<
    ColumnDef<TableRowType, string>[]
  >([legendColumnDefinitions]);
  const [items, setItems] = useState<Array<object>>([]);

  const graphicDeps = JSON.stringify(graphic);
  const seriesDeps = JSON.stringify(series);

  const TcCell = (
    e: { datastream: DataStream; tc: { [id: string]: number } },
    id: string
  ) => {
    const { datastream } = e;
    const hiddenDataStreams = useChartStore((state) => state.hiddenDataStreams);
    const isDataStreamHidden = isDataStreamInList(hiddenDataStreams);
    return (
      <>
        <div className={isDataStreamHidden(datastream) ? 'hidden-legend' : ''}>
          {e.tc[id]}
        </div>
      </>
    );
  };

  useEffect(() => {
    const tcColumnDefinitions = graphic.map((g) => {
      const id = g.id as string;
      return columnHelper.accessor((row) => row[id as keyof TableRowType], {
        id: id,
        header: () => getHeaderNode(g),
        cell: (info: unknown) => {
          const e = info as CellContext<
            { datastream: DataStream; tc: { [id: string]: number } },
            string
          >;
          return TcCell(e.row.original, id);
        },
        enableSorting: true,
      });
    });
    setColumnDefinitions([legendColumnDefinitions, ...tcColumnDefinitions]);

    // yAxisMarkerValue contains the y values for each TC
    // currItems will hold values in the { gId: value }  format
    const currItems = series.map((lineItem, index) => {
      const values = graphic
        .map((gr) => ({
          key: gr.id as string,
          value: gr.yAxisMarkerValue[index],
        }))
        .reduce(
          (obj, item) => Object.assign(obj, { [item.key]: item.value }),
          {}
        );
      return {
        name: lineItem.name,
        // TODO: may need to update this for non-line type graphs
        lineColor: (lineItem as LineSeriesOption)?.lineStyle?.color ?? '',
        datastream: datastreams.find((ds) => lineItem.id === ds.id),
        width: width,
        tc: values,
      };
    });

    setItems(currItems);
    // disabling because graphics and series are stringified
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphicDeps, seriesDeps]);

  return { columnDefinitions, items };
};

export default useChartsLegendTanstack;
