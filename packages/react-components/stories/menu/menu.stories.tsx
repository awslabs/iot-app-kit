import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import type { FC } from 'react';
import Icon from '@cloudscape-design/components/icon';

import { getColor } from '../../src/components/chart/utils/getColor';
import {
  Menu,
  MenuOption,
  MenuProps,
  PositionableMenu,
  PositionableMenuProps,
} from '../../src/components/menu';

const defaultPosition = { x: 10, y: 10, z: 0 };

export default {
  title: 'Builder Components/Menu',
  component: PositionableMenu,
  argTypes: {
    position: { control: { type: 'object' }, defaultValue: defaultPosition },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof PositionableMenu>;

type StoryInputs = PositionableMenuProps;

export const Main: ComponentStory<FC<MenuProps>> = () => (
  <Menu
    onClickOutside={() => {
      console.log('clicked outside');
    }}
  >
    <MenuOption label='Option 1' />
    <MenuOption label='Option 2' />
    <MenuOption label='Option 3' />
    <MenuOption label='Option 4' />
    <MenuOption label='Option 5' />
  </Menu>
);

export const Absolute: ComponentStory<FC<StoryInputs>> = ({ position }) => (
  <PositionableMenu
    onClickOutside={() => {
      console.log('clicked outside');
    }}
    shadow
    open={true}
    position={position ?? defaultPosition}
    options={[
      {
        action: () => {
          console.log('Copy');
        },
        label: 'Copy',
        iconEnd: () => '⌘C',
      },
      {
        action: () => {
          console.log('Paste');
        },
        label: 'Paste',
        iconEnd: () => '⌘V',
      },
      {
        action: () => {
          console.log('Delete');
        },
        label: 'Delete',
        iconEnd: () => 'del',
      },
      {
        action: () => {
          console.log('Bring to Front');
        },
        label: 'Bring to Front',
        iconEnd: () => ']',
      },
      {
        action: () => {
          console.log('Send to Back');
        },
        label: 'Send to Back',
        iconEnd: () => '[',
      },
    ]}
  />
);

const randomOptions = () =>
  Array(5)
    .fill(10)
    .map((v) => ({
      id: (Math.random() * v).toFixed(0),
      color: getColor(),
      label: (Math.random() * v).toFixed(0),
    }));

const ColorIcon = ({ color }: { color: string }) => (
  <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
    <div
      style={{
        height: '4px',
        borderRadius: '6px',
        width: '15px',
        backgroundColor: color,
      }}
    />
  </div>
);

const mins = randomOptions();
const maxs = randomOptions();

export const Relative: ComponentStory<FC<StoryInputs>> = () => {
  const [minOpen, setMinOpen] = useState(false);
  const [maxOpen, setMaxOpen] = useState(false);

  const [highlightedMin, setHighlightedMin] = useState<string>('');
  const [highlightedMax, setHighlightedMax] = useState<string>('');

  const [selectedMin, setSelectedMin] = useState<Record<string, boolean>>({});
  const [selectedMax, setSelectedMax] = useState<Record<string, boolean>>({});

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}
    >
      <div style={{ right: 0, padding: '1rem', position: 'absolute' }}>
        <ColorIcon color={highlightedMin} />
        <br />
        <div>
          {Object.entries(selectedMin).map(([color, visible]) => (
            <div style={{ display: 'flex' }}>
              <ColorIcon color={color} />:{' '}
              <div>{visible ? 'visible' : 'invisible'}</div>
            </div>
          ))}
        </div>
        <br />
        <div>
          {Object.entries(selectedMax).map(([color, visible]) => (
            <div style={{ display: 'flex' }}>
              <ColorIcon color={color} />:{' '}
              <div>{visible ? 'visible' : 'invisible'}</div>
            </div>
          ))}
        </div>
        <br />
        <ColorIcon color={highlightedMax} />
      </div>
      <div style={{ display: 'flex', padding: '1rem' }}>
        <PositionableMenu
          shadow
          open={minOpen}
          offset={[0, 5]}
          referenceElement={(ref) => (
            <div ref={ref}>
              <Menu>
                <MenuOption
                  iconStart={() => (
                    <Icon
                      name={
                        minOpen ? 'caret-down-filled' : 'caret-right-filled'
                      }
                    />
                  )}
                  label='Y-Min'
                  action={() => setMinOpen(!minOpen)}
                />
              </Menu>
            </div>
          )}
        >
          {mins.map(({ color, label }) => (
            <MenuOption
              onPointerEnter={() => setHighlightedMin(color)}
              onPointerLeave={() => setHighlightedMin('')}
              action={() =>
                setSelectedMin({
                  ...selectedMin,
                  [color]: !(color in selectedMin && selectedMin[color]),
                })
              }
              key={color}
              iconStart={() => <ColorIcon color={color} />}
              label={label}
              iconEnd={() => 'RPM'}
            />
          ))}
        </PositionableMenu>
      </div>

      <div style={{ display: 'flex', padding: '1rem' }}>
        <PositionableMenu
          shadow
          open={maxOpen}
          placement='top-start'
          offset={[0, 5]}
          referenceElement={(ref) => (
            <div ref={ref}>
              <Menu>
                <MenuOption
                  iconStart={() => (
                    <Icon
                      name={maxOpen ? 'caret-up-filled' : 'caret-right-filled'}
                    />
                  )}
                  label='Y-Max'
                  action={() => setMaxOpen(!maxOpen)}
                />
              </Menu>
            </div>
          )}
        >
          {maxs.map(({ color, label }) => (
            <MenuOption
              onPointerEnter={() => setHighlightedMax(color)}
              onPointerLeave={() => setHighlightedMax('')}
              action={() =>
                setSelectedMax({
                  ...selectedMax,
                  [color]: !(color in selectedMax && selectedMax[color]),
                })
              }
              key={color}
              iconStart={() => <ColorIcon color={color} />}
              label={label}
              iconEnd={() => 'RPM'}
            />
          ))}
        </PositionableMenu>
      </div>
    </div>
  );
};
