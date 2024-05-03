import React from 'react';
import { AnomalyWidgetOptions } from './types';
import {
  AnomalyObjectDataSourceTransformer,
  DataSourceLoader,
} from '../../data';

import { colorBackgroundContainerContent } from '@cloudscape-design/design-tokens';

import { useAnomalyEchart } from './hooks/useAnomalyEchart';
import { LoadingIcon } from './loading-icon';
import { Timestamp } from '../timestampBar';
import { AnomalyWidgetError } from './anomalyWidgetError';

/**
 * Setup the applicable data source transformers
 */
const AnomalyDataSourceLoader = new DataSourceLoader([
  new AnomalyObjectDataSourceTransformer(),
]);

export const AnomalyWidget = (options: AnomalyWidgetOptions) => {
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
      className='anomaly-widget'
      data-testid='anomaly-widget-container'
      style={{
        background: colorBackgroundContainerContent,
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {error && <AnomalyWidgetError />}
      {!error && <LoadingIcon loading={loading} />}
      <div
        ref={ref}
        data-testid='anomaly-widget'
        style={{
          width: '100%',
          height: '100%',
          display: error ? 'none' : 'default',
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
