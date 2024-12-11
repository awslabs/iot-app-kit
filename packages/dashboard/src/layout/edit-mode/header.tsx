import { TimeSelection } from '@iot-app-kit/react-components';
import { memo } from 'react';
import { UndoButton } from '#features/history/undoButton';
import { RedoButton } from '#features/history/redoButton';
import { CancelButton } from '#features/saving/cancelButton';
import { SaveButton } from '#features/saving/saveButton';
import { RefreshRateSelect } from '~/features/refreshRate/refreshRateSelect';
import { WidgetBar } from '~/features/widgetCreation';
import { useMeta } from '#meta/useMeta';
import * as DashboardHeader from '#layout/common/header';

export const EditModeDashboardHeader = memo(() => {
  const { name, timeZone } = useMeta();

  return (
    <DashboardHeader.Header>
      <DashboardHeader.PrimaryBar>
        <DashboardHeader.DashboardName>{name}</DashboardHeader.DashboardName>

        <DashboardHeader.PrimaryBarControls>
          <TimeSelection isPaginationEnabled timeZone={timeZone} />
          <RefreshRateSelect />
          <DashboardHeader.PrimaryBarButtonGroup>
            <UndoButton />
            <RedoButton />
            <CancelButton />
            <SaveButton />
          </DashboardHeader.PrimaryBarButtonGroup>
        </DashboardHeader.PrimaryBarControls>
      </DashboardHeader.PrimaryBar>
      <WidgetBar />
    </DashboardHeader.Header>
  );
});
