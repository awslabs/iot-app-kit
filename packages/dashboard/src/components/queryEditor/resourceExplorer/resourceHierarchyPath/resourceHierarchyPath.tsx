import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import React from 'react';

import { useHierarchyCrumbs } from './useHierarchyCrumbs';
import type { WithIoTSiteWiseClient } from '../../types';

export interface ResourceHierarchyPathProps extends WithIoTSiteWiseClient {
  /** Asset ID of the parent asset, or right-most asset in the breadcrumbs. */
  parentAssetId?: string;
  /** Callback fired when an asset name is clicked. This is used to navigate up the hierarchy. */
  onClickAssetName: (assetId: string) => void;
}

/**
 * Renders an asset hierarchy element for an asset. The hierarchy element
 * displays the asset's parents up to the root of the asset hierarchy and
 * features clickable navigation to the parent assets.
 */
export function ResourceHierarchyPath({ parentAssetId, onClickAssetName, client }: ResourceHierarchyPathProps) {
  const { hierarchyPathCrumbs } = useHierarchyCrumbs({ parentAssetId, client });

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
