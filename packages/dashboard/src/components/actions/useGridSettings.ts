import { useDispatch, useSelector } from 'react-redux';

import { DashboardState } from '~/store/state';
import {
  onChangeDashboardCellSizeAction,
  onChangeDashboardHeightAction,
  onChangeDashboardStretchToFitAction,
  onChangeDashboardWidthAction,
} from '~/store/actions';

export const useGridSettings = () => {
  const dispatch = useDispatch();

  const { width, height, cellSize, stretchToFit } = useSelector((state: DashboardState) => state.grid);

  const onToggleStretchToFit = (updatedStretchToFit: boolean) => {
    dispatch(onChangeDashboardStretchToFitAction({ stretchToFit: updatedStretchToFit }));
  };
  const onChangeNumberOfColumns = (columns: number) => {
    dispatch(onChangeDashboardWidthAction({ width: columns }));
  };
  const onChangeNumberOfRows = (rows: number) => {
    dispatch(onChangeDashboardHeightAction({ height: rows }));
  };
  const onChangeCellSize = (updatedCellSize: number) => {
    dispatch(onChangeDashboardCellSizeAction({ cellSize: updatedCellSize }));
  };

  return {
    rows: height,
    columns: width,
    cellSize,
    stretchToFit,
    onToggleStretchToFit,
    onChangeCellSize,
    onChangeNumberOfColumns,
    onChangeNumberOfRows,
  };
};
