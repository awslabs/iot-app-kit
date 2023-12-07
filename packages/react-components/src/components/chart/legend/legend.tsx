import React from 'react';
import { Table } from '@cloudscape-design/components';
import useChartsLegend from './useChartsLegend';
import { SeriesOption } from 'echarts';

import './legend.css';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { DataStream } from '@iot-app-kit/core';
import { InternalGraphicComponentGroupOption } from '../trendCursor/types';

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
