import {
  type AssetPropertyExplorerProps,
  type AssetPropertyResource,
} from '@iot-app-kit/react-components';
import { isModeledPropertyInvalid } from './isModeledPropertyInvalid';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export function propertySelectionLabel(
  selectedItems: AssetPropertyExplorerProps['selectedAssetProperties'],
  modeledDataStream: AssetPropertyResource,
  selectedWidgets: WidgetInstance[]
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

  return !isPropertySelected
    ? `Select modeled data stream ${modeledDataStream.name}`
    : `Deselect modeled data stream ${modeledDataStream.name}`;
}
