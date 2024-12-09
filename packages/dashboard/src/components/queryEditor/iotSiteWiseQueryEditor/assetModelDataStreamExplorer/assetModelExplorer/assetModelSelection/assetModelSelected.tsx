import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

import { spaceScaledXxs } from '@cloudscape-design/design-tokens';

import { VerticalDivider } from '../../../../../../components/divider/verticalDivider';
import { type SelectedAssetModel } from '../../useSelectedAssetModel';
import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { AssetForAssetModelSelectForm } from '../../assetsForAssetModelSelect/assetForAssetModelSelectForm';
import {
  type SelectedAsset,
  type UpdateSelectedAsset,
} from '../../useSelectedAsset';

import { useModalVisibility } from '../../../../../../hooks/useModalVisibility';
import { ResetAssetModelModal } from './resetAssetModel/resetAssetModelModal';

import { default as assetModelSvg } from './assetModelIcon.svg';

import './assetModelSelected.css';
import { useAssetModel } from '../../../../../../hooks/useAssetModel/useAssetModel';

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
