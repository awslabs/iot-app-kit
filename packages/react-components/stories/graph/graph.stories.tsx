import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { Graph } from '../../src/components/knowledge-graph/graph';
import { colors } from '../../src/components/knowledge-graph/graph/cytoscape-cloudscape-theme';
import { getElementsDefinition } from '../../src/components/knowledge-graph/utils';
import { mockNodeData } from './mock-data';

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
const nodeData = [...mockNodeData.values()];
const elements = getElementsDefinition(nodeData);

export const Basic: ComponentStory<typeof Graph> = () => {
  return (
    <div id='story-container' style={{ width: '100%', height: '100%' }}>
      <Graph elements={elements} />
    </div>
  );
};

export const InContainers: ComponentStory<typeof Graph> = () => {
  return (
    <div id='story-container' style={{ width: '100%', height: '100%' }}>
      <div style={{ width: '500px', height: '300px' }}>
        <Graph elements={elements} />
      </div>
    </div>
  );
};

export const OverrideStyles: ComponentStory<typeof Graph> = () => {
  return (
    <div id='story-container' style={{ width: '100%', height: '100%' }}>
      <Graph
        elements={elements}
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
      <Graph elements={elements} />
      <Graph
        elements={elements}
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
