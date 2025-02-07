import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { TimeSelection, useViewport } from '@iot-app-kit/react-components';
import isEqual from 'lodash-es/isEqual';
import { memo, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { type DashboardState } from '~/store/state';
import type { DashboardSave } from '~/types/saving';
import type { DashboardToolbar } from '~/types';
import { convertToDashboardConfiguration } from '~/util/convertToDashboardConfiguration';
import { Actions } from '../actions';

export interface DashboardHeaderProps {
  name?: string;
  editable?: boolean;
  toolbar?: DashboardToolbar;
  onSave?: DashboardSave;
}

export interface DefaultDashboardHeaderProps extends DashboardHeaderProps {
  readOnly: boolean;
}

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

export const DashboardHeader = memo(
  ({ toolbar, onSave, editable, name }: DashboardHeaderProps) => {
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
  }
);
