import { useCallback } from 'react';

import { SceneViewer as SceneViewerComp } from '@iot-app-kit/scene-composer';
import { dataSource } from '../dataSource';
import { sceneId, componentTypeQueries, viewport, entityQueries, dataBindingTemplate } from '../configs';

const sceneLoader = dataSource.s3SceneLoader(sceneId);

const queries = [
  ...componentTypeQueries.map((q) => dataSource.query.timeSeriesData(q)),
  ...entityQueries.map((q) => dataSource.query.timeSeriesData(q)),
];

interface SceneSelectionProps {
  setSelectonResult?: (entity: string) => void,
  selection?: Record<'entityId' | 'componentName', string>,
}

const SceneViewer: React.FC<SceneSelectionProps> = ({setSelectonResult, selection}) => {
  const onSelectionChanged = useCallback((e) => {
    console.log('onSelectionChanged event fired with data: ', e);
    if (setSelectonResult) {
      if (e.additionalComponentData && e.additionalComponentData[0].dataBindingContext.entityId) {
        setSelectonResult(`Entity Id: ${e.additionalComponentData[0].dataBindingContext.entityId}`); 
      } else {
        setSelectonResult('No entity bound');
      }
    }
  }, [setSelectonResult]);

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
        selectedDataBinding={selection}
        onWidgetClick={onWidgetClick}
        queries={queries}
        viewport={viewport}
        dataBindingTemplate={dataBindingTemplate}
      />
    </div>
  );
};

export default SceneViewer;
