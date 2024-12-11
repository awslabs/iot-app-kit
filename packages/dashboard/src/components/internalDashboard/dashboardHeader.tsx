import { type ReactNode, memo } from 'react';
import { Box, Header, SpaceBetween } from '@cloudscape-design/components';
import { TimeSelection, useViewport } from '@iot-app-kit/react-components';
import isEqual from 'lodash-es/isEqual';
import { useSelector } from 'react-redux';
import { type DashboardState } from '../../store/state-old';
import type { DashboardToolbar } from '#types';
import { convertToDashboardConfiguration } from '../../util/convertToDashbaoardConfiguration';
import Actions from '../actions';
import type { DashboardSave } from '#features/saving/types';

type DashboardHeaderProps = {
  name?: string;
  editable?: boolean;
  toolbar?: DashboardToolbar;
  onSave?: DashboardSave;
};

type DefaultDashboardHeaderProps = DashboardHeaderProps & {
  readOnly: boolean;
};

const HeaderContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{ height: '68px', maxHeight: '68px', boxSizing: 'border-box' }}
      data-testid='iot-app-kit-dashboard-header'
    >
      {children}
    </div>
  );
};

const DefaultDashboardHeader = ({
  name,
  editable,
  readOnly,
  onSave,
}: DefaultDashboardHeaderProps) => {
  const timeZone = useSelector((state: DashboardState) => state.timeZone);
  return (
    <HeaderContainer>
      <Box padding='xs'>
        <Box float='left'>
          <Header variant='h1'>{name}</Header>
        </Box>
        <Box float='right'>
          <SpaceBetween size='s' direction='horizontal' alignItems='end'>
            <TimeSelection isPaginationEnabled timeZone={timeZone} />
            <Actions
              key='3'
              readOnly={readOnly}
              onSave={onSave}
              editable={editable}
            />
          </SpaceBetween>
        </Box>
      </Box>
    </HeaderContainer>
  );
};

const DashboardHeader = ({
  toolbar,
  onSave,
  editable,
  name,
}: DashboardHeaderProps) => {
  const { viewport } = useViewport();
  const mappedDashboardConfiguration = useSelector(
    convertToDashboardConfiguration,
    isEqual
  );
  const readOnly = useSelector((state: DashboardState) => state.readOnly);

  if (toolbar) {
    const userProvidedToolbar = toolbar({
      viewport,
      viewmode: readOnly ? 'preview' : 'edit',
      dashboardConfiguration: mappedDashboardConfiguration,
    });
    return <HeaderContainer>{userProvidedToolbar}</HeaderContainer>;
  }

  return (
    <DefaultDashboardHeader
      name={name}
      editable={editable}
      readOnly={readOnly}
      onSave={onSave}
    />
  );
};

export default memo(DashboardHeader);
