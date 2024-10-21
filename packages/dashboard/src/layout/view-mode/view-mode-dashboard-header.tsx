import CloudscapeButton from '@cloudscape-design/components/button';
import { TimeSelection } from '@iot-app-kit/react-components';
import React, { memo } from 'react';
import { Header } from '~/features/dashboard-header';
import { useMode } from '~/features/dashboard-mode';
import { useDashboardContext } from '~/services/use-dashboard';
import { RefreshRateSelect } from '../../features/refresh-rate';

export const ViewModeDashboardHeader = memo(function () {
  const { enterEditMode } = useMode();
  const { name, timeZone } = useDashboardContext();

  return (
    <Header.Header>
      <Header.PrimaryBar>
        <Header.DashboardName>{name}</Header.DashboardName>

        <Header.PrimaryBarControls>
          <TimeSelection isPaginationEnabled timeZone={timeZone} />
          <RefreshRateSelect />
          <Header.PrimaryBarButtonGroup>
            <CloudscapeButton onClick={enterEditMode}>Edit</CloudscapeButton>
          </Header.PrimaryBarButtonGroup>
        </Header.PrimaryBarControls>
      </Header.PrimaryBar>
    </Header.Header>
  );
});
