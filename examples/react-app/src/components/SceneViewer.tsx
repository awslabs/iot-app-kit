import { useCallback } from 'react';

import { SceneViewer as SceneViewerComp } from '@iot-app-kit/scene-composer';
import { dataSource } from '../dataSource';
import { sceneId, componentTypeQueries, viewport, entityQueries, dataBindingTemplate } from '../configs';

const sceneLoader = dataSource.s3SceneLoader(sceneId);

const queries = [
  ...componentTypeQueries.map((q) => dataSource.query.timeSeriesData(q)),
  ...entityQueries.map((q) => dataSource.query.timeSeriesData(q)),
];

const SceneViewer = () => {
  const onSelectionChanged = useCallback((e) => {
    console.log('onSelectionChanged event fired with data: ', e);
  }, []);

  const onWidgetClick = useCallback((e) => {
    console.log('onWidgetClick event fired with data: ', e);
  }, []);

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
