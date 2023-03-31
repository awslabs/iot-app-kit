import React, { memo } from 'react';
import {
  ComponentLibraryComponentMap,
  ComponentLibraryComponentOrdering,
} from '~/customization/componentLibraryComponentMap';
import PaletteComponent from './component';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

const Palette = () => {
  return (
    <>
      <Box variant='awsui-key-label'>Component library</Box>
      <SpaceBetween size='xs' direction='horizontal'>
        {ComponentLibraryComponentOrdering.map((widgetType) => {
          const [name, iconComponent] = ComponentLibraryComponentMap[widgetType];
          return (
            <PaletteComponent key={widgetType} componentTag={widgetType} name={name} IconComponent={iconComponent} />
          );
        })}
      </SpaceBetween>
    </>
  );
};

export default memo(Palette);
