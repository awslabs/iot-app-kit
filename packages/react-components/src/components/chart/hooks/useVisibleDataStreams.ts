import { useCallback } from 'react';
import isEqual from 'lodash.isequal';
import { useChartStore } from '../store';
import { isDataStreamInList } from '../../../utils/isDataStreamInList';
import { type DataStreamIdentity } from '../store/contextDataStreams';

export const useVisibleDataStreams = () => {
  const { hideDataStream, unHideDataStream } = useChartStore(
    (state) => ({
      hideDataStream: state.hideDataStream,
      unHideDataStream: state.unHideDataStream,
    }),
    isEqual
  );
  const hiddenDataStreams = useChartStore(
    (state) => state.hiddenDataStreams,
    isEqual
  );
  const isDataStreamHidden = useCallback(
    (datastream: DataStreamIdentity) =>
      isDataStreamInList(hiddenDataStreams)(datastream),
    [hiddenDataStreams]
  );

  const toggleVisibility = useCallback(
    (datastream: DataStreamIdentity) => {
      if (isDataStreamHidden(datastream)) {
        unHideDataStream(datastream);
      } else {
        hideDataStream(datastream);
      }
    },
    [isDataStreamHidden, unHideDataStream, hideDataStream]
  );

  return {
    toggleVisibility,
    isDataStreamHidden,
    hideDataStream,
    unHideDataStream,
    hiddenDataStreams,
  };
};
