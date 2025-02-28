import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.all';

import { InternalAssetPropertyExplorer } from './internal-asset-property-explorer';
import type { AssetPropertyExplorerProps } from './types';

/**
 * Explore and select IoT SiteWise asset property resources.
 *
 * @experimental Do not use in production.
 */
export function AssetPropertyExplorer(
  assetPropertyExplorerProps: AssetPropertyExplorerProps
) {
  return (
    <I18nProvider locale='en' messages={[messages]}>
      <InternalAssetPropertyExplorer {...assetPropertyExplorerProps} />
    </I18nProvider>
  );
}
