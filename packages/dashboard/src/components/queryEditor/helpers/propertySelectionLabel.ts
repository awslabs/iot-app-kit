import {
  type AssetPropertyExplorerProps,
  type AssetPropertyResource,
} from '@iot-app-kit/react-components';
import { isModeledPropertyInvalid } from './isModeledPropertyInvalid';
import { type DashboardWidget } from '../../../types';

export function propertySelectionLabel(
  selectedItems: AssetPropertyExplorerProps['selectedAssetProperties'],
  modeledDataStream: AssetPropertyResource,
  selectedWidgets: DashboardWidget[]
) {
  if (
    isModeledPropertyInvalid(
      modeledDataStream.dataType,
      selectedWidgets?.at(0)?.type
    )
  ) {
    return `${modeledDataStream.dataType} data not supported for the selected widget`;
  }

  const isPropertySelected = selectedItems?.find(
    (item) => item.propertyId === modeledDataStream.propertyId
  );

  if (!isPropertySelected) {
    return `Select modeled data stream ${modeledDataStream.name}`;
  } else {
    return `Deselect modeled data stream ${modeledDataStream.name}`;
  }
}
