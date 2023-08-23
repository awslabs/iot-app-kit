import React, { memo } from 'react';
import {
  ComponentLibraryComponentMap,
  ComponentLibraryComponentOrdering,
} from '~/customization/componentLibraryComponentMap';
import PaletteComponent from './component';
import SpaceBetween from '@cloudscape-design/components/space-between';
import './index.css'

const Palette = () => {
  return (
    <>
      <SpaceBetween size='xxxs' direction='horizontal' className='palette-component-left-padding'>
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
