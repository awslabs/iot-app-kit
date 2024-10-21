import type {
  AlarmExplorerProps,
  AlarmResource,
} from '@iot-app-kit/react-components';

export function alarmSelectionLabel(
  selectedItems: AlarmExplorerProps['selectedAlarms'],
  modeledDataStream: AlarmResource
) {
  const isPropertySelected = selectedItems?.find(
    (item) =>
      item.assetCompositeModelId === modeledDataStream.assetCompositeModelId
  );

  if (!isPropertySelected) {
    return `Select alarm data stream ${modeledDataStream.name}`;
  } else {
    return `Deselect alarm data stream ${modeledDataStream.name}`;
  }
}
