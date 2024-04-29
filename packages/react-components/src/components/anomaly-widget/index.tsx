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

/**
 * Setup the applicable data source transformers
 */
const AnomalyDataSourceLoader = new DataSourceLoader([
  new AnomalyObjectDataSourceTransformer(),
]);

export const AnomalyWidget = (options: AnomalyWidgetOptions) => {
  const { datasources, showTimestamp = true, showYAxis = true } = options;
  /**
   * Datasources is a fixed length array of 1.
   * The widget can only display 1 anomaly for now.
   */
  const data = AnomalyDataSourceLoader.transform([...datasources]).at(0);
  const description = AnomalyDataSourceLoader.describe([...datasources]).at(0);
  const loading = datasources.some(({ state }) => state === 'loading');

  const { ref } = useAnomalyEchart({
    ...options,
    showTimestamp,
    showYAxis,
    data,
    description,
    loading,
  });

  return (
    <div
      className='anomaly-widget'
      style={{
        background: colorBackgroundContainerContent,
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <LoadingIcon loading={loading} />
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
      {showTimestamp && (
        <Timestamp
          showLoadingIndicator={false}
          styleProps={{ width: 'calc(100% - 16px)', bottom: 35 }}
        />
      )}
    </div>
  );
};
