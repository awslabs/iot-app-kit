import { AppLayout } from '../../layouts/AppLayout';
import SceneViewer from '../../components/SceneViewer';
import DashboardManager from '../../components/DashboardManager';
import ViewportControls from '../../components/ViewPort/Controls';

import { Container, Header, SpaceBetween } from '@cloudscape-design/components';

import { TimeSync } from '@iot-app-kit/react-components';
import Tools from './tools';

const VRPage = () => {
  return (
      <TimeSync group={'main'}>
        <DashboardManager>
            <div style={{ height: '100vh', position: 'relative' }}>
              <SceneViewer scene={`Matterport`} workspace={`Matterport2`} xr={true} />
            </div>
        </DashboardManager>
      </TimeSync>
  );
};

export default VRPage;
