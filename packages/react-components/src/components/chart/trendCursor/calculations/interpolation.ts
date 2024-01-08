import { DEFAULT_PRECISION } from '../../eChartsConstants';
import { Visualization } from '../../types';

export interface handleDataValueInterpolationProps {
  visualization: Visualization;
  data: Array<number[]>;
  timestampInMs: number;
  leftIndex: number;
  rightIndex: number;
}

// this function handles the interpolation based on the chart visualization type
export const handleDataValueInterpolation = ({
  visualization,
  data,
  timestampInMs,
  leftIndex,
  rightIndex,
}: handleDataValueInterpolationProps): number => {
  switch (visualization) {
    case 'step-end': {
      return data[leftIndex][1];
    }
    case 'bar':
    case 'step-middle': {
      // if the TC is closer to left , we pick left value
      // if the TC is closer to right, we pick right value
      const timeMin = data[leftIndex][0];
      const timeMax = data[rightIndex][0];
      const LeftDelta = Math.abs(timeMin - timestampInMs);
      const rightDelta = Math.abs(timeMax - timestampInMs);
      const ratio = Number(
        (LeftDelta / rightDelta).toPrecision(DEFAULT_PRECISION)
      );
      if (ratio < 1) {
        return data[leftIndex][1];
      } else {
        return data[rightIndex][1];
      }
    }
    case 'step-start': {
      return data[rightIndex][1];
    }
    default: {
      // Linear interpolating the value between left and right indexes
      const valueMin = data[leftIndex][1];
      const valueMax = data[rightIndex][1];
      const timeMin = data[leftIndex][0];
      const timeMax = data[rightIndex][0];
      const a = (timestampInMs - timeMin) / (timeMax - timeMin);
      const delta = valueMax - valueMin === 0 ? 0 : a * (valueMax - valueMin);
      return delta + valueMin;
    }
  }
};
