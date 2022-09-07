import { Annotations, YAnnotation } from '@synchro-charts/core';
import { DataStream } from '@iot-app-kit/core';

export const getAlarmStreamAnnotations = ({
  annotations,
  dataStreams,
}: {
  annotations: Annotations;
  dataStreams: DataStream[];
}): { y: YAnnotation[] | undefined } => ({
  y: (annotations as Annotations).y?.filter((yAnnotation) => {
    return (
      'dataStreamIds' in yAnnotation &&
      yAnnotation.dataStreamIds?.some((dataStreamId) =>
        dataStreams.some((dataStream) => dataStream.streamType === 'ALARM' && dataStreamId === dataStream.id)
      )
    );
  }),
});
