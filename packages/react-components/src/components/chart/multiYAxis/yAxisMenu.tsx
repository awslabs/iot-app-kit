import React, { useState } from 'react';
import { useMeasure } from 'react-use';
import { isNumeric, round } from '@iot-app-kit/core-util';
import { Primitive } from '@iot-app-kit/core';

import Icon from '@cloudscape-design/components/icon';
import {
  borderRadiusDropdown,
  colorBackgroundDropdownItemHover,
  colorBorderControlDefault,
  spaceScaledS,
  spaceScaledXs,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import Box from '@cloudscape-design/components/box';

import { Menu, MenuOption, PositionableMenu } from '../../menu';
import { ColorIcon } from '../legend/colorIcon';
import { Value } from '../../shared-components';
import { MULTI_Y_AXIS_LEGEND_WIDTH } from '../eChartsConstants';
import { YAxisLegendOption } from '../types';
import { useHighlightedDataStreams } from '../hooks/useHighlightedDataStreams';

import './yAxisMenu.css';

const getValue = (value: Primitive, significantDigits = 4) =>
  isNumeric(value) ? `${round(value, significantDigits)}` : value.toString();

const MENU_OFFSET = 5;
const MENU_FONT_SIZE = 14;

type YAxisLegendOptions = {
  maxHeight: number;
  label: string;
  axes: YAxisLegendOption[];
  menuPosition?: 'bottom' | 'top';
};
export const YAxisLegend = ({
  maxHeight,
  label,
  axes,
  menuPosition,
}: YAxisLegendOptions) => {
  const {
    highlightDataStream,
    unHighlightDataStream,
    isDataStreamHighlighted,
  } = useHighlightedDataStreams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSizeRef, { height }] = useMeasure<HTMLDivElement>();

  // (50% widget height) - (menu button height) - (popper offset) - (half menu offset for padding)
  const menuMaxHeight = maxHeight - height - MENU_OFFSET - MENU_OFFSET / 2;

  return (
    <PositionableMenu
      preventViewportOverflow={false}
      classNames='axis-menu'
      styles={{ width: MULTI_Y_AXIS_LEGEND_WIDTH, maxHeight: menuMaxHeight }}
      placement={
        menuPosition && menuPosition === 'top' ? 'top-start' : 'bottom-start'
      }
      shadow
      open={menuOpen}
      offset={[0, MENU_OFFSET]}
      referenceElement={(ref) => (
        <div ref={ref}>
          <div ref={menuSizeRef}>
            <Menu
              styles={{
                fontSize: MENU_FONT_SIZE,
                backgroundColor: colorBackgroundDropdownItemHover,
              }}
            >
              <MenuOption
                styles={{
                  boxShadow: `0 0 0 ${spaceScaledXxxs} ${colorBorderControlDefault}`,
                  borderRadius: borderRadiusDropdown,
                }}
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
                action={() => setMenuOpen(!menuOpen)}
              >
                <Box fontWeight='bold'>{label}</Box>
              </MenuOption>
            </Menu>
          </div>
        </div>
      )}
    >
      {axes.map(({ datastream, color, value, significantDigits }) => (
        <MenuOption
          classNames='axis-menu-option'
          styles={{
            padding: `${spaceScaledXs} ${spaceScaledS}`,
          }}
          key={datastream?.id}
          iconStart={() => <ColorIcon color={color} />}
          onPointerEnter={() => {
            highlightDataStream(datastream);
          }}
          onPointerLeave={() => {
            unHighlightDataStream(datastream);
          }}
          iconEnd={() => (
            <span className='axis-menu-option-value'>{datastream?.unit}</span>
          )}
          highlighted={datastream ? isDataStreamHighlighted(datastream) : false}
        >
          <div
            title={
              value
                ? getValue(value, significantDigits)
                : 'No visible data points'
            }
            className='axis-menu-option-value'
          >
            {value != null ? (
              <Value value={value} precision={significantDigits} />
            ) : (
              <Box color='text-status-inactive' fontSize='body-s' variant='p'>
                No data
              </Box>
            )}
          </div>
        </MenuOption>
      ))}
    </PositionableMenu>
  );
};
