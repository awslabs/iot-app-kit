import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { onChangeDashboardCellSizeAction } from '~/store/actions';

export type AutoCellSizeProps = {
  width: number;
  children: React.ReactNode;
};
export const AutoCellSize: React.FC<AutoCellSizeProps> = ({ width, children }) => {
  const [measureRef, { width: measuredWidth }] = useMeasure<HTMLDivElement>();

  const dispatch = useDispatch();

  useEffect(() => {
    // Add one to the width to account for the grid padding
    const cellSize = measuredWidth / (width + 1);
    dispatch(onChangeDashboardCellSizeAction({ cellSize }));
  }, [measuredWidth]);

  return <div ref={measureRef}>{children}</div>;
};
