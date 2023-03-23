import React, { memo } from 'react';
import {
  ComponentLibraryComponentMap,
  ComponentLibraryComponentOrdering,
} from '~/customization/componentLibraryComponentMap';
import PaletteComponent from './component';
import FormField from '@cloudscape-design/components/form-field';
import SpaceBetween from '@cloudscape-design/components/space-between';

import type { DashboardMessages } from '~/messages';

export type ComponentPaletteProps = {
  messageOverrides: DashboardMessages;
};

const Palette: React.FC<ComponentPaletteProps> = ({ messageOverrides }) => {
  return (
    <FormField label={messageOverrides.toolbar.componentLibrary.title}>
      <SpaceBetween size='xs' direction='horizontal'>
        {ComponentLibraryComponentOrdering.map((widgetType) => {
          const [name, iconComponent] = ComponentLibraryComponentMap[widgetType];
          return (
            <PaletteComponent key={widgetType} componentTag={widgetType} name={name} IconComponent={iconComponent} />
          );
        })}
      </SpaceBetween>
    </FormField>
  );
};

export default memo(Palette);
