import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';

import { useHierarchyCrumbs } from './useHierarchyCrumbs';

export interface AssetTableHierarchyPathProps {
  /** Asset ID of the parent asset, or right-most asset in the breadcrumbs. */
  parentAssetId?: string;
  /** Callback fired when an asset name is clicked. This is used to navigate up the hierarchy. */
  onClickAssetName: (assetId: string) => void;
  client: IoTSiteWiseClient;
}

/**
 * Renders an asset hierarchy element for an asset. The hierarchy element
 * displays the asset's parents up to the root of the asset hierarchy and
 * features clickable navigation to the parent assets.
 */
export function AssetTableHierarchyPath({
  parentAssetId,
  onClickAssetName,
  client,
}: AssetTableHierarchyPathProps) {
  const { hierarchyPathCrumbs } = useHierarchyCrumbs({
    assetId: parentAssetId,
    client,
  });

  return (
    <BreadcrumbGroup
      items={hierarchyPathCrumbs}
      onClick={(event) => {
        // cancel default event
        event.preventDefault();

        const assetId = event.detail.href;
        onClickAssetName(assetId);
      }}
      ariaLabel='Asset hierarchy'
      expandAriaLabel='Show more'
    />
  );
}
