import {
  type AssetSummary,
  type PropertySummary,
} from '~/hooks/useAssetDescriptionQueries';

type DisplayType = 'property' | 'alarm' | 'none';
export const getPropertyDisplay = (
  propertyId: string,
  { properties, alarms, assetName }: AssetSummary
): {
  property: PropertySummary | undefined;
  label: string;
  display: DisplayType;
  assetName?: string;
} => {
  const property = properties?.find((prop) => prop.propertyId === propertyId);
  if (property) {
    return {
      display: 'property',
      label: property?.name ? `${property?.name}` : propertyId,
      assetName: assetName,
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
      label:
        (alarm?.name && assetName && `${alarm?.name} (${assetName})`) ||
        propertyId,
      property: alarm.property,
    };
  }

  return {
    display: 'property',
    label: propertyId,
    property: undefined,
  };
};
