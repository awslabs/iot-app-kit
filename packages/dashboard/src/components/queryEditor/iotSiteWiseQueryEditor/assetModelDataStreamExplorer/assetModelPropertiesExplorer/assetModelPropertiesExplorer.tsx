import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import {
  type SelectedAssetModelProperties,
  type UpdateSelectedAssetModelProperties,
} from '../useSelectedAssetModelProperties';
import { AssetPropertyExplorer } from '@iot-app-kit/react-components';
import { type SelectedAsset } from '../useSelectedAsset';
import { isModeledPropertyInvalid } from '~/components/queryEditor/helpers/isModeledPropertyInvalid';
import { propertySelectionLabel } from '~/components/queryEditor/helpers/propertySelectionLabel';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface AssetModelPropertiesExplorerProps {
  selectedAssetModelProperties: SelectedAssetModelProperties;
  iotSiteWiseClient: IoTSiteWise;
  selectedAsset: SelectedAsset;
  selectAssetModelProperties: UpdateSelectedAssetModelProperties;
  selectedWidgets: WidgetInstance[];
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
}: AssetModelPropertiesExplorerProps) => {
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
