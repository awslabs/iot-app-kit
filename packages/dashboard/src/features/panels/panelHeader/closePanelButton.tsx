import { memo, useCallback } from 'react';
import { useMode } from '#features/mode/useMode';
import { useStoreDispatch } from '#store/hooks';
import { closePanel } from '../store';
import { useOrientation } from '../useOrientation';
import { IconButton } from '@iot-app-kit/atoms';

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
    <IconButton
      ariaLabel='Close panel'
      iconName={iconName}
      onClick={handleClosePanel}
    />
  );
});
