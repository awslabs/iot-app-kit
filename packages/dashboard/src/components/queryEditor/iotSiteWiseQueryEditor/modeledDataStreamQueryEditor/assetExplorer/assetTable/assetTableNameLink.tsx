import Link from '@cloudscape-design/components/link';
import React from 'react';

export interface AssetTableNameLinkProps {
  assetId: string;
  assetName: string;
  updateParentAssetId: (assetId?: string) => void;
}

export function AssetTableNameLink({ assetId, assetName, updateParentAssetId }: AssetTableNameLinkProps) {
  return (
    <Link
      ariaLabel={`List child assets of ${assetName}`}
      onFollow={(event) => {
        event.preventDefault();
        updateParentAssetId(assetId);
      }}
    >
      {assetName}
    </Link>
  );
}
