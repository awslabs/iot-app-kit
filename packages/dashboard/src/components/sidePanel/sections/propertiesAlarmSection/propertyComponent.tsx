import React, { FC } from 'react';
import { StyleSettingsMap } from '@iot-app-kit/core';
import { Button, Grid, SpaceBetween } from '@cloudscape-design/components';
import ColorPicker from '../../shared/colorPicker';
import { AssetSummary, PropertySummary } from '~/components/resourceExplorer/components/mapper';

const defaultMessages = {
  dataType: 'Data Type',
  unit: 'Unit',
};

type DisplayType = 'property' | 'alarm' | 'none';

const getPropertyDisplay = (
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

export type PropertyComponentProps = {
  propertyId: string;
  refId: string;
  assetSummary: AssetSummary;
  styleSettings: StyleSettingsMap;
  onDeleteAssetQuery: () => void;
  onUpdatePropertyColor: (color: string) => void;
};

export const PropertyComponent: FC<PropertyComponentProps> = ({
  propertyId,
  refId,
  assetSummary,
  styleSettings,
  onDeleteAssetQuery,
  onUpdatePropertyColor,
}) => {
  const { display, property, label } = getPropertyDisplay(propertyId, assetSummary);

  const color = styleSettings[refId]?.color;

  const { dataType, unit, alias } = property || {};

  return (
    <Grid gridDefinition={[{ colspan: 12 }]}>
      <SpaceBetween size='xxxs' direction='vertical'>
        <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]} disableGutters>
          <div className='threshold-content-item with-gutter grow'>
            {display === 'property' && (
              <div className='threshold-content-item with-gutter'>
                <ColorPicker color={color || ''} updateColor={onUpdatePropertyColor} />
              </div>
            )}
            <span>{label}</span>
          </div>
          <div className='threshold-content-item grow '>
            <div className='justify-content-end'>
              <Button onClick={onDeleteAssetQuery} variant='icon' iconName='close' />
            </div>
          </div>
        </Grid>

        {display === 'property' && (
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
        )}
      </SpaceBetween>
    </Grid>
  );
};
