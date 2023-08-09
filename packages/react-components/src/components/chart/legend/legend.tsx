import React from 'react';
import { Table } from '@cloudscape-design/components';
import { InternalGraphicComponentGroupOption } from '../types';
import useChartsLegend from '../hooks/useChartsLegend';
import { SeriesOption } from 'echarts';

import './legend.css';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { DataStream } from '@iot-app-kit/core';

const Legend = (legendOptions: {
  datastreams: DataStream[];
  series: SeriesOption[];
  graphic: InternalGraphicComponentGroupOption[];
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
        trackBy='name'
        variant='embedded'
        preferences={<></>}
        contentDensity='compact'
      />
    </div>
  );
};

export default Legend;
