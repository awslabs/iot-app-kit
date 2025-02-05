import { Dashboard } from '@iot-app-kit/dashboard';

export function App() {
  return (
    <Dashboard
      initialViewMode='preview'
      clientConfiguration={{
        awsCredentials: {
          accessKeyId: '',
          secretAccessKey: '',
        },
        awsRegion: 'us-east-1',
      }}
      dashboardConfiguration={{
        displaySettings: { numColumns: 800, numRows: 600, cellSize: 1 },
        widgets: [
          {
            id: '123',
            type: 'xy-plot',
            x: 200,
            y: 150,
            z: 1,
            height: 300,
            width: 400,
            properties: {
              queryConfig: {
                source: 'iotsitewise',
                query: {
                  assets: [],
                },
              },
            },
          },
        ],
      }}
    />
  );
}
