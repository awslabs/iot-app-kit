import { PropertyDataType } from '@aws-sdk/client-iotsitewise';
import { isDefined } from '~/util/isDefined';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '~/components/dragLayer/itemTypes';
import { ResourcePanelItem } from '~/components/resourceExplorer/components/panel';

type MultiAssetPropertyDropOptions = {
  drop: (item: ResourcePanelItem) => void;
  allowedDataTypes: PropertyDataType[];
};

export const useMultiAssetPropertyDrop = ({ drop, allowedDataTypes }: MultiAssetPropertyDropOptions) => {
  return useDrop(
    () => ({
      accept: [ItemTypes.ResourceExplorerAssetProperty, ItemTypes.ResourceExplorerAlarm],
      drop,
      canDrop: (item, monitor) =>
        monitor.getItemType() === ItemTypes.ResourceExplorerAlarm ||
        item.assetSummary.properties
          .map(({ dataType }) => dataType)
          .filter(isDefined)
          .every((type) => allowedDataTypes.includes(type as PropertyDataType)),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [drop]
  );
};
