import React from 'react';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.all';

import { InternalAssetExplorer } from './internal-asset-explorer';
import type { AssetExplorerProps } from './types';

/**
 * Explore and select IoT SiteWise asset resources.
 *
 * @experimental Do not use in production.
 */
export function AssetExplorer(assetExplorerProps: AssetExplorerProps) {
  return (
    <I18nProvider locale='en' messages={[messages]}>
      <InternalAssetExplorer {...assetExplorerProps} />
    </I18nProvider>
  );
}
