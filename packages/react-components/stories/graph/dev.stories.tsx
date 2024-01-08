import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import KnowledgeGraphDecorator from './graphDecorator';
import {
  KnowledgeGraphContainer,
  KnowledgeGraphInterface,
} from '../../src/components/knowledge-graph/KnowledgeGraphPanel';
import { colors } from '../../src/components/knowledge-graph/graph/cytoscape-cloudscape-theme';
import { response, response3 } from './sample-responses';

const Template = (props: KnowledgeGraphInterface) => (
  <div id='story-container' style={{ width: '100%', height: '100%' }}>
    <KnowledgeGraphContainer {...props} />
  </div>
);
const TemplateInContainer = (props: KnowledgeGraphInterface) => (
  <div id='story-container' style={{ width: '100%', height: '100%' }}>
    <div style={{ width: '600px', height: '500px' }}>
      <KnowledgeGraphContainer {...props} />
    </div>
  </div>
);

export default {
  title: 'Widgets/KnowledgeGraph/Dev',
  component: KnowledgeGraphContainer,
  decorators: [KnowledgeGraphDecorator],
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
} as ComponentMeta<typeof KnowledgeGraphContainer>;

export const Basic: ComponentStory<typeof KnowledgeGraphContainer> =
  Template.bind({});
Basic.parameters = {
  KG: {
    queryResult: response3,
  },
};

export const InContainers: ComponentStory<typeof KnowledgeGraphContainer> =
  TemplateInContainer.bind({});
InContainers.parameters = {
  KG: {
    queryResult: response,
  },
};

export const OverrideStyles: ComponentStory<typeof KnowledgeGraphContainer> =
  Template.bind({});
OverrideStyles.parameters = {
  KG: {
    queryResult: response3,
  },
};
OverrideStyles.args = {
  style: {
    [colors.nodeBackground]: 'yellow',
    [colors.nodeBorder]: 'red',
    [colors.node]: 'purple',
    [colors.edge]: 'blue',
    [colors.edgeBackground]: 'green',
    [colors.edgeBorder]: 'purple',
    [colors.nodeBackgroundSelected]: 'red',
    [colors.nodeBorderSelected]: 'yellow',
    [colors.nodeSelected]: 'yellow',
  } as React.CSSProperties,
};
