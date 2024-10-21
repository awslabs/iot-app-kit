import CloudscapeButton from '@cloudscape-design/components/button';
import React, { memo } from 'react';
import { useDashboardHistory } from './use-dashboard-history';

export const UndoButton = memo(() => {
  const { canUndo, undo } = useDashboardHistory();

  return (
    <CloudscapeButton
      ariaLabel='Undo'
      onClick={undo}
      variant='icon'
      iconName='undo'
      disabled={!canUndo}
    />
  );
});
