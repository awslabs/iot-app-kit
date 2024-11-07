import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { KPI } from '../../src/components/kpi/kpi';
import {
  MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY,
  MOCK_TIME_SERIES_DATA_QUERY,
} from './kpi-mock-data';

export default {
  title: 'Widgets/KPI',
  component: KPI,
  parameters: {
    showPanel: false,
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof KPI>;

export const KPIThresholds: ComponentStory<typeof KPI> = () => {
  return (
    <div
      style={{
        background: 'grey',
        display: 'grid',
        width: '600px',
        gridTemplateColumns: '250px 250px',
        gridRow: 'auto auto',
        gridColumnGap: '20px',
        gridRowGap: '20px',
      }}
      data-testid='threshold-kpi-story'
    >
      {/* KPI with threshold line + active threshold */}
      <div style={{ height: '200px', width: '250px', padding: '20px' }}>
        <KPI
          thresholds={[
            {
              value: 20,
              id: 'abc',
              color: '#be1c1f',
              comparisonOperator: 'GT',
            },
          ]}
          viewport={{ duration: '5m' }}
          query={MOCK_TIME_SERIES_DATA_QUERY}
        />
      </div>
      {/* KPI with threshold line + inactive threshold */}
      <div style={{ height: '200px', width: '250px', padding: '20px' }}>
        <KPI
          thresholds={[
            {
              value: 500,
              id: 'abc',
              color: '#be1c1f',
              comparisonOperator: 'GT',
            },
          ]}
          viewport={{ duration: '5m' }}
          query={MOCK_TIME_SERIES_DATA_QUERY}
        />
      </div>
      {/* KPI with threshold line + active threshold */}
      <div style={{ height: '200px', width: '250px', padding: '20px' }}>
        <KPI
          thresholds={[
            {
              value: 10,
              id: '123',
              color: '#be1c1f',
              comparisonOperator: 'GT',
              fill: '#be1c1f',
            },
          ]}
          viewport={{ duration: '5m' }}
          query={MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY}
        />
      </div>
      {/* KPI with threshold fill + inactive threshold */}
      <div style={{ height: '200px', width: '250px', padding: '20px' }}>
        <KPI
          thresholds={[
            {
              value: 200,
              id: '123',
              color: '#be1c1f',
              comparisonOperator: 'GT',
              fill: '#be1c1f',
            },
          ]}
          viewport={{ duration: '5m' }}
          query={MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY}
        />
      </div>
    </div>
  );
};
