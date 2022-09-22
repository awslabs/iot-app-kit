import React, { useEffect, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { isEqual } from 'lodash';
import styled from 'styled-components';

import { KnownComponentType, SceneViewerProps } from './interfaces';
import { SceneComposerInternal, useSceneComposerApi } from './components/SceneComposerInternal';

const SceneComposerContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  canvas {
    outline: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0); /* mobile webkit */
  }
`;

export const SceneViewer: React.FC<SceneViewerProps> = ({ sceneComposerId, config, ...props }: SceneViewerProps) => {
  const composerId = useMemo(() => {
    return sceneComposerId || uuid();
  }, [sceneComposerId]);
  const composerApis = useSceneComposerApi(composerId);
  const prevSelectedRef: any = useRef();

  useEffect(() => {
    if (isEqual(prevSelectedRef.current, props.selectedDataBinding)) {
      return;
    }
    prevSelectedRef.current = props.selectedDataBinding;

    if (props.selectedDataBinding === undefined) {
      return;
    }

    const nodeRefs = composerApis.findSceneNodeRefBy(props.selectedDataBinding || '', [KnownComponentType.Tag]);
    if (nodeRefs && nodeRefs.length > 0) {
      // TODO: auto select the first node for now, handle multiple nodes selection later.
      composerApis.setCameraTarget(nodeRefs[0], 'transition');
      composerApis.setSelectedSceneNodeRef(nodeRefs[0]);
    } else {
      composerApis.setSelectedSceneNodeRef(undefined);
    }
  }, [props.selectedDataBinding]);

  return (
    <SceneComposerContainer data-testid={'webgl-root'}>
      <SceneComposerInternal
        sceneComposerId={composerId}
        config={{
          ...(config || {}),
          mode: 'Viewing',
        }}
        {...props}
      />
    </SceneComposerContainer>
  );
};
