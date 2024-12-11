import { useDispatch, useSelector } from 'react-redux';

import {
  onChangeDashboardCellSizeAction,
  onChangeDashboardHeightAction,
  onChangeDashboardWidthAction,
} from '../../store/actions';
import { onUpdateSignificantDigitsAction } from '../../store/actions/updateSignificantDigits';
import { type DashboardState } from '../../store/state-old';

export const useGridSettings = () => {
  const dispatch = useDispatch();

  const { width, height, cellSize } = useSelector(
    (state: DashboardState) => state.grid
  );
  const significantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );

  const onChangeNumberOfColumns = (columns: number) => {
    dispatch(onChangeDashboardWidthAction({ width: columns }));
  };
  const onChangeNumberOfRows = (rows: number) => {
    dispatch(onChangeDashboardHeightAction({ height: rows }));
  };
  const onChangeCellSize = (updatedCellSize: number) => {
    dispatch(onChangeDashboardCellSizeAction({ cellSize: updatedCellSize }));
  };
  const onChangeSignificantDigits = (updatedSignificantDigits: number) => {
    dispatch(
      onUpdateSignificantDigitsAction({
        significantDigits: updatedSignificantDigits,
      })
    );
  };

  return {
    rows: height,
    columns: width,
    cellSize,
    significantDigits,
    onChangeCellSize,
    onChangeNumberOfColumns,
    onChangeNumberOfRows,
    onChangeSignificantDigits,
  };
};
