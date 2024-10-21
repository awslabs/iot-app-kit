import { TimeSelection } from '@iot-app-kit/react-components';
import React, { memo } from 'react';
import { Header } from '~/features/dashboard-header';
import { RedoButton, UndoButton } from '~/features/dashboard-history';
import { CancelButton, SaveButton } from '~/features/dashboard-saving';
import { RefreshRateSelect } from '~/features/refresh-rate/refresh-rate-select';
import { WidgetBar } from '~/features/widget-creation';
import { useDashboardContext } from '~/services/use-dashboard';

export const EditModeDashboardHeader = memo(() => {
  const { name, timeZone } = useDashboardContext();

  return (
    <Header.Header>
      <Header.PrimaryBar>
        <Header.DashboardName>{name}</Header.DashboardName>
        <Header.PrimaryBarControls>
          <TimeSelection isPaginationEnabled timeZone={timeZone} />
          <RefreshRateSelect />
          <Header.PrimaryBarButtonGroup>
            <UndoButton />
            <RedoButton />
            <CancelButton />
            <SaveButton />
          </Header.PrimaryBarButtonGroup>
        </Header.PrimaryBarControls>
      </Header.PrimaryBar>
      <WidgetBar />
    </Header.Header>
  );
});
