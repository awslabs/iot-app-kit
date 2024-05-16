import React from 'react';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.all';

import { InternalTimeSeriesExplorer } from './internal-time-series-explorer';
import type { TimeSeriesExplorerProps } from './types';
import { ResourceExplorerErrorBoundary } from '../../resource-explorer-error-boundary';

/**
 * Explore and select IoT SiteWise time series resources.
 *
 * @experimental Do not use in production.
 */
export function TimeSeriesExplorer(
  timeSeriesExplorerProps: TimeSeriesExplorerProps
) {
  return (
    <ResourceExplorerErrorBoundary>
      <I18nProvider locale='en' messages={[messages]}>
        <InternalTimeSeriesExplorer {...timeSeriesExplorerProps} />
      </I18nProvider>
    </ResourceExplorerErrorBoundary>
  );
}
