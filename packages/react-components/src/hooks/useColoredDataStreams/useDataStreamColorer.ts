import { type DataStream, type StyleSettingsMap } from '@iot-app-kit/core';
import { Colorizer } from '@iot-app-kit/core-util';
import difference from 'lodash-es/difference';
import { useCallback, useRef } from 'react';
import { bindStyleToDataStream } from '../utils/bindStylesToDataStreams';

type ColorMap = { [key in DataStream['id']]: string | undefined };

const hasColor = (stream: DataStream, styles: StyleSettingsMap): boolean => {
  const streamHasColor = stream.color != null;
  const associatedStyles =
    stream.refId != null ? styles[stream.refId] ?? {} : {};
  const hasAssociatedColor = associatedStyles.color != null;

  return streamHasColor || hasAssociatedColor;
};

export const useDataStreamStyler = (styles?: StyleSettingsMap) => {
  const colorer = useRef(Colorizer());
  const colorMap = useRef<ColorMap>({});

  const getColor = useCallback(
    (id: string) => {
      if (id in colorMap.current) {
        return colorMap.current[id];
      }

      const color = colorer.current.next();
      colorMap.current[id] = color;
      return color;
    },
    [colorMap, colorer]
  );

  const addColorAndStyles = useCallback(
    (datastream: DataStream) => {
      const styled = bindStyleToDataStream(styles)(datastream);

      // Only provide default if one is not already present in the data stream, and none is specified in the associated style settings.
      if (hasColor(styled, styles ?? {})) return styled;

      const color = getColor(styled.id);

      return {
        ...styled,
        color,
      };
    },
    [styles, getColor]
  );

  const styleDatastreams = useCallback(
    (datastreams: DataStream[]) => {
      const activeStreams = datastreams.map(({ id }) => id);
      const colorMappedStreams = Object.keys(colorMap.current);
      const zombieColors = difference(colorMappedStreams, activeStreams);
      colorer.current.add(zombieColors);

      return datastreams.map(addColorAndStyles);
    },
    [colorer, colorMap, addColorAndStyles]
  );

  return { styleDatastreams };
};
