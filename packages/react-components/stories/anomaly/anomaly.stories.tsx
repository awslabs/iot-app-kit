import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AnomalyWidget } from '../../src/components/anomaly-widget';
import { mockDatasource } from './mockData';

export default {
  title: 'Widgets/Anomaly',
  component: AnomalyWidget,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof AnomalyWidget>;

export const MockDataKPI: ComponentStory<typeof AnomalyWidget> = () => {
  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '350px', width: '500px', padding: '20px' }}>
        <AnomalyWidget
          datasources={[mockDatasource]}
          tooltipSort='value'
          decimalPlaces={2}
          viewport={{
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            end: new Date(),
          }}
          title='Prediction Model 1'
        />
      </div>
    </div>
  );
};
