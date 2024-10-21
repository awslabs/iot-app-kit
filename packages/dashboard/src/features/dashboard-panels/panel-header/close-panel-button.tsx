import CloudscapeButton from '@cloudscape-design/components/button';
import React, { memo, useCallback } from 'react';
import { useMode } from '~/features/dashboard-mode';
import { useStoreDispatch } from '~/store';
import { closePanel } from '../panel-store';
import { useOrientation } from '../use-orientation';

export const ClosePanelButton = memo(() => {
  const { mode } = useMode();
  const [orientation] = useOrientation();
  const iconName =
    orientation === 'right'
      ? 'angle-right'
      : orientation === 'left'
      ? 'angle-left'
      : 'angle-down';
  const dispatch = useStoreDispatch();

  const handleClosePanel = useCallback(() => {
    dispatch(closePanel({ mode }));
  }, [mode, dispatch]);

  return (
    <CloudscapeButton
      ariaLabel='Close panel'
      variant='icon'
      iconName={iconName}
      onClick={handleClosePanel}
    />
  );
});
