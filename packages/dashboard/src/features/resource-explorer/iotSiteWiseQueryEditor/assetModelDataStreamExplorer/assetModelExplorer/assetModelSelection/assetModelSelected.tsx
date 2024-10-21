import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

import { spaceScaledXxs } from '@cloudscape-design/design-tokens';

import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { VerticalDivider } from '~/atoms/divider/verticalDivider';
import { AssetForAssetModelSelectForm } from '../../assetsForAssetModelSelect/assetForAssetModelSelectForm';
import { SelectedAsset, UpdateSelectedAsset } from '../../useSelectedAsset';
import { SelectedAssetModel } from '../../useSelectedAssetModel';

import { useModalVisibility } from '~/hooks/useModalVisibility';
import { ResetAssetModelModal } from './resetAssetModel/resetAssetModelModal';

import { default as assetModelSvg } from './assetModelIcon.svg';

import { useAssetModel } from '~/hooks/useAssetModel/useAssetModel';
import './assetModelSelected.css';

type AssetModelSelectedOptions = {
  selectedAssetModel: SelectedAssetModel;
  selectedAsset: SelectedAsset;
  setSelectedAsset: UpdateSelectedAsset;
  onResetSelectedAssetModel?: () => void;
  iotSiteWiseClient: IoTSiteWise;
};

export const AssetModelSelected = ({
  selectedAsset,
  selectedAssetModel,
  setSelectedAsset,
  onResetSelectedAssetModel,
  iotSiteWiseClient,
}: AssetModelSelectedOptions) => {
  const { visible, onHide, onShow } = useModalVisibility();

  const { assetModel } = useAssetModel({
    assetModelId: selectedAssetModel?.at(0)?.assetModelId,
    iotSiteWiseClient,
  });

  return (
    <div>
      <div
        className='selected-asset-model-conatiner'
        style={{
          gap: spaceScaledXxs,
        }}
      >
        <img src={assetModelSvg} alt='Selected asset model icon' />
        <VerticalDivider
          classNames={['reset-selected-asset-model-vertical-divider']}
        />
        <Box fontWeight='bold' variant='span'>
          Asset model:
        </Box>
        <Box variant='span'>{assetModel?.at(0)?.path?.[0].name}</Box>
        <div className='reset-selected-asset-model-container'>
          <Button onClick={onShow}>Reset</Button>
        </div>
      </div>
      <Box padding={{ top: 's' }}>
        <AssetForAssetModelSelectForm
          selectedAssetModel={selectedAssetModel}
          selectedAsset={selectedAsset}
          onSelectAsset={setSelectedAsset}
          iotSiteWiseClient={iotSiteWiseClient}
        />
      </Box>
      <ResetAssetModelModal
        visible={visible}
        onHide={onHide}
        onReset={onResetSelectedAssetModel}
      />
    </div>
  );
};