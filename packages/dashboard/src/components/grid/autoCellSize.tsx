import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { onChangeDashboardCellSizeAction } from '~/store/actions';

export type AutoCellSizeProps = {
  width: number;
  cellSize: number;
  children: React.ReactNode;
};
export const AutoCellSize: React.FC<AutoCellSizeProps> = ({ width, cellSize, children }) => {
  const [measureRef, { width: measuredWidth }] = useMeasure<HTMLDivElement>();

  const dispatch = useDispatch();

  useEffect(() => {
    // Add one to the width to account for the grid padding
    const fittedCellSize = measuredWidth / (width + 1);

    /**
     * Ensures consistency between cellSize and fittedCellSize by acting as a safeguard.
     * Proactively maintains the relationship between fittedCellSize and the measured width
     * to desired width ratio, averting potential discrepancies caused by external cellSize changes.
     */
    if (cellSize !== fittedCellSize) {
      dispatch(onChangeDashboardCellSizeAction({ cellSize: fittedCellSize }));
    }
  }, [measuredWidth, width, cellSize]);

  return <div ref={measureRef}>{children}</div>;
};
