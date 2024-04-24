import { FC } from 'react';

import { SceneViewer as SceneViewerComp } from '@iot-app-kit/scene-composer';
import { dataSource } from '../dataSource';
import { sceneId, componentTypeQueries, entityQueries, dataBindingTemplate } from '../configs';
import './SceneViewer.scss';

const sceneLoader = dataSource.s3SceneLoader(sceneId);
const sceneMetadataModule = dataSource.sceneMetadataModule(sceneId);

const queries = [
  ...componentTypeQueries.map((q) => dataSource.query.timeSeriesData(q)),
  ...entityQueries.map((q) => dataSource.query.timeSeriesData(q)),
];

interface SceneViewerProps {
  onSelectionChanged: (e: any) => void;
  onWidgetClick: (e: any) => void;
}

const SceneViewer: FC<SceneViewerProps> = ({ onSelectionChanged, onWidgetClick }) => {

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
        sceneMetadataModule={sceneMetadataModule}
        onWidgetClick={onWidgetClick}
        queries={queries}
        dataBindingTemplate={dataBindingTemplate}
        sceneComposerId={sceneId}
      />
    </div>
  );
};

export default SceneViewer;
