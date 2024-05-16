import React from 'react';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.all';

import { InternalAssetPropertyExplorer } from './internal-asset-property-explorer';
import type { AssetPropertyExplorerProps } from './types';
import { ResourceExplorerErrorBoundary } from '../../resource-explorer-error-boundary';

/**
 * Explore and select IoT SiteWise asset property resources.
 *
 * @experimental Do not use in production.
 */
export function AssetPropertyExplorer(
  assetPropertyExplorerProps: AssetPropertyExplorerProps
) {
  return (
    <ResourceExplorerErrorBoundary>
      <I18nProvider locale='en' messages={[messages]}>
        <InternalAssetPropertyExplorer {...assetPropertyExplorerProps} />
      </I18nProvider>
    </ResourceExplorerErrorBoundary>
  );
}
