import React, { ReactNode, memo } from 'react';

import { Box, Header, SpaceBetween } from '@cloudscape-design/components';
import { TimeSelection, useViewport } from '@iot-app-kit/react-components';

import Actions from '../actions';
import type {
  DashboardSave,
  DashboardTimeSeriesSettings,
  DashboardToolbar,
  DashboardWidget,
} from '~/types';
import { useSelector } from 'react-redux';
import { DashboardState } from '~/store/state';
import { parseViewport } from '~/util/parseViewport';

type DashboardHeaderProps = {
  name?: string;
  editable?: boolean;
  toolbar?: DashboardToolbar;
  onSave?: DashboardSave;
};

type DefaultDashboardHeaderProps = DashboardHeaderProps & {
  dashboardConfiguration: {
    widgets: DashboardWidget<Record<string, unknown>>[];
    querySettings?: DashboardTimeSeriesSettings;
  };
  grid: {
    enabled: boolean;
    width: number;
    height: number;
    cellSize: number;
  };
  readOnly: boolean;
};

const HeaderContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ height: '68px', maxHeight: '68px', boxSizing: 'border-box' }}>
      {children}
    </div>
  );
};

const DefaultDashboardHeader = ({
  name,
  editable,
  readOnly,
  onSave,
  dashboardConfiguration,
  grid,
}: DefaultDashboardHeaderProps) => (
  <HeaderContainer>
    <Box padding='xs'>
      <Box float='left'>
        <Header variant='h1'>{name}</Header>
      </Box>
      <Box float='right'>
        <SpaceBetween size='s' direction='horizontal' alignItems='end'>
          <TimeSelection isPaginationEnabled />
          <Actions
            key='3'
            readOnly={readOnly}
            onSave={onSave}
            dashboardConfiguration={dashboardConfiguration}
            grid={grid}
            editable={editable}
          />
        </SpaceBetween>
      </Box>
    </Box>
  </HeaderContainer>
);

const DashboardHeader = ({
  toolbar,
  onSave,
  editable,
  name,
}: DashboardHeaderProps) => {
  const { viewport } = useViewport();
  const dashboardConfiguration = useSelector(
    (state: DashboardState) => state.dashboardConfiguration
  );
  const grid = useSelector((state: DashboardState) => state.grid);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const significantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );

  if (toolbar) {
    const userProvidedToolbar = toolbar({
      viewport,
      viewmode: readOnly ? 'preview' : 'edit',
      dashboardConfiguration: {
        displaySettings: {
          numColumns: grid.width,
          numRows: grid.height,
          cellSize: grid.cellSize,
          significantDigits,
        },
        defaultViewport: parseViewport(dashboardConfiguration.defaultViewport),
        ...dashboardConfiguration,
      },
    });
    return <HeaderContainer>{userProvidedToolbar}</HeaderContainer>;
  }

  return (
    <DefaultDashboardHeader
      name={name}
      editable={editable}
      readOnly={readOnly}
      dashboardConfiguration={dashboardConfiguration}
      grid={grid}
      onSave={onSave}
    />
  );
};

export default memo(DashboardHeader);
