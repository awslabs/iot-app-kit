import React, { useEffect, useState } from 'react';
import { bindStylesToDataStreams } from '../common/bindStylesToDataStreams';
import { combineAnnotations } from '../common/combineAnnotations';
import { TimeSeriesConnectorProps, TimeSeriesData } from '../../utils/dataTypes';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 * 60 }; // ten minutes

const combineTimeSeriesData = (timeSeriesDataResults: TimeSeriesData[]): TimeSeriesData =>
  timeSeriesDataResults.reduce(
    (timeSeriesData, newTimeSeriesData) => {
      const { dataStreams, viewport, annotations } = newTimeSeriesData;

      const combinedAnnotations = combineAnnotations(timeSeriesData.annotations, annotations);

      return {
        dataStreams: [...timeSeriesData.dataStreams, ...dataStreams],
        viewport,
        annotations: combinedAnnotations,
      };
    },
    { dataStreams: [], viewport: { duration: 0 }, annotations: {} }
  );

const TimeSeriesConnector: React.FC<TimeSeriesConnectorProps> = ({
  annotations,
  renderFunc,
  provider,
  initialViewport = DEFAULT_VIEWPORT,
  styleSettings,
  assignDefaultColors = false
}) => {
  const [data, setData] = useState<TimeSeriesData>({
    dataStreams: [],
    viewport: initialViewport,
    annotations: {}
  });

  const { dataStreams, viewport, annotations: dataAnnotations } = data;
  const combinedAnnotations = combineAnnotations(dataAnnotations, annotations);

  useEffect(() => {
    provider?.subscribe({
      next: (results: TimeSeriesData[]) => {
        setData(combineTimeSeriesData(results));
      },
    });

    return () => {
      provider?.unsubscribe();
    }
  }, [provider]);

  return renderFunc({
    dataStreams: bindStylesToDataStreams({
      dataStreams,
      styleSettings,
      assignDefaultColors,
    }),
    viewport,
    annotations: combinedAnnotations,
  });
}

export default TimeSeriesConnector;