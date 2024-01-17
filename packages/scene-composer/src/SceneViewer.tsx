import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { isEqual } from 'lodash';
import styled from 'styled-components';

import { COMPOSER_FEATURES, ISelectedDataBinding, KnownComponentType, SceneViewerProps } from './interfaces';
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
  const prevSelectedRef = useRef<ISelectedDataBinding | undefined>();
  const [sceneLoaded, setSceneLoaded] = useState(false);

  useEffect(() => {
    // Do not update when scene is not loaded because nodes will be unavailable
    if (!sceneLoaded) {
      return;
    }
    // Do not update when there is no change
    if (isEqual(prevSelectedRef.current, props.selectedDataBinding)) {
      return;
    }

    prevSelectedRef.current = props.selectedDataBinding;

    if (props.selectedDataBinding === undefined) {
      return;
    }

    const filterType = props.selectedDataBinding.componentName
      ? [KnownComponentType.Tag]
      : [KnownComponentType.EntityBinding];
    const nodeRefs = composerApis.findSceneNodeRefBy(props.selectedDataBinding || '', filterType);
    if (nodeRefs && nodeRefs.length > 0) {
      // TODO: auto select the first node for now, handle multiple nodes selection later.
      composerApis.setCameraTarget(nodeRefs[0], 'transition');
      composerApis.setSelectedSceneNodeRef(nodeRefs[0]);
    } else {
      composerApis.setSelectedSceneNodeRef(undefined);
    }
  }, [props.selectedDataBinding, sceneLoaded]);

  const onSceneLoaded = useCallback(() => {
    setSceneLoaded(true);
  }, [setSceneLoaded]);

  return (
    <SceneComposerContainer data-testid='webgl-root' className='sceneViewer'>
      <SceneComposerInternal
        sceneComposerId={composerId}
        config={{
          ...(config || {}),
          mode: 'Viewing',
          featureConfig: {
            // Allow beta users to override feature config
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...((config as any)?.featureConfig || {}),
            [COMPOSER_FEATURES.Matterport]: true,
            [COMPOSER_FEATURES.SceneAppearance]: true,
          },
        }}
        onSceneLoaded={onSceneLoaded}
        {...props}
      />
    </SceneComposerContainer>
  );
};
