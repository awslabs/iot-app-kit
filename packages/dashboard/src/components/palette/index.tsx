import { memo } from 'react';
import {
  colorBorderDividerDefault,
  colorTextHeadingDefault,
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
  color: colorTextHeadingDefault,
};

const divider = {
  borderLeft: `solid ${spaceScaledXxxs} ${colorBorderDividerDefault}`,
  height: spaceStaticXxl,
  margin: `0 ${spaceScaledS}`,
};

const Divider = () => <div style={divider} />;

type PaletteOptions = {
  onAddWidget: (componentTag: string) => void;
};

const Palette = ({ onAddWidget }: PaletteOptions) => {
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
              onAddWidget={onAddWidget}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default memo(Palette);
