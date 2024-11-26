import isEqual from 'lodash-es/isEqual';
import { useCallback } from 'react';
import { isDataStreamInList } from '../../../utils/isDataStreamInList';
import { useChartStore } from '../store';
import { type DataStreamIdentity } from '../store/contextDataStreams';

export const useHighlightedDataStreams = () => {
  const { highlightDataStream, unHighlightDataStream } = useChartStore(
    (state) => ({
      highlightDataStream: state.highlightDataStream,
      unHighlightDataStream: state.unHighlightDataStream,
    }),
    isEqual
  );
  const highlightedDataStreams = useChartStore(
    (state) => state.highlightedDataStreams,
    isEqual
  );
  const isDataStreamHighlighted = useCallback(
    (datastream: DataStreamIdentity) =>
      isDataStreamInList(highlightedDataStreams)(datastream),
    [highlightedDataStreams]
  );

  const toggleHighlighted = useCallback(
    (datastream: DataStreamIdentity) => {
      if (isDataStreamHighlighted(datastream)) {
        unHighlightDataStream(datastream);
      } else {
        highlightDataStream(datastream);
      }
    },
    [isDataStreamHighlighted, unHighlightDataStream, highlightDataStream]
  );

  return {
    toggleHighlighted,
    isDataStreamHighlighted,
    highlightDataStream,
    unHighlightDataStream,
    highlightedDataStreams,
  };
};
