import { FC, useCallback, useMemo } from 'react';

import { SceneViewer as SceneViewerComp } from '@iot-app-kit/scene-composer';
import useTwinMakerDatasource from '../hooks/useTwinMakerDatasource';
import { componentTypeQueries, entityQueries, dataBindingTemplate } from '../configs';
import { useViewport } from '@iot-app-kit/react-components';

interface SceneViewerProps {
  scene: string,
  workspace: string,
}

const SceneViewer: FC<SceneViewerProps> = ({ workspace, scene }) => {
  const { viewport } = useViewport();
  const datasource = useTwinMakerDatasource(workspace);
  const sceneLoader = useMemo(() => datasource?.s3SceneLoader(scene), [datasource, scene]);

  const onSelectionChanged = useCallback((e: any) => {
    console.log('onSelectionChanged event fired with data: ', e);
  }, []);

  const onWidgetClick = useCallback((e: any) => {
    console.log('onWidgetClick event fired with data: ', e);
  }, []);

  if (!datasource || !sceneLoader) {
    return null;
  }

  const queries = [
    ...componentTypeQueries.map((q) => datasource.query.timeSeriesData(q)),
    ...entityQueries.map((q) => datasource.query.timeSeriesData(q)),
  ];

  return (
    <div className="SceneViewer">
      <SceneViewerComp
        sceneLoader={sceneLoader}
        config={{
          dracoDecoder: {
            enable: true,
            path: 'https://www.gstatic.com/draco/versioned/decoders/1.5.3/', // path to the draco files
          },
        }}
        onSelectionChanged={onSelectionChanged}
        onWidgetClick={onWidgetClick}
        queries={queries}
        viewport={viewport}
        dataBindingTemplate={dataBindingTemplate}
      />
    </div>
  );
};

export default SceneViewer;
