import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { DashboardState } from '../../../../store/state';
import { useInput } from '../../utils';
import { StyleSettingsMap } from '@iot-app-kit/core';
import { Grid, Icon, SpaceBetween } from '@cloudscape-design/components';
import { PropertyComponentMessages } from '../../../../messages';

export type PropertyComponentProps = {
  assetId: string;
  propertyId: string;
  refId: string;
  onDeleteAssetQuery: () => void;
  message: PropertyComponentMessages;
};

export const PropertyComponent: FC<PropertyComponentProps> = ({
  assetId,
  propertyId,
  refId,
  onDeleteAssetQuery,
  message,
}) => {
  const assetDescription = useSelector((state: DashboardState) => state.assetsDescriptionMap)?.[assetId];
  const assetProperties = assetDescription?.assetProperties;
  const assetProperty = assetProperties?.find((prop) => prop.id === propertyId);
  const label = (assetProperty?.name && `${assetProperty.name} (${assetDescription?.assetName || ''})`) || propertyId;
  const [styleSettings = {}, updateStyleSettings] = useInput<StyleSettingsMap>(`styleSettings`);
  const color = styleSettings[refId]?.color;
  const { dataType, unit, alias } = assetProperty || {};
  const updatePropertyColor = (color: string) =>
    updateStyleSettings({
      ...styleSettings,
      [refId]: {
        ...styleSettings[refId],
        color,
      },
    });

  return (
    <Grid gridDefinition={[{ colspan: 12 }]}>
      <SpaceBetween size="xxxs">
        <SpaceBetween size={'xxxs'} direction={'horizontal'}>
          <div className="color-picker-container" style={{ backgroundColor: color }}>
            <input
              type="color"
              value={color}
              onChange={(e) => {
                updatePropertyColor(e.target.value);
              }}
            />
          </div>
          <span>{label}</span>
          <div onClick={onDeleteAssetQuery} style={{ flex: 'end' }}>
            <Icon name={'close'} />
          </div>
        </SpaceBetween>

        <SpaceBetween size={'xxs'} direction={'horizontal'}>
          {alias && <small>{alias}</small>}
        </SpaceBetween>
        <SpaceBetween size={'xxs'} direction={'horizontal'}>
          {dataType && (
            <small>
              {message.dataType}: {dataType}
            </small>
          )}
          {unit && (
            <small>
              {message.unit}: {unit}
            </small>
          )}
        </SpaceBetween>
      </SpaceBetween>
    </Grid>
  );
};
