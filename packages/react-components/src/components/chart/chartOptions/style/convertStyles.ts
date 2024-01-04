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
    hidden,
  }: ConvertChartOptions & { emphasis?: Emphasis } & { hidden?: boolean }) =>
  ({ refId, color }: DataStream): ChartStyleSettingsWithDefaults => {
    const defaultStyles = getDefaultStyles(defaultVisualizationType, significantDigits);
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
  // read from store
  const highlightedDataStreams = useChartStore((state) => state.highlightedDataStreams);
  const hiddenDataStreams = useChartStore((state) => state.hiddenDataStreams);

  // dependencies converted to string
  // useEffect performs an equal check on the previous and current values , for object it check the reference
  // if the reference has changed i.e. new element but has the same value, the useEffect is triggered, to avoid this
  // strings are used to compare
  const datastreamDeps = JSON.stringify(datastreams.map(({ id, refId }) => `${id}-${refId}`));
  const { defaultVisualizationType, styleSettings, significantDigits } = chartOptions;
  const usedOptions = { defaultVisualizationType, styleSettings, significantDigits };
  const optionsDeps = JSON.stringify(usedOptions);
  const shouldUseEmphasis = highlightedDataStreams.length > 0;

  return useMemo(() => {
    // Use to see if we should emphasize / de-emphasize trends
    const map = datastreams.reduce<StyleSettingsMap>((styleMap, datastream) => {
      const isDatastreamHighlighted = isDataStreamInList(highlightedDataStreams)(datastream);
      const emphasis: Emphasis = shouldUseEmphasis ? (isDatastreamHighlighted ? 'emphasize' : 'de-emphasize') : 'none';
      const isDatastreamHidden = isDataStreamInList(hiddenDataStreams)(datastream);
      styleMap[datastream.id] = convertStyles({ ...chartOptions, emphasis, hidden: isDatastreamHidden })(datastream);
      return styleMap;
    }, {});
    return [map, getChartStyleSettingsFromMap(map)] as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datastreamDeps, optionsDeps, shouldUseEmphasis, highlightedDataStreams, hiddenDataStreams]);
};
