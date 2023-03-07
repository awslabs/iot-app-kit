import { toId } from '@iot-app-kit/source-iotsitewise';
import { ColumnDefinition, Item } from '@iot-app-kit/table';
import { TableWidget } from '~/customization/widgets/types';
import { mergeAssetQueries } from '~/util/mergeAssetQueries';
import { ExtendedPanelAssetSummary } from '~/components/resourceExplorer/nextResourceExplorer';

// matching current SWM table, we will add customization support in later
const columnDefinitions: ColumnDefinition[] = [
  { key: 'name', header: 'Property', sortingField: 'name' },
  { key: 'value', header: 'Latest value', sortingField: 'value' },
  { key: 'unit', header: 'Unit', sortingField: 'unit' },
];
export const updateWidgetTableSettings: (params: {
  assetSummary: ExtendedPanelAssetSummary;
  widget: TableWidget;
}) => TableWidget = ({ assetSummary, widget }) => {
  const { assetName, queryAssetsParam = [], unit, rawName } = assetSummary;
  const asset = queryAssetsParam[0];
  const items: Item[] = [
    ...(widget.properties.items || []),
    ...asset.properties.map(({ propertyId }) => {
      return {
        name: rawName && assetName && `${rawName} (${assetName})`,
        unit,
        value: {
          $cellRef: {
            id: toId({ assetId: asset.assetId, propertyId }),
            resolution: 0,
          },
        },
      };
    }),
  ];

  return {
    ...widget,
    properties: {
      ...widget.properties,
      queryConfig: {
        ...widget.properties.queryConfig,
        query: {
          assets: mergeAssetQueries(widget.properties.queryConfig.query?.assets || [], asset),
        },
      },
      items,
      columnDefinitions,
    },
  };
};
