import { useEffect, useRef } from 'react';

import { DataStream, StyleSettingsMap } from '@iot-app-kit/core';
import { Colorizer } from '@iot-app-kit/core-util';
import difference from 'lodash.difference';

const hasColor = (stream: DataStream, styles: StyleSettingsMap): boolean => {
  const streamHasColor = stream.color != null;
  const associatedStyles =
    stream.refId != null ? styles[stream.refId] ?? {} : {};
  const hasAssociatedColor = associatedStyles.color != null;

  return streamHasColor || hasAssociatedColor;
};

type ColorMap = { [key in DataStream['id']]: string | undefined };

const useColorMap = ({
  dataStreams,
  colorer: customColorer = Colorizer(),
}: {
  dataStreams: DataStream[];
  colorer?: ReturnType<typeof Colorizer>;
}) => {
  const colorer = useRef(customColorer);
  const colorMap = useRef<ColorMap>({});

  useEffect(() => {
    colorer.current = customColorer;
  }, [customColorer]);

  const activeStreams = dataStreams.map(({ id }) => id);
  const colorMappedStreams = Object.keys(colorMap.current);
  const zombieColors = difference(colorMappedStreams, activeStreams);
  colorer.current.add(zombieColors);

  const getColor = (id: string) => {
    if (id in colorMap.current) {
      return colorMap.current[id];
    }

    const color = colorer.current.next();
    colorMap.current[id] = color;
    return color;
  };

  return {
    getColor,
  };
};

export const useColoredDataStreams = ({
  dataStreams,
  colorer: customColorer,
  styleSettings = {},
}: {
  dataStreams: DataStream[];
  colorer?: ReturnType<typeof Colorizer>;
  styleSettings?: StyleSettingsMap;
}) => {
  const { getColor } = useColorMap({ dataStreams, colorer: customColorer });

  const streams = dataStreams.map((stream) => {
    // Only provide default if one is not already present in the data stream, and none is specified in the associated style settings.
    if (hasColor(stream, styleSettings)) return stream;

    const color = getColor(stream.id);

    return {
      ...stream,
      color,
    };
  });

  return streams;
};
