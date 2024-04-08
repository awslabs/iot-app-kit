import React from 'react';
import { useECharts } from '../../hooks/useECharts';
import { AnomalyWidgetOptions } from './types';
import { useSetOptions } from './hooks/useSetOptions';
import { useXAxis } from './hooks/useXAxis';
import { useTitle } from './hooks/useTitle';
import { useDataSet } from './hooks/useDataSet';
import { useSeries } from './hooks/useSeries';
import { useTooltip } from './hooks/useTooltip';
import {
  AnomalyObjectDataSourceTransformer,
  DataSourceLoader,
} from '../../data';

const AnomalyDataSourceLoader = new DataSourceLoader([
  new AnomalyObjectDataSourceTransformer(),
]);

export const AnomalyWidget = ({
  datasources,
  viewport,
  title,
  decimalPlaces,
  tooltipSort,
}: AnomalyWidgetOptions) => {
  const { ref, chartRef } = useECharts();

  /**
   * Datasources is a fixed length array of 1.
   * The widget can only display 1 anomaly for now.
   */
  const data = AnomalyDataSourceLoader.transform([...datasources]).at(0);
  const description = AnomalyDataSourceLoader.describe([...datasources]).at(0);

  const customXAxis = useXAxis({
    viewportStart: viewport.start,
    viewportEnd: viewport.end,
  });
  const customTitle = useTitle({ title });
  const customDataSet = useDataSet({ data });
  const customSeries = useSeries({ description });
  const customTooltip = useTooltip({ decimalPlaces, tooltipSort });

  const customOptions = {
    ...customXAxis,
    ...customTitle,
    ...customDataSet,
    ...customSeries,
    ...customTooltip,
  };

  useSetOptions({ chartRef, customOptions });

  return (
    <div style={{ background: 'white', width: '100%', height: '100%' }}>
      <div
        ref={ref}
        style={{ width: '100%', height: '100%', paddingBottom: '32px' }}
      />
    </div>
  );
};
