import { DataStream, Primitive } from './dataTypes';
import { StreamType } from './dataConstants';
import { isDefined } from './predicates';

/**
 * Given a list of infos, return the ones that are to be visualized.
 *
 * This will remove any alarms that don't have an associated property info.
 */
export const removePairedAlarms = (streams: DataStream<Primitive>[]): DataStream<Primitive>[] => {
  const alarmInfos = streams.filter(({ streamType }) => streamType === StreamType.ALARM);
  const propertyInfos = streams.filter(({ streamType }) => streamType !== StreamType.ALARM);

  // If an alarm is not 'part' of any property info, it is a stray and can be visualized.
  const isStrayAlarm = ({ id }: DataStream<Primitive>) =>
    !propertyInfos.some(({ associatedStreams = [] }) => associatedStreams.some(a => a.id === id));

  const strayAlarmInfos = alarmInfos.filter(isStrayAlarm);

  const visualizedInfoIds = [...propertyInfos, ...strayAlarmInfos].map(({ id }) => id);

  // Want to maintain the original order, so we will filter out what isn't included from our original input.
  return streams.filter(({ id }) => visualizedInfoIds.includes(id)).filter(isDefined);
};

type StreamPair = { alarm?: DataStream<Primitive>; property?: DataStream<Primitive> };

/**
 * Returns alarm/property pairs.
 *
 * For instance, if you have one property with 3 alarms associated with it, this will return you 3 pairs in total. One pair for each alarm.
 */
export const streamPairs = (dataStreams: DataStream<Primitive>[]): StreamPair[] => {
  const primaryInfos = removePairedAlarms(dataStreams);
  return primaryInfos
    .map(stream => {
      if (stream.streamType === StreamType.ALARM) {
        // if it's an alarm an not removed, that means it's not pair, and has no associated property.
        return [{ alarm: stream }];
      }

      const hasNoAssociatedAlarms =
        stream.associatedStreams == null || !stream.associatedStreams.some(({ type }) => type === StreamType.ALARM);
      if (hasNoAssociatedAlarms) {
        // No alarms, just report back the property
        return [{ property: stream }];
      }

      // Return on cell info for each alarm associated
      return (stream.associatedStreams || [])
        .map(({ id: associatedId }) => dataStreams.find(({ id: id2 }) => id2 === associatedId))
        .filter(isDefined)
        .map(alarmInfo => ({
          property: stream,
          alarm: alarmInfo,
        }));
    })
    .flat();
};
