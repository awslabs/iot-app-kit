import React from 'react';
import { Button, SpaceBetween, Box } from '@cloudscape-design/components';
import ColorPicker from '../shared/colorPicker';
import type { FC } from 'react';
import type { StyleSettingsMap } from '@iot-app-kit/core';
import type { AssetSummary } from '~/components/resourceExplorer/components/mapper';

import './propertyComponent.css';
import { getPropertyDisplay } from './getPropertyDetails';

export type PropertyComponentProps = {
  propertyId: string;
  refId: string;
  assetSummary: AssetSummary;
  styleSettings: StyleSettingsMap;
  onDeleteAssetQuery: () => void;
  onUpdatePropertyColor: (color: string) => void;
  colorable: boolean;
};

export const PropertyComponent: FC<PropertyComponentProps> = ({
  propertyId,
  refId,
  assetSummary,
  styleSettings,
  onDeleteAssetQuery,
  onUpdatePropertyColor,
  colorable,
}) => {
  const { display, label } = getPropertyDisplay(propertyId, assetSummary);

  const color = styleSettings[refId]?.color;

  return (
    <div className='property-display'>
      <div className='property-display-summary'>
        <SpaceBetween size='xxxs'>
          <Box padding={{ top: 'xxs' }}>
            <SpaceBetween size='xs' direction='horizontal'>
              {colorable && display === 'property' && (
                <ColorPicker color={color || ''} updateColor={onUpdatePropertyColor} />
              )}
              {label}
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </div>
      <Button onClick={onDeleteAssetQuery} variant='icon' iconName='close' />
    </div>
  );
};
