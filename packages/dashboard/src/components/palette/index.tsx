import React, { memo } from 'react';
import {
  colorBorderDividerDefault,
  colorTextBodyDefault,
  spaceFieldHorizontal,
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

/* added left padding as per UX and top padding for positioning Icons Vertically centre */
const palettePadding = {
  padding: `${spaceFieldHorizontal} ${0} ${0} ${spaceFieldHorizontal}`,
};

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
    <div className='widget-panel' style={palettePadding}>
      <h4 style={widgetFont}>Widgets</h4>
      <Divider />
      <ul className='component-palette-widgets'>
        {ComponentLibraryComponentOrdering.map((widgetType) => {
          const [name, iconComponent] = ComponentLibraryComponentMap[widgetType];
          return (
            <PaletteComponent key={widgetType} componentTag={widgetType} name={name} IconComponent={iconComponent} />
          );
        })}
      </ul>
    </div>
  );
};

export default memo(Palette);
