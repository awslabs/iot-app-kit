import React, { memo } from 'react';
import {
  colorBorderDividerDefault,
  colorTextBodyDefault,
  spaceScaledS,
  spaceScaledXxxs,
  spaceStaticXxl,
} from '@cloudscape-design/design-tokens';
import {
  ComponentLibraryComponentMap,
  ComponentLibraryComponentOrdering,
} from '~/customization/componentLibraryComponentMap';
import PaletteComponent from './component';
import './index.css';

const widgetFont = {
  color: colorTextBodyDefault,
};

const divider = {
  borderLeft: `solid ${spaceScaledXxxs} ${colorBorderDividerDefault}`,
  height: spaceStaticXxl,
  margin: `0 ${spaceScaledS}`,
};

const Divider = () => <div style={divider} />;

const Palette = () => {
  return (
    <div
      className='widget-panel'
      //eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <h4 style={widgetFont}>Widgets</h4>
      <Divider />
      <ul className='component-palette-widgets' aria-label='widget panel'>
        {ComponentLibraryComponentOrdering.map((widgetType) => {
          const [name, iconComponent] =
            ComponentLibraryComponentMap[widgetType];
          return (
            <PaletteComponent
              key={widgetType}
              componentTag={widgetType}
              name={name}
              IconComponent={iconComponent}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default memo(Palette);
