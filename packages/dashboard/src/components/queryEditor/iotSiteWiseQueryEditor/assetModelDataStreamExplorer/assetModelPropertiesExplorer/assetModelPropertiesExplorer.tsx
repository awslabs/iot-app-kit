import React from 'react';

import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import {
  SelectedAssetModelProperties,
  UpdateSelectedAssetModelProperties,
} from '../useSelectedAssetModelProperties';
import { AssetPropertyExplorer } from '@iot-app-kit/react-components';
import { SelectedAsset } from '../useSelectedAsset';
import { isModeledPropertyInvalid } from '~/components/queryEditor/helpers/isModeledPropertyInvalid';
import { propertySelectionLabel } from '~/components/queryEditor/helpers/propertySelectionLabel';
import { DashboardWidget } from '~/types';

export interface AssetExplorerProps {
  selectedAssetModelProperties: SelectedAssetModelProperties;
  iotSiteWiseClient: IoTSiteWise;
  selectedAsset: SelectedAsset;
  selectAssetModelProperties: UpdateSelectedAssetModelProperties;
  selectedWidgets: DashboardWidget[];
  timeZone?: string;
  significantDigits?: number;
}

export const AssetModelPropertiesExplorer = ({
  iotSiteWiseClient,
  selectedAsset,
  selectedAssetModelProperties,
  selectAssetModelProperties,
  selectedWidgets,
  timeZone,
  significantDigits,
}: AssetExplorerProps) => {
  return (
    <AssetPropertyExplorer
      iotSiteWiseClient={iotSiteWiseClient}
      parameters={selectedAsset}
      selectionMode='multi'
      onSelectAssetProperty={selectAssetModelProperties}
      selectedAssetProperties={selectedAssetModelProperties}
      tableSettings={{
        isFilterEnabled: true,
        isUserSettingsEnabled: true,
      }}
      isAssetPropertyDisabled={(item) =>
        isModeledPropertyInvalid(item.dataType, selectedWidgets.at(0)?.type)
      }
      ariaLabels={{
        resizerRoleDescription: 'Resize button',
        itemSelectionLabel: ({ selectedItems }, modeledDataStream) =>
          propertySelectionLabel(
            [...selectedItems],
            modeledDataStream,
            selectedWidgets
          ),
      }}
      timeZone={timeZone}
      significantDigits={significantDigits}
    />
  );
};
