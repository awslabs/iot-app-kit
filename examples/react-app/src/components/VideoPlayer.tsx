import { VideoPlayer } from '@iot-app-kit/react-components';
import { dataSource } from '../dataSource';
import { kvsStreamName, videoEntityId, videoComponentName, videoViewport } from '../configs';

const videoData = dataSource.videoData({
  kvsStreamName: kvsStreamName,
  entityId: videoEntityId,
  componentName: videoComponentName,
});

const VideoPlayerComponent = () => {
  return (
    <div className="VideoPlayerComponent">
      <VideoPlayer videoData={videoData} viewport={videoViewport} />
    </div>
  );
};

export default VideoPlayerComponent;
