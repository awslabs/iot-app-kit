import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.all';

import { InternalTimeSeriesExplorer } from './internal-time-series-explorer';
import type { TimeSeriesExplorerProps } from './types';

/**
 * Explore and select IoT SiteWise time series resources.
 *
 * @experimental Do not use in production.
 */
export function TimeSeriesExplorer(
  timeSeriesExplorerProps: TimeSeriesExplorerProps
) {
  return (
    <I18nProvider locale='en' messages={[messages]}>
      <InternalTimeSeriesExplorer {...timeSeriesExplorerProps} />
    </I18nProvider>
  );
}
