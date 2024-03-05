import { DataStream } from "@iot-app-kit/core";
import isEqual from "lodash.isequal";
import { useEffect, useState } from "react";

export type DataStreamIdentifiers =
  Pick<DataStream, 'id' | 'name' | 'refId' | 'color' | 'dataType' | 'detailedName' | 'unit'>;

const toDataStreamIdentifiers = (dataStreams: DataStream[]): DataStreamIdentifiers[] =>
  dataStreams.map(
    ({ id, name, color, refId, dataType, detailedName, unit, }) => ({
      id,
      name,
      color,
      refId,
      dataType,
      detailedName,
      unit,
    })
  );

export const useDataStreamIdentifiers = (datastreams: DataStream[]) => {
  /**
   * keeping local state for the datastream identification info so that we can control when this dependency
   * actually changes the styling of the chart. The dataStream reference is always new from useTimeSeries data so we
   * must create a new variable that does not change unless the identifying information about the widget
   * query has changed.
   */
  const [dataSteamIdentifiers, setDataStreamIdentifiers] = useState(
    toDataStreamIdentifiers(datastreams)
  );

  useEffect(() => {
    const mappedDataStreams = toDataStreamIdentifiers(datastreams);
    if (isEqual(mappedDataStreams, dataSteamIdentifiers)) return;
    setDataStreamIdentifiers(mappedDataStreams);
  }, [datastreams, dataSteamIdentifiers]);

  return dataSteamIdentifiers;
};
