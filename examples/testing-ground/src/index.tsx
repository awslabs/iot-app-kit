import { ScatterChart } from '@iot-app-kit/react-components';
import { LineChart, WebglContext } from '@iot-app-kit/react-components';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { render } from 'react-dom';
import { environment } from './utils/environment';

const { query } = initialize({
  awsCredentials: {
    accessKeyId: environment.AWS_ACCESS_KEY_ID,
    secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
    sessionToken: environment.AWS_SESSION_TOKEN,
  },
  awsRegion: 'us-west-2',
  settings: {
    batchDuration: undefined,
    legacyAPI: false,
  },
});

/**
 * Root component to be rendered onto the page.
 */
export function App() {
  return (
    <>
      <p>Line Chart</p>

      <div style={{ width: '500px', height: '300px' }}>
        <LineChart
          queries={[
            query.timeSeriesData({
              assets: [
                {
                  assetId: '44eb248d-36a9-431a-b8ec-cfefd9971167',
                  properties: [
                    {
                      propertyId: '3a692181-51ed-4f51-bfee-03a3901cd8df',
                    },
                  ],
                },
              ],
            }),
          ]}
          viewport={{ duration: '5m' }}
        />
      </div>

      <p>Scatter Chart</p>

      <div style={{ width: '500px', height: '300px' }}>
        <ScatterChart
          queries={[
            query.timeSeriesData({
              assets: [
                {
                  assetId: '44eb248d-36a9-431a-b8ec-cfefd9971167',
                  properties: [
                    {
                      propertyId: '3a692181-51ed-4f51-bfee-03a3901cd8df',
                    },
                  ],
                },
              ],
            }),
          ]}
          viewport={{ duration: '5m' }}
        />
      </div>
      <WebglContext />
    </>
  );
}

/**
 * Render app component in the 'root' div.
 */
render(<App />, document.getElementById('root'));
