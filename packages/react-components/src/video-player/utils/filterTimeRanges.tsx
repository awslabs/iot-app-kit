import { VideoTimeRanges, VideoTimeRangesWithSource } from '../types';

/*
  Example:
  timerangesForVideoOnEdgeRaw (edge) => [(1,5), (7,11), (13,18), (21,28), (32,35)]
  timerangesWithSource (kvs) => [(1,5), (7,9), (15,18), (24,26)]
  output (filtered value on edge) => [(9,11), (13,15), (21,24), (26,28), (32,35)]
*/
// Filter the timeranges on edge as per the timeranges in KVS
export const filterTimerangesForVideoOnEdge = (
  timerangesForVideoOnEdgeRaw: VideoTimeRanges,
  timerangesWithSource: VideoTimeRangesWithSource
): VideoTimeRanges => {
  const timerangesForVideoOnEdge: VideoTimeRanges = [];
  timerangesForVideoOnEdgeRaw.forEach((edgeVideo) => {
    // Find the appropriate video section from available videos based on the edge information for merging
    let kvsVideo = timerangesWithSource.find((x) => x.start >= edgeVideo.start && x.end <= edgeVideo.end);
    if (kvsVideo === undefined) {
      kvsVideo = timerangesWithSource.find(
        (x) => x.start < edgeVideo.start && x.end <= edgeVideo.end && x.end > edgeVideo.start
      );
    }
    if (kvsVideo === undefined) {
      kvsVideo = timerangesWithSource.find(
        (x) => x.start >= edgeVideo.start && x.end > edgeVideo.end && x.start < edgeVideo.end
      );
    }
    if (kvsVideo) {
      if (kvsVideo.start > edgeVideo.start) {
        timerangesForVideoOnEdge.push({ start: edgeVideo.start, end: kvsVideo.start });
        if (kvsVideo.end < edgeVideo.end) {
          timerangesForVideoOnEdge.push({ start: kvsVideo.end, end: edgeVideo.end });
        }
      } else if (kvsVideo.end < edgeVideo.end) {
        timerangesForVideoOnEdge.push({ start: kvsVideo.end, end: edgeVideo.end });
      }
    } else {
      timerangesForVideoOnEdge.push({ start: edgeVideo.start, end: edgeVideo.end });
    }
  });
  return timerangesForVideoOnEdge;
};
