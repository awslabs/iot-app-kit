import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { KPI } from '../../src/kpi/kpi';

export default {
  title: 'KPI',
  component: KPI,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof KPI>;

export const Main: ComponentStory<typeof KPI> = () => <KPI />;

export const ReadOnly: ComponentStory<typeof KPI> = () => <KPI />;
