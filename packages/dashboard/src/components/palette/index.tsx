import React from 'react';
import {
  ComponentLibraryComponentMap,
  ComponentLibraryComponentOrdering,
} from '~/customization/componentLibraryComponentMap';
import PaletteComponent from './component';

import './index.css';
import type { DashboardMessages } from '~/messages';

export type ComponentPaletteProps = {
  messageOverrides: DashboardMessages;
};

const Palette: React.FC<ComponentPaletteProps> = ({ messageOverrides }) => {
  return (
    <div>
      <h1 className='iot-dashboard-toolbar-title'>{messageOverrides.toolbar.componentLibrary.title}</h1>
      <div className='component-palette'>
        {ComponentLibraryComponentOrdering.map((widgetType) => {
          const [name, iconComponent] = ComponentLibraryComponentMap[widgetType];
          return (
            <PaletteComponent key={widgetType} componentTag={widgetType} name={name} IconComponent={iconComponent} />
          );
        })}
      </div>
    </div>
  );
};

export default Palette;
