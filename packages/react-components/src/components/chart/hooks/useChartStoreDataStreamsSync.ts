import { useEffect } from 'react';
import differenceBy from 'lodash.differenceby';
import { DataStream } from '@iot-app-kit/core';
import { DataStreamMetaData } from '../chartOptions/useChartConfiguration';
import { useHighlightedDataStreams } from './useHighlightedDataStreams';
import { useVisibleDataStreams } from './useVisibleDataStreams';

const asComparableDataStream = ({ id }: Pick<DataStream, 'id'>) => ({ id });

export const useChartStoreDataStreamsSync = (
  datastreamMetaDatas: DataStreamMetaData[]
) => {
  const { highlightedDataStreams, unHighlightDataStream } =
    useHighlightedDataStreams();
  const { hiddenDataStreams, unHideDataStream } = useVisibleDataStreams();
  useEffect(() => {
    /**
     * There may be datastreams in the store still
     * but if there are no datastreams on the chart
     * this wont have any affect.
     *
     * This will not cleanup a datastream if only 1 was
     * added to the chart, highlighted / hidden
     * and then removed. There is a bug in useTimeSeriesData
     * where it is not reactive if a query goes from
     * a non-empty state to an empty state
     */
    if (datastreamMetaDatas.length === 0) return;

    const storeDataStreams = [
      ...highlightedDataStreams,
      ...hiddenDataStreams,
    ].map(asComparableDataStream);
    const dataStreamsOnChart = datastreamMetaDatas.map(asComparableDataStream);
    // any datastreams in the store and not on the chart
    const dataStreamsToRemove = differenceBy(
      storeDataStreams,
      dataStreamsOnChart,
      'id'
    );

    dataStreamsToRemove.forEach((dataStream) => {
      unHideDataStream(dataStream);
      unHighlightDataStream(dataStream);
    });
  }, [
    datastreamMetaDatas,
    highlightedDataStreams,
    hiddenDataStreams,
    unHighlightDataStream,
    unHideDataStream,
  ]);
};
