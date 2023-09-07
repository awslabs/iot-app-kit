import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { LineChart, WebglContext } from '@iot-app-kit/react-components';

import { TestSelectorComponent } from './utils/testSelector';

export default {
  title: 'React-Components',
  component: LineChart,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof LineChart>;

export const SmokeTest: ComponentStory<typeof LineChart> = () => (
  <>
    <div id='story-container' style={{ width: '500px', height: '300px' }}>
      <LineChart viewport={{ duration: '5m' }} queries={[]} />
      <WebglContext />
    </div>
    {/* Used to check if the page actually loaded */}
    <TestSelectorComponent />
  </>
);
