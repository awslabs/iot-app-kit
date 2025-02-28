import { useEffect } from 'react';
import { type AnomalyChartOptions } from './types';
import {
  AnomalyObjectDataSourceTransformer,
  AnomalyArrowDataSourceTransformer,
  DataSourceLoader,
  DEFAULT_ANOMALY_DATA_SOURCE_VIEWPORT,
  useUtilizedViewport,
} from '@iot-app-kit/component-core';

import { colorBackgroundContainerContent } from '@cloudscape-design/design-tokens';

import { useAnomalyEchart } from './hooks/useAnomalyEchart';
import { LoadingIcon } from './loading-icon';
import { Timestamp } from '../timestampBar';
import { AnomalyChartError } from './anomalyChartError';
import { useTransformedData } from './hooks/useTransformedData';
import { AnomalyChartEmpty } from './anomalyChartEmpty';
import useDataStore from '../../store';

/**
 * Setup the applicable data source transformers
 */
const AnomalyDataSourceLoader = new DataSourceLoader([
  new AnomalyObjectDataSourceTransformer(),
  new AnomalyArrowDataSourceTransformer(),
]);

export const AnomalyChart = (options: AnomalyChartOptions) => {
  const {
    gestures = true,
    showTimestamp = true,
    viewport,
    timeZone,
    ...configuration
  } = options;

  const {
    viewport: utilizedViewport,
    setViewport,
    viewportType,
  } = useUtilizedViewport({
    passedInViewport: viewport,
    defaultViewport: DEFAULT_ANOMALY_DATA_SOURCE_VIEWPORT,
  });

  const { data, description, loading, error, empty } = useTransformedData({
    ...configuration,
    loader: AnomalyDataSourceLoader,
    viewport: utilizedViewport,
  });
  const anomalyViewport =
    description?.dataExtent != null &&
    (viewportType === 'default' || viewportType === 'none')
      ? description.dataExtent
      : utilizedViewport;

  const { ref, sizeRef } = useAnomalyEchart({
    ...configuration,
    gestures,
    showTimestamp,
    data,
    description,
    loading,
    setViewport,
    viewport: anomalyViewport,
    viewportType,
    timeZone,
  });

  useEffect(() => {
    // Set timezone for use in sub components
    useDataStore.getState().setTimeZone(timeZone);
  }, [timeZone]);

  return (
    <div
      className='anomaly-chart'
      data-testid='anomaly-chart-container'
      style={{
        background: colorBackgroundContainerContent,
        width: '100%',
        height: '100%',
        position: 'relative',
        minHeight: 200,
        minWidth: 200,
      }}
      ref={sizeRef}
    >
      {empty && <AnomalyChartEmpty />}
      {error && <AnomalyChartError />}
      {!error && <LoadingIcon loading={loading} />}
      <div
        ref={ref}
        data-testid='anomaly-chart'
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      {showTimestamp && !error && (
        <Timestamp
          viewport={anomalyViewport}
          showLoadingIndicator={false}
          styleProps={{ width: 'calc(100% - 16px)', bottom: 35 }}
        />
      )}
    </div>
  );
};
