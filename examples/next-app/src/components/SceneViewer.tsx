import { FC, useMemo } from 'react';

import { SceneViewer as SceneViewerComp } from '@iot-app-kit/scene-composer';
import { sceneId, componentTypeQueries, entityQueries, dataBindingTemplate } from '../configs';
import useTwinMakerDataSource from '../hooks/useTwinMakerDataSource';
import './SceneViewer.scss';
import { TwinMakerQuery } from '@iot-app-kit/source-iottwinmaker';

interface SceneViewerProps {
  onSelectionChanged: (e: any) => void;
  onWidgetClick: (e: any) => void;
}

const SceneViewer: FC<SceneViewerProps> = ({ onSelectionChanged, onWidgetClick }) => {

  const dataSource = useTwinMakerDataSource();
  const sceneLoader = useMemo(() => dataSource?.s3SceneLoader(sceneId), [sceneId]);

  const queries = useMemo(() => [
    [
      ...componentTypeQueries.map((q: TwinMakerQuery) => dataSource?.query.timeSeriesData(q)),
      ...entityQueries.map((q: TwinMakerQuery) => dataSource?.query.timeSeriesData(q)),
    ]
  ], [dataSource]);

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
        dataBindingTemplate={dataBindingTemplate}
        sceneComposerId={sceneId}
      />
    </div>
  );
};

export default SceneViewer;
