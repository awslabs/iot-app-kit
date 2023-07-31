import React from 'react';
import { Table } from '@cloudscape-design/components';
import { InternalGraphicComponentGroupOption } from '../types';
import useChartsLegend from '../hooks/useChartsLegend';
import { SeriesOption } from 'echarts';

import './legend.css';

const Legend = (legendOptions: { series: SeriesOption[]; graphic: InternalGraphicComponentGroupOption[] }) => {
  const { items, columnDefinitions } = useChartsLegend(legendOptions);
  return (
    <div className='base-chart-legend-table-container'>
      <Table
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
