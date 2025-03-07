import { type AssetQuery } from '@iot-app-kit/source-iotsitewise';
import { ModeledDataStream } from '~/features/widget-customization/common/data-streams/modeled-data-stream';
import { type StyleSettingsMap } from '@iot-app-kit/core';

export interface ModeledDataStreamListProps {
  assetQueries: readonly AssetQuery[];
  setAssetQueries: (assetQueries?: readonly AssetQuery[] | undefined) => void;
  styleSettings: StyleSettingsMap;
  setStyleSettings: (styleSettings?: StyleSettingsMap | undefined) => void;
}

export const ModeledDataStreamList = ({
  assetQueries,
  setAssetQueries,
  styleSettings,
  setStyleSettings,
}: ModeledDataStreamListProps) => {
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
};
