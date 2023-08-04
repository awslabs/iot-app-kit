import { useMemo, useRef } from 'react';
import { DataStream } from '@iot-app-kit/core';
import { ChartOptions, ChartStyleSettingsOptions } from '../types';
import { getDefaultStyles, getStyles } from '../utils/getStyles';

type ConvertChartOptions = Pick<ChartOptions, 'defaultVisualizationType' | 'styleSettings'>;

export const convertStyles =
  ({ defaultVisualizationType, styleSettings, colorIndex }: ConvertChartOptions & { colorIndex?: number }) =>
  ({ refId }: DataStream): ChartStyleSettingsOptions => {
    const defaultStyles = getDefaultStyles(colorIndex, defaultVisualizationType);
    const userDefinedStyles = getStyles(refId, styleSettings);

    return { ...defaultStyles, ...userDefinedStyles };
  };

export type StyleSettingsMap = {
  [key in string]: ChartStyleSettingsOptions;
};
type ColorIndexMap = {
  [key in string]: number;
};

export const getChartStyleSettingsFromMap =
  (map: StyleSettingsMap) =>
  (datastream: DataStream): ChartStyleSettingsOptions =>
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
  const datastreamDeps = JSON.stringify(datastreams.map(({ id, refId }) => `${id}-${refId}`));
  const optionsDeps = JSON.stringify(chartOptions);

  const colorIndexRef = useRef(0);
  const chartColorIndices = useRef<ColorIndexMap>({});

  chartColorIndices.current = useMemo(() => {
    const currentColorIndices = chartColorIndices.current;
    let index = colorIndexRef.current;
    const map = datastreams.reduce<ColorIndexMap>((indexMap, datastream) => {
      const currentIndex = currentColorIndices[datastream.id];
      if (currentIndex === undefined) {
        indexMap[datastream.id] = index;
        index = index + 1;
      } else {
        indexMap[datastream.id] = currentIndex;
      }
      return indexMap;
    }, {});
    colorIndexRef.current = index;
    return map;
  }, [datastreamDeps]);

  return useMemo(() => {
    const map = datastreams.reduce<StyleSettingsMap>((styleMap, datastream) => {
      const colorIndex = chartColorIndices.current[datastream.id];
      styleMap[datastream.id] = convertStyles({ ...chartOptions, colorIndex })(datastream);
      return styleMap;
    }, {});
    return [map, getChartStyleSettingsFromMap(map)] as const;
  }, [datastreamDeps, optionsDeps]);
};
