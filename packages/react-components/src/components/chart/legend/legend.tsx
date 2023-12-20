import React from 'react';
import { Table } from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { DataStream } from '@iot-app-kit/core';

import { SeriesOption } from 'echarts';
import useChartsLegend from './useChartsLegend';

import { InternalGraphicComponentGroupOption } from '../trendCursor/types';
import './legend.css';

const Legend = (legendOptions: {
  datastreams: DataStream[];
  series: SeriesOption[];
  graphic: InternalGraphicComponentGroupOption[];
  width: number;
}) => {
  const { items: allItems, columnDefinitions } = useChartsLegend(legendOptions);

  const { items, collectionProps } = useCollection(allItems, {
    sorting: {},
  });

  return (
    <div className='base-chart-legend-table-container'>
      <Table
        {...collectionProps}
        columnDefinitions={columnDefinitions}
        items={items}
        stickyColumns={{ first: 1, last: 0 }}
        stickyHeader
        trackBy='id'
        variant='embedded'
        preferences={<></>}
        contentDensity='compact'
      />
    </div>
  );
};

export default Legend;
