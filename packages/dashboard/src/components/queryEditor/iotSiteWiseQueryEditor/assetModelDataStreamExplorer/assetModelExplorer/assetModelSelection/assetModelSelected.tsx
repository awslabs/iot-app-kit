import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

import { spaceScaledXxs } from '@cloudscape-design/design-tokens';

import { VerticalDivider } from '~/components/divider/verticalDivider';
import { SelectedAssetModel } from '../../useSelectedAssetModel';
import { AssetSummary, DescribeAssetCommandOutput, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { AssetForAssetModelSelect } from '../../assetsForAssetModelSelect/assetForAssetModelSelect';
import { SelectedAsset, UpdateSelectedAsset } from '../../useSelectedAsset';
import { useAssetModel } from '~/hooks/useAssetModel/useAssetModel';
import { useAsset } from '../../../modeledDataStreamQueryEditor/assetExplorer/useAsset';
import { useModalVisibility } from '~/hooks/useModalVisibility';
import { ResetAssetModelModal } from './resetAssetModel/resetAssetModelModal';

import { default as assetModelSvg } from './assetModelIcon.svg';

import './assetModelSelected.css';

const describedAssetToAssetSummary = (
  assetResponse: DescribeAssetCommandOutput | undefined
): AssetSummary | undefined =>
  assetResponse
    ? {
        id: assetResponse.assetId,
        arn: assetResponse.assetArn,
        name: assetResponse.assetName,
        assetModelId: assetResponse.assetModelId,
        creationDate: assetResponse.assetCreationDate,
        lastUpdateDate: assetResponse.assetLastUpdateDate,
        status: assetResponse.assetStatus,
        hierarchies: assetResponse.assetHierarchies,
        description: assetResponse.assetDescription,
      }
    : undefined;

type AssetModelSelectedOptions = {
  selectedAssetModel?: SelectedAssetModel;
  selectedAsset?: SelectedAsset;
  setSelectedAsset: UpdateSelectedAsset;
  onResetSelectedAssetModel?: () => void;
  client: IoTSiteWiseClient;
};

export const AssetModelSelected = ({
  selectedAssetModel,
  selectedAsset,
  setSelectedAsset,
  onResetSelectedAssetModel,
  client,
}: AssetModelSelectedOptions) => {
  const { visible, onHide, onShow } = useModalVisibility();

  const { assetModel } = useAssetModel({ assetModelId: selectedAssetModel?.id, client });

  const { asset } = useAsset({ assetId: selectedAsset?.id, client });

  return (
    <div>
      <div
        className='selected-asset-model-conatiner'
        style={{
          gap: spaceScaledXxs,
        }}
      >
        <img src={assetModelSvg} alt='Selected asset model icon' />
        <VerticalDivider classNames={['reset-selected-asset-model-vertical-divider']} />
        <Box fontWeight='bold' variant='span'>
          Asset Model:
        </Box>
        <Box variant='span'>{assetModel?.assetModelName}</Box>
        <div className='reset-selected-asset-model-container'>
          <Button onClick={onShow}>Reset</Button>
        </div>
      </div>
      <Box padding={{ top: 's' }}>
        <AssetForAssetModelSelect
          assetModelId={selectedAssetModel?.id}
          selectedAsset={describedAssetToAssetSummary(asset)}
          onSelectAsset={setSelectedAsset}
          client={client}
        />
      </Box>
      <ResetAssetModelModal visible={visible} onHide={onHide} onReset={onResetSelectedAssetModel} />
    </div>
  );
};
