import React, { useState } from 'react';
import { useMeasure } from 'react-use';
import { Menu, MenuOption, PositionableMenu } from '../../menu';
import Icon from '@cloudscape-design/components/icon';
import { ColorIcon } from './colorIcon';
import { Value } from '../../shared-components';
import { DataPoint, DataStream, Primitive } from '@iot-app-kit/core';

import { MULTI_Y_AXIS_LEGEND_WIDTH } from '../eChartsConstants';
import { isNumeric, round } from '../../../utils/number';
import { useChartStore } from '../store';

import './yAxisMenu.css';

const getValue = (value: Primitive, significantDigits: number) =>
  isNumeric(value) ? `${round(value, significantDigits)}` : value.toString();

const MENU_OFFSET = 5;

type YAxis = { datastream: DataStream; color: string; significantDigits: number; value: DataPoint };

type YAxisLegendOptions = {
  maxHeight: number;
  label: string;
  axes: YAxis[];
  menuPosition?: 'bottom' | 'top';
};
export const YAxisLegend = ({ maxHeight, label, axes, menuPosition }: YAxisLegendOptions) => {
  const highlightDataStream = useChartStore((state) => state.highlightDataStream);
  const unHighlightDataStream = useChartStore((state) => state.unHighlightDataStream);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSizeRef, { height }] = useMeasure<HTMLDivElement>();

  // (50% widget height) - (menu button height) - (popper offset) - (half menu offset for padding)
  const menuMaxHeight = maxHeight - height - MENU_OFFSET - MENU_OFFSET / 2;

  return (
    <PositionableMenu
      preventViewportOverflow={false}
      classNames='axis-menu'
      styles={{ width: MULTI_Y_AXIS_LEGEND_WIDTH, maxHeight: menuMaxHeight }}
      placement={menuPosition && menuPosition === 'top' ? 'top-start' : 'bottom-start'}
      shadow
      open={menuOpen}
      offset={[0, MENU_OFFSET]}
      referenceElement={(ref) => (
        <div ref={ref}>
          <div ref={menuSizeRef}>
            <Menu>
              <MenuOption
                iconStart={() => (
                  <Icon
                    name={
                      menuOpen
                        ? menuPosition && menuPosition === 'top'
                          ? 'caret-up-filled'
                          : 'caret-down-filled'
                        : 'caret-right-filled'
                    }
                  />
                )}
                label={label}
                action={() => setMenuOpen(!menuOpen)}
              />
            </Menu>
          </div>
        </div>
      )}
    >
      {axes.map(({ datastream, color, value, significantDigits }) => (
        <MenuOption
          classNames='axis-menu-option'
          key={datastream.id}
          iconStart={() => <ColorIcon color={color} />}
          onPointerEnter={() => {
            highlightDataStream(datastream);
          }}
          onPointerLeave={() => {
            unHighlightDataStream(datastream);
          }}
        >
          <div title={getValue(value.y, significantDigits)} className='axis-menu-option-value'>
            <Value value={value.y} precision={significantDigits} />
          </div>
        </MenuOption>
      ))}
    </PositionableMenu>
  );
};
