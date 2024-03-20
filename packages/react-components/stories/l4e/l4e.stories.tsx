import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { L4EWidget } from '../../src/components/l4eWidget';

export default {
  title: 'Widgets/L4E',
  component: L4EWidget,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof L4EWidget>;

export const MockDataKPI: ComponentStory<typeof L4EWidget> = () => {
  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '100%', width: '100%', padding: '20px' }}>
        <L4EWidget />
      </div>
    </div>
  );
};
