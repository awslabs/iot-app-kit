import React from 'react';
import {
  Button,
  SpaceBetween,
  Box,
  ExpandableSection,
} from '@cloudscape-design/components';
import ColorPicker from '../shared/colorPicker';
import type { FC } from 'react';
import type { StyleSettingsMap } from '@iot-app-kit/core';

import './propertyComponent.css';
import { getPropertyDisplay } from './getPropertyDisplay';
import type { AssetSummary } from '~/hooks/useAssetDescriptionQueries';
import { DataStreamLabelComponent } from '../components/dataStreamLabelComponent';
import { spaceStaticXl } from '@cloudscape-design/design-tokens';

export type PropertyComponentProps = {
  propertyId: string;
  refId: string;
  assetSummary: AssetSummary;
  styleSettings: StyleSettingsMap;
  onDeleteAssetQuery: () => void;
  onUpdatePropertyColor: (color: string) => void;
  onUpdatePropertyName: (name: string) => void;
  colorable: boolean;
  nameable?: boolean;
};

export const PropertyComponent: FC<PropertyComponentProps> = ({
  propertyId,
  refId,
  assetSummary,
  styleSettings,
  onDeleteAssetQuery,
  onUpdatePropertyColor,
  onUpdatePropertyName,
  colorable,
  nameable = true,
}) => {
  const { display, label, property, assetName } = getPropertyDisplay(
    propertyId,
    assetSummary
  );

  const color = styleSettings[refId]?.color;
  const name = styleSettings[refId]?.name;

  const header = (
    <div className='property-display'>
      <div
        className='property-display-summary'
        style={{ display: 'flex', width: '100%' }}
      >
        <SpaceBetween size='xs'>
          <Box padding={{ top: 'xxs' }}>
            <SpaceBetween size='xs' direction='horizontal'>
              {colorable && display === 'property' && (
                <ColorPicker
                  color={color || ''}
                  updateColor={onUpdatePropertyColor}
                />
              )}
              <span>
                {name ?? label} {assetName && `(${assetName})`}
              </span>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </div>
      <Button
        ariaLabel='delete property'
        onClick={onDeleteAssetQuery}
        variant='icon'
        iconName='close'
      />
    </div>
  );

  if (!nameable) {
    return header;
  }

  return (
    <div>
      <Box color='text-body-secondary'>
        <ExpandableSection headerText={header} disableContentPaddings={true}>
          <div style={{ padding: `0 ${spaceStaticXl}` }}>
            <DataStreamLabelComponent
              name={name}
              updateName={onUpdatePropertyName}
              propertyName={property?.name ?? ''}
            />
          </div>
        </ExpandableSection>
      </Box>
    </div>
  );
};
