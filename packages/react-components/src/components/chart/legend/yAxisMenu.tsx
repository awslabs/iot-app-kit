import React, { useState } from 'react';
import { Menu, MenuOption, PositionableMenu } from '../../menu';
import Icon from '@cloudscape-design/components/icon';
import { ColorIcon } from './colorIcon';
import { Value } from '../../shared-components';
import { DataPoint } from '@iot-app-kit/core';

import './yAxisMenu.css';

const yAxisCorrectlyFormed = (yAxis: YAxis): yAxis is Required<YAxis> => !!yAxis.color && !!yAxis.value;

type YAxis = { color?: string; significantDigits?: number; value?: DataPoint };

type YAxisLegendOptions = {
  label: string;
  axes: YAxis[];
  menuPosition?: 'bottom' | 'top'
};
export const YAxisLegend = ({ label, axes, menuPosition }: YAxisLegendOptions) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const options = axes.filter(yAxisCorrectlyFormed);

  return (
    <PositionableMenu
      placement={menuPosition && menuPosition === 'top' ? 'top-start' : 'bottom-start'}
      shadow
      open={menuOpen}
      offset={[0, 5]}
      referenceElement={(ref) => (
        <div ref={ref}>
          <Menu classNames='axis-menu'>
            <MenuOption
              iconStart={() => <Icon name={menuOpen ? menuPosition && menuPosition === 'top' ? 'caret-up-filled' : 'caret-down-filled' : 'caret-right-filled'} />}
              label={label}
              action={() => setMenuOpen(!menuOpen)}
            />
          </Menu>
        </div>
      )}
    >
      {options.map(({ color, value, significantDigits, }) => (
        <MenuOption
          classNames={'axis-menu-option'}
          // onPointerEnter={() => setHighlightedMin(color)}
          // onPointerLeave={() => setHighlightedMin('')}
          // action={() => setSelectedMin({ ...selectedMin, [color]: !(color in selectedMin && selectedMin[color]) })}
          key={color}
          iconStart={() => <ColorIcon color={color} />}
          // iconEnd={() => 'RPM'}
        >
          <Value value={value.y} precision={significantDigits} />
        </MenuOption>
      ))}
    </PositionableMenu>
  );
};
