import React from 'react';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.all';

import { InternalAssetModelExplorer } from './internal-asset-model-explorer';
import type { AssetModelExplorerProps } from './types';
import { ResourceExplorerErrorBoundary } from '../../resource-explorer-error-boundary';

/**
 * Explore and select IoT SiteWise asset model resources.
 *
 * @experimental Do not use in production.
 */
export function AssetModelExplorer(
  assetModelExplorerProps: AssetModelExplorerProps
) {
  return (
    <ResourceExplorerErrorBoundary>
      <I18nProvider locale='en' messages={[messages]}>
        <InternalAssetModelExplorer {...assetModelExplorerProps} />
      </I18nProvider>
    </ResourceExplorerErrorBoundary>
  );
}
