import React from 'react';
import { AnomalyChartOptions } from './types';
import {
  AnomalyObjectDataSourceTransformer,
  DataSourceLoader,
} from '../../data';

import { colorBackgroundContainerContent } from '@cloudscape-design/design-tokens';

import { useAnomalyEchart } from './hooks/useAnomalyEchart';
import { LoadingIcon } from './loading-icon';
import { Timestamp } from '../timestampBar';
import { AnomalyChartError } from './anomalyChartError';

/**
 * Setup the applicable data source transformers
 */
const AnomalyDataSourceLoader = new DataSourceLoader([
  new AnomalyObjectDataSourceTransformer(),
]);

export const AnomalyChart = (options: AnomalyChartOptions) => {
  const { datasources, showTimestamp = true, ...configuration } = options;
  /**
   * Datasources is a fixed length array of 1.
   * The widget can only display 1 anomaly for now.
   */
  const data = AnomalyDataSourceLoader.transform([...datasources]).at(0);
  const description = AnomalyDataSourceLoader.describe([...datasources]).at(0);
  const loading = datasources.some(({ state }) => state === 'loading');
  const error = datasources.some(
    ({ state }) => state === 'error' || state === 'failed'
  );

  const { ref } = useAnomalyEchart({
    ...configuration,
    showTimestamp,
    data,
    description,
    loading,
  });

  return (
    <div
      className='anomaly-chart'
      data-testid='anomaly-chart-container'
      style={{
        background: colorBackgroundContainerContent,
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
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
          showLoadingIndicator={false}
          styleProps={{ width: 'calc(100% - 16px)', bottom: 35 }}
        />
      )}
    </div>
  );
};
