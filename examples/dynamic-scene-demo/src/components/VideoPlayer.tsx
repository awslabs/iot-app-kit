import { VideoPlayer, useViewport } from '@iot-app-kit/react-components';
import { dataSource } from '../dataSource';
import { kvsStreamName, videoEntityId, videoComponentName } from '../configs';
import './VideoPlayer.scss';
import { Viewport, isHistoricalViewport, parseDuration } from '@iot-app-kit/core';
import { useMemo } from 'react';

const videoData = dataSource.videoData({
  kvsStreamName: kvsStreamName,
  entityId: videoEntityId,
  componentName: videoComponentName,
});

const VideoPlayerComponent = () => {
  // Get viewport from the time machine
  const { viewport } = useViewport();
  const videoViewPort = useMemo(() =>{
    if (viewport) {
      if (!isHistoricalViewport(viewport)) {
        const start = new Date(Date.now() - parseDuration(viewport.duration));
        const end = new Date();
        return { start, end };
      } else {
        return viewport;
      }
    } else {
      // Initialize by default as Live mode
      return { duration: '0' };
    }
  }, [viewport]);

  return (
    <div className="VideoPlayerComponent">
      <VideoPlayer videoData={videoData} viewport={videoViewPort} />
    </div>
  );
};

export default VideoPlayerComponent;
