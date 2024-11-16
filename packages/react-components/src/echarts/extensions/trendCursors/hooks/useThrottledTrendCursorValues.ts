import throttle from 'lodash.throttle';
import { useEffect, useRef, useState } from 'react';
import useDataStore, { type StateData } from '../../../../store';
import {
  type TrendCursor,
  type TrendCursorValues,
  trendCursorValuesForGroup,
  trendCursorsForGroup,
} from '../store';

const THROTTLE_RATE = 1000;

type UpdateFunction = (state: StateData) => void;
const noop = () => {};

export const useThrottledTrendCursorValues = ({
  group,
  chartId,
}: {
  group: string;
  chartId?: string;
}) => {
  const [trendCursors, setTrendCursors] = useState<TrendCursor[]>([]);
  const [trendCursorValues, setTrendCursorValues] = useState<
    TrendCursorValues[]
  >([]);

  const handleUpdate = useRef<UpdateFunction>(noop);

  useEffect(() => {
    handleUpdate.current = throttle((state: StateData) => {
      setTrendCursors(trendCursorsForGroup(group, state));
      setTrendCursorValues(trendCursorValuesForGroup(group, state));
    }, THROTTLE_RATE);
  }, [group, chartId]);

  useEffect(() => {
    useDataStore.subscribe((state) => {
      handleUpdate.current(state);
    });
  }, [group, chartId]);

  return {
    trendCursors,
    trendCursorValues,
  };
};
