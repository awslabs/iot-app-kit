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

  return !isPropertySelected
    ? `Select alarm data stream ${modeledDataStream.name}`
    : `Deselect alarm data stream ${modeledDataStream.name}`;
}
