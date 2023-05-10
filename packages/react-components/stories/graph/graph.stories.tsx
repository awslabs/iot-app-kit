import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { Graph } from '../../src/components/graph';

export default {
  title: 'Widgets/GraphVisualizer',
  component: Graph,
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Graph>;

export const GraphVisualizationExample: ComponentStory<typeof Graph> = () => {
  return (
    <div id='story-container' style={{ width: '500px', height: '500px' }}>
      <Graph />
    </div>
  );
};
