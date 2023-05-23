import React from 'react';

import { AppLayout } from '../../layouts/AppLayout';
import SceneViewer from '../../components/SceneViewer';
import VideoPlayer from '../../components/VideoPlayer';
import DashboardManager from '../../components/DashboardManager';
import ViewportControls from '../../components/ViewPort/Controls';

import { Container, Header, SpaceBetween } from '@cloudscape-design/components';

import { TimeSync } from '@iot-app-kit/react-components';

const ScenePage = () => {
  return (
    <AppLayout>
      <TimeSync group={'main'}>
        <DashboardManager>
          <SpaceBetween size={'s'}>
            <Container>
              <ViewportControls />
            </Container>
            <Container header={<Header>Scene</Header>}>
              <div style={{ height: '864px', position: 'relative' }}>
                <SceneViewer />
              </div>
            </Container>
            <Container header={<Header>Video Player</Header>}>
              <VideoPlayer />
            </Container>
          </SpaceBetween>
        </DashboardManager>
      </TimeSync>
    </AppLayout>
  );
};

export default ScenePage;
