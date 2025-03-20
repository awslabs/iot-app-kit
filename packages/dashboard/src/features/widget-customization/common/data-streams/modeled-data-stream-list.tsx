import { type AssetQuery } from '@iot-app-kit/source-iotsitewise';
import { type StyleSettingsMap } from '@iot-app-kit/core';

export interface ModeledDataStreamListProps {
  assetQueries: readonly AssetQuery[];
  setAssetQueries: (assetQueries?: readonly AssetQuery[] | undefined) => void;
  styleSettings: StyleSettingsMap;
  setStyleSettings: (styleSettings?: StyleSettingsMap | undefined) => void;
}

export const ModeledDataStreamList = (_props: ModeledDataStreamListProps) => {
  return null;
  /*
  return assetQueries.flatMap(({ assetId, properties }) => {
    return properties.map(({ propertyId, refId = propertyId }) => (
      <ModeledDataStream
        assetId={assetId}
        propertyId={propertyId}
        setName={(name) => {
          setStyleSettings((current = {}) => {
            return {
              ...current,
              [refId]: {
                ...current[refId],
                name,
              },
            };
          });
        }}
        name={styleSettings[refId].name}
        onDelete={() => {
          setAssetQueries((current = []) => {
            return current
              .map((assetQuery) => {
                return {
                  ...assetQuery,
                  properties: assetQuery.properties.filter((property) => {
                    return property.propertyId !== propertyId;
                  }),
                };
              })
              .filter(({ properties }) => properties.length > 0);
          });
        }}
      />
    ));
  });
   */
};
