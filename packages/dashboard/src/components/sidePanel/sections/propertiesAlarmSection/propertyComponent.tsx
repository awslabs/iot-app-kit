import React from 'react';
import { Button, SpaceBetween, Box } from '@cloudscape-design/components';
import ColorPicker from '../../shared/colorPicker';
import type { FC } from 'react';
import type { StyleSettingsMap } from '@iot-app-kit/core';
import type { AssetSummary, PropertySummary } from '~/components/resourceExplorer/components/mapper';

import './propertyComponent.css';

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
  const { display, label } = getPropertyDisplay(propertyId, assetSummary);

  const color = styleSettings[refId]?.color;

  return (
    <div className='property-display'>
      <div className='property-display-summary'>
        <SpaceBetween size='xxxs'>
          <Box padding={{ top: 'xxs' }}>
            <SpaceBetween size='xs' direction='horizontal'>
              {display === 'property' && <ColorPicker color={color || ''} updateColor={onUpdatePropertyColor} />}
              {label}
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </div>
      <Button onClick={onDeleteAssetQuery} variant='icon' iconName='close' />
    </div>
  );
};
