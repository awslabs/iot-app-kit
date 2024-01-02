import { DataStream } from '@iot-app-kit/core';
import { ChartOptions } from '../../types';
import {
  ChartStyleSettingsWithDefaults,
  Emphasis,
  getDefaultStyles,
  getStyles,
} from '../../utils/getStyles';
import merge from 'lodash.merge';

type ConvertChartOptions = Pick<
  ChartOptions,
  'defaultVisualizationType' | 'styleSettings' | 'significantDigits'
>;

export const convertStyles =
  ({
    defaultVisualizationType,
    styleSettings,
    significantDigits,
    emphasis,
    hidden,
  }: ConvertChartOptions & { emphasis?: Emphasis } & { hidden?: boolean }) =>
  ({
    refId,
    color,
  }: Pick<DataStream, 'refId' | 'color'>): ChartStyleSettingsWithDefaults => {
    const defaultStyles = getDefaultStyles(
      defaultVisualizationType,
      significantDigits
    );
    const userDefinedStyles = getStyles(refId, styleSettings);

    const emphasisWithDefault = emphasis ?? 'none';
    const hiddenWithDefault = hidden ?? false;

    return merge(
      defaultStyles,
      { color },
      userDefinedStyles,
      { emphasis: emphasisWithDefault },
      { hidden: hiddenWithDefault }
    );
  };
