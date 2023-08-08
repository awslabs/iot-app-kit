import { useMemo, useRef } from 'react';
import { DataStream } from '@iot-app-kit/core';

const mapDatastreamsDeps = (datastreams: DataStream[]) =>
  JSON.stringify(datastreams.map((datastream) => datastream.id));

export const useChartSetOptionSettings = (datastreams: DataStream[]) => {
  const datastreamsDeps = mapDatastreamsDeps(datastreams);
  const datastreamsDepsRef = useRef(datastreamsDeps);

  return useMemo(() => {
    /**
     * if the datastreams change update echarts using the replaceMerge stratgey
     * so that it is ensured that orphaned data points are removed.
     *
     * NOTE: we can use this hook to refactor trend cursor set option also
     */
    const settings = datastreamsDepsRef.current !== datastreamsDeps ? { replaceMerge: ['series'] } : undefined;
    datastreamsDepsRef.current = datastreamsDeps;
    return settings;
  }, [datastreams]);
};
