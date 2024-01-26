import React from 'react';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColorPicker from '../shared/colorPicker';
import type { FC } from 'react';
import type { StyleSettingsMap } from '@iot-app-kit/core';

import './propertyComponent.css';
import { getPropertyDisplay } from './getPropertyDisplay';
import type { AssetSummary } from '~/hooks/useAssetDescriptionQueries';

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
                <ColorPicker
                  color={color || ''}
                  updateColor={onUpdatePropertyColor}
                />
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
