import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { Graph } from '../../dist/es/components/graph';
import { colors } from '../../dist/es/components/graph/cytoscape-cloudscape-theme';

export default {
  title: 'Widgets/Graph',
  component: Graph,
  argTypes: {
    ...Object.entries(colors).reduce((acc, [key, value]) => {
      acc[value] = {
        control: {
          type: 'color',
          label: key,
        },
      };

      return acc;
    }, {} as { [key: string]: { control: { type: string; label: string } } }),
  },
} as ComponentMeta<typeof Graph>;

export const Basic: ComponentStory<typeof Graph> = () => {
  return (
    <div id='story-container' style={{ width: '100%', height: '100%' }}>
      <Graph />
    </div>
  );
};

export const InContainers: ComponentStory<typeof Graph> = () => {
  return (
    <div id='story-container' style={{ width: '100%', height: '100%' }}>
      <div style={{ width: '500px', height: '300px' }}>
        <Graph />
      </div>
    </div>
  );
};

export const OverrideStyles: ComponentStory<typeof Graph> = () => {
  return (
    <div id='story-container' style={{ width: '100%', height: '100%' }}>
      <Graph
        style={
          {
            [colors.nodeBackground]: 'yellow',
            [colors.nodeBorder]: 'red',
            [colors.node]: 'purple',
            [colors.edge]: 'blue',
            [colors.edgeBackground]: 'green',
            [colors.edgeBorder]: 'purple',
            [colors.nodeBackgroundSelected]: 'red',
            [colors.nodeBorderSelected]: 'yellow',
            [colors.nodeSelected]: 'yellow',
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export const MultipleInstances: ComponentStory<typeof Graph> = () => {
  return (
    <div id='story-container' style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
      <Graph />
      <Graph
        style={
          {
            [colors.nodeBackground]: 'yellow',
            [colors.nodeBorder]: 'red',
            [colors.node]: 'purple',
            [colors.edge]: 'blue',
            [colors.edgeBackground]: 'green',
            [colors.edgeBorder]: 'purple',
            [colors.nodeBackgroundSelected]: 'red',
            [colors.nodeBorderSelected]: 'yellow',
            [colors.nodeSelected]: 'yellow',
          } as React.CSSProperties
        }
      />
    </div>
  );
};
