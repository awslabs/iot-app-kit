import { useMemo } from 'react';
import { DataStream } from '@iot-app-kit/core';
import { ChartOptions } from '../../types';
import { ChartStyleSettingsWithDefaults, Emphasis, getDefaultStyles, getStyles } from '../../utils/getStyles';
import { useChartStore } from '../../store';
import { isDataStreamInList } from '../../../../utils/isDataStreamInList';
import merge from 'lodash.merge';

type ConvertChartOptions = Pick<ChartOptions, 'defaultVisualizationType' | 'styleSettings' | 'significantDigits'>;

export const convertStyles =
  ({
    defaultVisualizationType,
    styleSettings,
    significantDigits,
    emphasis,
  }: ConvertChartOptions & { emphasis?: Emphasis }) =>
  ({ refId, color }: DataStream): ChartStyleSettingsWithDefaults => {
    const defaultStyles = getDefaultStyles(defaultVisualizationType, significantDigits);
    const userDefinedStyles = getStyles(refId, styleSettings);

    const emphasisWithDefault = emphasis ?? 'none';

    return merge(defaultStyles, { color }, userDefinedStyles, { emphasis: emphasisWithDefault });
  };

export type StyleSettingsMap = {
  [key in string]: ChartStyleSettingsWithDefaults;
};

export const getChartStyleSettingsFromMap =
  (map: StyleSettingsMap) =>
  (datastream: DataStream): ChartStyleSettingsWithDefaults =>
    map[datastream.id];

/**
 * Hook that provides a way to get configured ChartStyleSettingsOptions for a given datastream
 *
 * These ChartStyleSettingsOptions are stored in an object map where the key is the datastream.id and the value is ChartStyleSettingsOptions
 *
 * colors are kept consistent by mapping a number to the datastream.id
 * the number is used to pick from a list of default colors
 *
 * @returns [StyleSettingsMap, (datastream: DataStream) => ChartStyleSettingsOptions]
 */
export const useChartStyleSettings = (datastreams: DataStream[], chartOptions: ConvertChartOptions) => {
  const highlightedDataStreams = useChartStore((state) => state.highlightedDataStreams);
  const isDataStreamHighlighted = isDataStreamInList(highlightedDataStreams);

  const datastreamDeps = JSON.stringify(datastreams.map(({ id, refId }) => `${id}-${refId}`));
  const optionsDeps = JSON.stringify(chartOptions);

  return useMemo(() => {
    // Use to see if we should emphasize / de-emphasize trends
    const shouldUseEmphasis = highlightedDataStreams.length > 0;

    const map = datastreams.reduce<StyleSettingsMap>((styleMap, datastream) => {
      const isDatastreamHighlighted = isDataStreamHighlighted(datastream);
      const emphasis: Emphasis = shouldUseEmphasis ? (isDatastreamHighlighted ? 'emphasize' : 'de-emphasize') : 'none';
      styleMap[datastream.id] = convertStyles({ ...chartOptions, emphasis })(datastream);
      return styleMap;
    }, {});
    return [map, getChartStyleSettingsFromMap(map)] as const;
    // disabling because dataStreams and options are stringified
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datastreamDeps, optionsDeps, highlightedDataStreams, isDataStreamHighlighted]);
};
