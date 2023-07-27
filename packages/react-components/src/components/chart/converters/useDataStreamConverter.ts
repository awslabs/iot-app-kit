import { useMemo } from "react";

import { DataStream } from "@iot-app-kit/core";

type MapperFunc<T> = (dataStream: DataStream) => T;
type ReducerFunc<T, K> = (acc: K, input: T) => K;

/**
 * 
 * @param dataStreams Data streams to map / reduce over
 * @param mapper Mapper function to map relevant information for each data stream
 * @param reducer Reducer function to combine any mapped data from the data stream
 * @param initialReducer Initial values for the reducer
 * @returns 
 */
export const useDataStreamConverter = <A, B>(dataStreams: DataStream[], mapper: MapperFunc<A>, reducer: ReducerFunc<A, B>, initialReducer: B) => {
  return useMemo(() => {
    return dataStreams
      .map(mapper)
      .reduce(reducer, initialReducer);
  }, [dataStreams]);
};
