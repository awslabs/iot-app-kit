import CloudscapeButton from '@cloudscape-design/components/button';
import { memo } from 'react';
import { useDashboardHistory } from './useHistory';

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
