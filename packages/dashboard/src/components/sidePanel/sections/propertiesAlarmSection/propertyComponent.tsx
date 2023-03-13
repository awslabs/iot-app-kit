import React from 'react';
import { Button, Grid, SpaceBetween } from '@cloudscape-design/components';
import ColorPicker from '../../shared/colorPicker';
import type { FC } from 'react';
import type { StyleSettingsMap } from '@iot-app-kit/core';
import type { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';

const defaultMessages = {
  dataType: 'Data Type',
  unit: 'Unit',
};

export type PropertyComponentProps = {
  propertyId: string;
  refId: string;
  assetDescription: DescribeAssetResponse;
  styleSettings: StyleSettingsMap;
  onDeleteAssetQuery: () => void;
  onUpdatePropertyColor: (color: string) => void;
};

export const PropertyComponent: FC<PropertyComponentProps> = ({
  propertyId,
  refId,
  assetDescription,
  styleSettings,
  onDeleteAssetQuery,
  onUpdatePropertyColor,
}) => {
  const assetProperties = assetDescription?.assetProperties;
  const assetProperty = assetProperties?.find((prop) => prop.id === propertyId);
  const defaultName =
    assetProperty?.name && assetDescription?.assetName && `${assetProperty?.name} (${assetDescription?.assetName})`;
  const label = defaultName || propertyId;

  const color = styleSettings[refId]?.color;

  const { dataType, unit, alias } = assetProperty || {};

  return (
    <Grid gridDefinition={[{ colspan: 12 }]}>
      <SpaceBetween size='xxxs' direction='vertical'>
        <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]} disableGutters>
          <div className='threshold-content-item with-gutter grow'>
            <div className='threshold-content-item with-gutter'>
              <ColorPicker color={color || ''} updateColor={onUpdatePropertyColor} />
            </div>
            <span>{label}</span>
          </div>
          <div className='threshold-content-item grow '>
            <div className='justify-content-end'>
              <Button onClick={onDeleteAssetQuery} variant='icon' iconName='close' />
            </div>
          </div>
        </Grid>

        <SpaceBetween size='xs' direction='horizontal'>
          {alias && <small>Alias: {alias}</small>}
          {dataType && (
            <small>
              {defaultMessages.dataType}: {dataType}
            </small>
          )}
          {unit && (
            <small>
              {defaultMessages.unit}: {unit}
            </small>
          )}
        </SpaceBetween>
      </SpaceBetween>
    </Grid>
  );
};
