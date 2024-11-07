import { Link, Icon } from '@cloudscape-design/components';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';

export interface AssetTableNameLinkProps {
  assetId: string;
  assetName: string;
  updateParentAssetId: (assetId?: string) => void;
}

export function AssetTableNameLink({
  assetId,
  assetName,
  updateParentAssetId,
}: AssetTableNameLinkProps) {
  return (
    <Link
      ariaLabel={`List child assets of ${assetName}`}
      onFollow={(event) => {
        event.preventDefault();
        updateParentAssetId(assetId);
      }}
    >
      <span
        data-testid='asset-name-link'
        title={`View children assets of ${assetName}`}
      >
        <Icon name='angle-right' size='inherit' />
        <span style={{ paddingLeft: spaceScaledXs }}>{assetName}</span>
      </span>
    </Link>
  );
}
