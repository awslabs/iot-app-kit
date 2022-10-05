import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import SceneViewer from './SceneViewer';
import VideoPlayerComponent from './VideoPlayer';

const ComponentsTab = () => {
  const [value, setValue] = React.useState(0);

  return (
    <div>
      <h3>Sample IoT AppKit Components</h3>
      <Paper square>
        <Tabs
          value={value}
          textColor="primary"
          indicatorColor="primary"
          onChange={(event: any, newValue: React.SetStateAction<number>) => {
            setValue(newValue);
          }}
        >
          <Tab label="Scene Viewer" />
          <Tab label="Video Player" />
        </Tabs>
        {value === 0 && <SceneViewer />}
        {value === 1 && (
          <div>
            <VideoPlayerComponent />
          </div>
        )}
      </Paper>
    </div>
  );
};

export default ComponentsTab;
