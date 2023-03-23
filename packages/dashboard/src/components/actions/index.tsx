import React, { memo } from 'react';
import { useDispatch } from 'react-redux';

import { Button, SpaceBetween, FormField } from '@cloudscape-design/components';
import { onToggleReadOnly } from '~/store/actions';
import type { DashboardMessages } from '~/messages';
import type { DashboardState } from '~/store/state';
import { isEqual, pick } from 'lodash';
import { DashboardSave } from '~/types';

export type ActionsProps = {
  messageOverrides: DashboardMessages;
  grid: DashboardState['grid'];
  readOnly: boolean;
  dashboardConfiguration: DashboardState['dashboardConfiguration'];
  onSave?: DashboardSave;
};

const Actions: React.FC<ActionsProps> = ({ dashboardConfiguration, messageOverrides, readOnly, onSave }) => {
  const dispatch = useDispatch();

  const handleOnSave = () => {
    if (!onSave) return;
    onSave(dashboardConfiguration);
  };

  const handleOnReadOnly = () => {
    dispatch(onToggleReadOnly());
  };

  return (
    <FormField label={messageOverrides.toolbar.actions.title}>
      <SpaceBetween size='s' direction='horizontal'>
        {onSave && <Button onClick={handleOnSave}>{messageOverrides.toolbar.actions.save}</Button>}
        <Button onClick={handleOnReadOnly}>{readOnly ? 'Edit' : 'Preview'}</Button>
      </SpaceBetween>
    </FormField>
  );
};

const gridAsComparable = (grid: DashboardState['grid']) => pick(grid, ['height', 'width', 'cellSize', 'stretchToFit']);
const actionsComparator = (a: Readonly<ActionsProps>, b: Readonly<ActionsProps>): boolean => {
  const gridIsSame = isEqual(gridAsComparable(a.grid), gridAsComparable(b.grid));
  const dashboardConfigurationIsSame = isEqual(a.dashboardConfiguration, b.dashboardConfiguration);
  return gridIsSame && dashboardConfigurationIsSame;
};

export default memo(Actions, actionsComparator);
