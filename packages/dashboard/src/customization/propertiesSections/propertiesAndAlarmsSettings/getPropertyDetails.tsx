import { AssetSummary, PropertySummary } from '~/components/resourceExplorer/components/mapper';

type DisplayType = 'property' | 'alarm' | 'none';
export const getPropertyDisplay = (
  propertyId: string,
  { properties, alarms, assetName }: AssetSummary
): { property: PropertySummary | undefined; label: string; display: DisplayType } => {
  const property = properties?.find((prop) => prop.propertyId === propertyId);
  if (property) {
    return {
      display: 'property',
      label: (property?.name && assetName && `${property?.name} (${assetName})`) || propertyId,
      property,
    };
  }

  const alarm = alarms
    .flatMap((a) =>
      a.properties.map((p) => ({
        name: a.name,
        property: p,
      }))
    )
    .find((fp) => fp.property.propertyId === propertyId);
  if (alarm) {
    return {
      display: 'alarm',
      label: (alarm?.name && assetName && `${alarm?.name} (${assetName})`) || propertyId,
      property: alarm.property,
    };
  }

  return {
    display: 'none',
    label: propertyId,
    property: undefined,
  };
};
