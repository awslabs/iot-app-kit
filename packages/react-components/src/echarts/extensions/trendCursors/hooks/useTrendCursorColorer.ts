import { Colorizer } from '@iot-app-kit/core-util';
import { useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';
import useDataStore from '../../../../store';
import {
  type TrendCursor,
  type TrendCursorGroupId,
  trendCursorsForGroup,
} from '../store';

const TRENDCURSOR_COLOR_PALETTE = [
  '#7492e7',
  '#da7596',
  '#2ea597',
  '#a783e1',
  '#e07941',
];

const colorsFromTrendCursors = (trendCursors: TrendCursor[]) =>
  trendCursors
    .map(({ color }) => color)
    .filter((color): color is string => color != null);

export const useTrendCursorColorer = (group: TrendCursorGroupId) => {
  const colorer = useRef(Colorizer(TRENDCURSOR_COLOR_PALETTE));
  const trendCursorColors = useDataStore(
    (state) => colorsFromTrendCursors(trendCursorsForGroup(group, state)),
    isEqual
  );

  useEffect(() => {
    colorer.current = Colorizer(TRENDCURSOR_COLOR_PALETTE);
    colorer.current.remove(trendCursorColors);
  }, [trendCursorColors]);

  return colorer;
};
