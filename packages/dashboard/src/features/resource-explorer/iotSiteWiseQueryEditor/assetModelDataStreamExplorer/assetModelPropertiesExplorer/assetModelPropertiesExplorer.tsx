import React from 'react';

import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { AssetPropertyExplorer } from '@iot-app-kit/react-components';
import { isModeledPropertyInvalid } from '~/features/resource-explorer/helpers/isModeledPropertyInvalid';
import { propertySelectionLabel } from '~/features/resource-explorer/helpers/propertySelectionLabel';
import { DashboardWidget } from '~/types';
import { SelectedAsset } from '../useSelectedAsset';
import {
  SelectedAssetModelProperties,
  UpdateSelectedAssetModelProperties,
} from '../useSelectedAssetModelProperties';

export interface AssetExplorerProps {
  selectedAssetModelProperties: SelectedAssetModelProperties;
  iotSiteWiseClient: IoTSiteWise;
  selectedAsset: SelectedAsset;
  selectAssetModelProperties: UpdateSelectedAssetModelProperties;
  selectedWidgets: DashboardWidget[];
  timeZone?: string;
  significantDigits?: number;
  correctSelectionMode: 'single' | 'multi';
}

export const AssetModelPropertiesExplorer = ({
  iotSiteWiseClient,
  selectedAsset,
  selectedAssetModelProperties,
  selectAssetModelProperties,
  selectedWidgets,
  timeZone,
  significantDigits,
  correctSelectionMode,
}: AssetExplorerProps) => {
  return (
    <AssetPropertyExplorer
      iotSiteWiseClient={iotSiteWiseClient}
      parameters={selectedAsset}
      selectionMode={correctSelectionMode}
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
