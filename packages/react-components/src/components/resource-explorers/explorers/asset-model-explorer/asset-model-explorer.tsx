import React from 'react';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.all';

import { InternalAssetModelExplorer } from './internal-asset-model-explorer';
import type { AssetModelExplorerProps } from './types';

/**
 * Explore and select IoT SiteWise asset model resources.
 *
 * @experimental Do not use in production.
 */
export function AssetModelExplorer(
  assetModelExplorerProps: AssetModelExplorerProps
) {
  return (
    <I18nProvider locale='en' messages={[messages]}>
      <InternalAssetModelExplorer {...assetModelExplorerProps} />
    </I18nProvider>
  );
}
