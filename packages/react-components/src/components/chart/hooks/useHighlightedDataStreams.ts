import { useCallback } from 'react';
import isEqual from 'lodash.isequal';
import { useChartStore } from '../store';
import { isDataStreamInList } from '../../../utils/isDataStreamInList';
import { DataStreamIdentity } from '../store/contextDataStreams';

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
