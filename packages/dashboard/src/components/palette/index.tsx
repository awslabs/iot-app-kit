import React, { memo } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { spaceFieldHorizontal } from '@cloudscape-design/design-tokens';
import {
  ComponentLibraryComponentMap,
  ComponentLibraryComponentOrdering,
} from '~/customization/componentLibraryComponentMap';
import PaletteComponent from './component';

/* added left padding as per UX and top padding for positioning Icons Vertically centre */
const palettePadding = {
  padding: `${spaceFieldHorizontal} ${0} ${0} ${spaceFieldHorizontal}`,
};

const Palette = () => {
  return (
    <div style={palettePadding}>
      <SpaceBetween size='xxxs' direction='horizontal'>
        {ComponentLibraryComponentOrdering.map((widgetType) => {
          const [name, iconComponent] = ComponentLibraryComponentMap[widgetType];
          return (
            <PaletteComponent key={widgetType} componentTag={widgetType} name={name} IconComponent={iconComponent} />
          );
        })}
      </SpaceBetween>
    </div>
  );
};

export default memo(Palette);
