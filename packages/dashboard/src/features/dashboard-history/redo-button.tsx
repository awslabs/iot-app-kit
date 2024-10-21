import CloudscapeButton from '@cloudscape-design/components/button';
import React, { memo } from 'react';
import { useDashboardHistory } from './use-dashboard-history';

export const RedoButton = memo(() => {
  const { canRedo, redo } = useDashboardHistory();

  return (
    <CloudscapeButton
      ariaLabel='Redo'
      onClick={redo}
      variant='icon'
      iconName='redo'
      disabled={!canRedo}
    />
  );
});
