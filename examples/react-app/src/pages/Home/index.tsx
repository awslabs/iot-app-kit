import { AppLayout } from '../../layouts/AppLayout';
import SceneViewer from '../../components/SceneViewer';
import VideoPlayer from '../../components/VideoPlayer';
import DashboardManager from '../../components/DashboardManager';
import ViewportControls from '../../components/ViewPort/Controls';
import { kvsStreamName, videoEntityId, videoComponentName } from '../../configs';

import { Container, Header, SpaceBetween } from '@cloudscape-design/components';

import { TimeSync } from '@iot-app-kit/react-components';
import Tools from './tools';

import { sceneId, workspaceId } from '../../configs';

const HomePage = () => {
  return (
    <AppLayout tools={<Tools />}>
      <TimeSync group={'main'}>
        <DashboardManager>
          <SpaceBetween size={'s'}>
            <Container>
              <ViewportControls />
            </Container>
            <Container header={<Header>Scene</Header>}>
              <div style={{ height: '864px', position: 'relative' }}>
                <SceneViewer scene={sceneId} workspace={workspaceId} />
              </div>
            </Container>
            <Container header={<Header>Video Player</Header>}>
              <VideoPlayer workspace={workspaceId} streamName={kvsStreamName} entityId={videoEntityId} componentName={videoComponentName} />
            </Container>
          </SpaceBetween>
        </DashboardManager>
      </TimeSync>
    </AppLayout>
  );
};

export default HomePage;
