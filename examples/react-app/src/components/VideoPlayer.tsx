import { VideoPlayer, useViewport } from '@iot-app-kit/react-components';
import useTwinMakerDatasource from '../hooks/useTwinMakerDatasource';
import { FC, useMemo } from 'react';

interface VideoPlayerComponentProps {
  workspace: string;
  streamName: string;
  entityId?: string;
  componentName?: string;
}

const VideoPlayerComponent: FC<VideoPlayerComponentProps> = ({ workspace, streamName, entityId, componentName }) => {
  const { viewport } = useViewport();
  const datasource = useTwinMakerDatasource(workspace);
  const videoData = useMemo(() => datasource?.videoData({
    kvsStreamName: streamName,
    entityId: entityId,
    componentName: componentName,
  }), [componentName, datasource, entityId, streamName]);

  if (!datasource || !videoData) return null;

  return (
    <div className="VideoPlayerComponent">
      <VideoPlayer videoData={videoData} viewport={viewport!} />
    </div>
  );
};

export default VideoPlayerComponent;
