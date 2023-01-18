import { useCallback, useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField
} from '@material-ui/core';
import SceneViewer from './SceneViewer';
import VideoPlayerComponent from './VideoPlayer';

const ComponentsTab = () => {
  const [value, setValue] = useState(0);
  const [mixerNumber, setMixerNumber] = useState(5);
  const [selected, setSelected] = useState({'entityId':'', 'componentName':''});
  const [selectionResult, setSelectonResult] = useState('None Selected');

  const setMixer5 = useCallback(() => {
    if (mixerNumber === 5) {
      setSelected({
        'entityId':'Mixer_5_018fbf69-c06a-4690-8817-53bf163df8d4',
        'componentName':'AlarmComponent',
      });
      setMixerNumber(4);
    } else {
      setSelected({
        'entityId':'Mixer_4_784b3c3e-5779-4ca1-ad0b-036b18dd1fcc',
        'componentName':'AlarmComponent',
      });
      setMixerNumber(5);
    }
  },[mixerNumber, setSelected, setMixerNumber])

  return (
    <div>
      <h3>Sample IoT AppKit Components</h3>
      <Paper square>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button onClick={setMixer5}>Select Mixer {mixerNumber}</Button>
          </Grid>
          <Grid item xs={8}>
            <TextField disabled fullWidth maxRows={1} label={selectionResult} />
          </Grid>
        </Grid>
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
        {value === 0 && <SceneViewer setSelectonResult={setSelectonResult} selection={selected}/>}
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
