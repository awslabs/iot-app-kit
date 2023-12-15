import React, { memo } from 'react';

import { Box, Header, SpaceBetween } from '@cloudscape-design/components';
import { TimeSelection } from '@iot-app-kit/react-components';

import { colorChartsLineGrid, spaceScaledXs, spaceScaledXxxl, spaceScaledXxxs } from '@cloudscape-design/design-tokens';

import Actions from '../actions';
import type { DashboardSave, DashboardWidget } from '~/types';

type DashboardHeaderProps = {
  name?: string;
  editable?: boolean;
  readOnly: boolean;
  dashboardConfiguration: {
    widgets: DashboardWidget<Record<string, unknown>>[];
  };
  grid: {
    enabled: boolean;
    width: number;
    height: number;
    cellSize: number;
  };
  significantDigits: number;
  onSave?: DashboardSave;
};

const Divider = () => (
  <div
    style={{
      width: spaceScaledXxxs,
      height: spaceScaledXxxl,
      margin: `0 ${spaceScaledXs}`,
      background: colorChartsLineGrid,
    }}
  />
);

const DashboardHeader = ({
  name,
  editable,
  readOnly,
  onSave,
  dashboardConfiguration,
  grid,
  significantDigits,
}: DashboardHeaderProps) => (
  <Box padding={{ horizontal: 's', top: 'm' }}>
    <Box float='left'>
      <Header variant='h1'>{name}</Header>
    </Box>
    <Box float='right'>
      <SpaceBetween size='s' direction='horizontal'>
        <TimeSelection isPaginationEnabled hideTitle />
        {editable && (
          <>
            <Divider key='2' />
            <Actions
              key='3'
              readOnly={readOnly}
              onSave={onSave}
              dashboardConfiguration={dashboardConfiguration}
              grid={grid}
              significantDigits={significantDigits}
              editable={editable}
            />
          </>
        )}
      </SpaceBetween>
    </Box>
  </Box>
);

export default memo(DashboardHeader);
