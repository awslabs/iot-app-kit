import CloudscapeButton from '@cloudscape-design/components/button';
import { TimeSelection } from '@iot-app-kit/react-components';
import { memo } from 'react';
import * as DashboardHeader from '#layout/common/header';
import { useMode } from '#features/mode/useMode';
import { useMeta } from '#meta/useMeta';
import { RefreshRateSelect } from '~/features/refreshRate';

export const ViewModeDashboardHeader = memo(() => {
  const { enterEditMode } = useMode();
  const { name, timeZone } = useMeta();

  return (
    <DashboardHeader.Header>
      <DashboardHeader.PrimaryBar>
        <DashboardHeader.DashboardName>{name}</DashboardHeader.DashboardName>

        <DashboardHeader.PrimaryBarControls>
          <TimeSelection isPaginationEnabled timeZone={timeZone} />
          <RefreshRateSelect />
          <DashboardHeader.PrimaryBarButtonGroup>
            <CloudscapeButton onClick={enterEditMode}>Edit</CloudscapeButton>
          </DashboardHeader.PrimaryBarButtonGroup>
        </DashboardHeader.PrimaryBarControls>
      </DashboardHeader.PrimaryBar>
    </DashboardHeader.Header>
  );
});
