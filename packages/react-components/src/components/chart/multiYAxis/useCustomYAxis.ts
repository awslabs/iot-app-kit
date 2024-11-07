import { type DataStream } from '@iot-app-kit/core';
import { useChartStore } from '../store';
import { type YAxisLegendOption } from '../types';
import { type YAxisMap } from '../store/multiYAxis';

type HandleMapOptionsProps = {
  map: YAxisMap;
  handleClear: (datastreamId: string) => void;
  datastreams: DataStream[];
};

const handleMapOptions = ({
  map,
  handleClear,
  datastreams,
}: HandleMapOptionsProps) =>
  Object.entries(map).map(([datastreamId, value]) => {
    const datastream = datastreams.find(({ id }) => id === datastreamId);
    if (!datastream) handleClear(datastreamId);
    return {
      datastream,
      ...value,
    };
  });

export const useCustomYAxis = (datastreams: DataStream[]) => {
  const yMaxes = useChartStore((state) => state.yMaxes);
  const yMins = useChartStore((state) => state.yMins);
  const handleClear = useChartStore((state) => state.clearYAxis);

  const yMax: YAxisLegendOption[] = handleMapOptions({
    map: yMaxes,
    datastreams,
    handleClear,
  });

  const yMin: YAxisLegendOption[] = handleMapOptions({
    map: yMins,
    datastreams,
    handleClear,
  });

  return {
    yMax,
    yMin,
  };
};
