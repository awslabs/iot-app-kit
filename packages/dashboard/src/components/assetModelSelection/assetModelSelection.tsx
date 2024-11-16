import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import {
  colorBorderDividerDefault,
  colorTextBodyDefault,
  spaceScaledS,
  spaceScaledXxxs,
  spaceStaticXxl,
} from '@cloudscape-design/design-tokens';

import { AssetModelSelect } from './assetModelSelect';
import { useModelBasedQuery } from '../queryEditor/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/modelBasedQuery/useModelBasedQuery';
import './assetModelSelection.css';

type AssetModelSelectionOptions = {
  iotSiteWiseClient: IoTSiteWise;
};

export const AssetModelSelection = ({
  iotSiteWiseClient,
}: AssetModelSelectionOptions) => {
  const { assetModelId, assetIds, hasModelBasedQuery, updateSelectedAsset } =
    useModelBasedQuery();
  const selectedAssetId = assetIds?.at(0);
  const assetModelSelectionControlId = 'asset-model-select-dropdown';

  const divider = {
    borderLeft: `solid ${spaceScaledXxxs} ${colorBorderDividerDefault}`,
    height: spaceStaticXxl,
    margin: `0 ${spaceScaledS}`,
  };

  const Divider = () => <div style={divider} />;

  if (!hasModelBasedQuery || !assetModelId) return null;

  return (
    <div
      className='asset-model-selection'
      //eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <h4 style={{ color: colorTextBodyDefault }}>
        <label htmlFor={assetModelSelectionControlId}>Assets</label>
      </h4>
      <Divider />
      <div style={{ width: '300px' }}>
        <AssetModelSelect
          assetModelId={assetModelId}
          selectedAssetId={selectedAssetId}
          iotSiteWiseClient={iotSiteWiseClient}
          controlId={assetModelSelectionControlId}
          updateSelectedAsset={updateSelectedAsset}
          hideTitle
        />
      </div>
    </div>
  );
};
