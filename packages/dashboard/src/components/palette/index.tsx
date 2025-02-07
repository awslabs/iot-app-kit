import { memo } from 'react';
import {
  colorBorderDividerDefault,
  colorTextHeadingDefault,
  spaceScaledS,
  spaceScaledXxxs,
  spaceStaticXxl,
} from '@cloudscape-design/design-tokens';
import { PaletteComponent } from './component';
import './index.css';
import {
  type RegisteredWidgetType,
  Registry,
} from '~/features/widget-plugins/registry';

const widgetFont = {
  color: colorTextHeadingDefault,
};

const divider = {
  borderLeft: `solid ${spaceScaledXxxs} ${colorBorderDividerDefault}`,
  height: spaceStaticXxl,
  margin: `0 ${spaceScaledS}`,
};

const Divider = () => <div style={divider} />;

export interface PaletteProps {
  onAddWidget: (widgetType: RegisteredWidgetType) => void;
}

export const Palette = memo(({ onAddWidget }: PaletteProps) => {
  const widgetPlugins = Registry.list();

  return (
    <div
      className='widget-panel'
      //eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <h4 style={widgetFont}>Widgets</h4>
      <Divider />
      <ul className='component-palette-widgets' aria-label='widget panel'>
        {widgetPlugins.map(({ configuration: { type, name, icon } }) => {
          return (
            <PaletteComponent
              key={type}
              componentTag={type}
              widgetName={name}
              icon={icon}
              onAddWidget={onAddWidget}
            />
          );
        })}
      </ul>
    </div>
  );
});
