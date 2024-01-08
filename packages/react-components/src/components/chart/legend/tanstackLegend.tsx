import React from 'react';
import { DataStream } from '@iot-app-kit/core';
import { ColumnDef } from '@tanstack/react-table';

import { SeriesOption } from 'echarts';
import useChartsLegendTanstack from './useChartsLegendTanstack';

import { InternalGraphicComponentGroupOption } from '../trendCursor/types';
import { TanstackTable } from './tanstackTable';

type legendOptions = {
  datastreams: DataStream[];
  series: SeriesOption[];
  graphic: InternalGraphicComponentGroupOption[];
  width: number;
};

const TanstackLegend = (legendOptions: legendOptions) => {
  const {
    items: allItemsTanstack,
    columnDefinitions: columnDefinitionsTanstack,
  } = useChartsLegendTanstack(legendOptions);

  return (
    <TanstackTable
      data={allItemsTanstack}
      columnDefinitions={
        columnDefinitionsTanstack as ColumnDef<object, string>[]
      }
      stickyColumns={{ first: 1 }}
      stickyHeader
    />
  );
};

export default TanstackLegend;
