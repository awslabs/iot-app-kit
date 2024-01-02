import { TrendCursorsData } from '../../state';
import { TrendCursorValue } from '../../types';

export type SetTrendCursorValuesAction = {
  type: 'SET_TREND_CURSOR_VALUES';
  payload: {
    trendCursorValues: TrendCursorValue[];
  };
};

export const onSetTrendCursorValues = (
  trendCursorValues: TrendCursorValue[]
): SetTrendCursorValuesAction => ({
  type: 'SET_TREND_CURSOR_VALUES',
  payload: {
    trendCursorValues,
  },
});

export const setTrendCursorValue = (
  trendCursorValue: TrendCursorValue,
  trendCursorValuesMap: TrendCursorsData['trendCursorValues']
) => {
  const { id, trendCursorId } = trendCursorValue;
  const currentTrendCursorValueMap = trendCursorValuesMap[trendCursorId] ?? {};
  return {
    ...trendCursorValuesMap,
    [trendCursorValue.trendCursorId]: {
      ...currentTrendCursorValueMap,
      [id]: trendCursorValue,
    },
  };
};

export const setTrendCursorValues = (
  { trendCursorValues }: SetTrendCursorValuesAction['payload'],
  trendCursorValuesMap: TrendCursorsData['trendCursorValues']
) => {
  return {
    ...trendCursorValues.reduce(
      (mapping, trendCursorValue) =>
        setTrendCursorValue(trendCursorValue, mapping),
      trendCursorValuesMap
    ),
  };
};
