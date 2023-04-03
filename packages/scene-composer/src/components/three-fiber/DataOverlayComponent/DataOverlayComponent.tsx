import React, { ReactElement, useContext } from 'react';
import { Html } from '@react-three/drei';
import { Vector3 } from 'three';

import { ISceneNodeInternal, useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { IDataOverlayComponentInternal } from '../../../store/internalInterfaces';
import { getSafeBoundingBox } from '../../../utils/objectThreeUtils';

import { DataOverlayContainer } from './DataOverlayContainer';

export interface DataOverlayComponentProps {
  node: ISceneNodeInternal;
  component: IDataOverlayComponentInternal;
}

const OBJECT_SIZE_RATIO = 0.85;
export const DataOverlayComponent = ({ node, component }: DataOverlayComponentProps): ReactElement => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const getObject3DBySceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);
  const object3D = getObject3DBySceneNodeRef(node.ref);
  const objectWorldPos = object3D?.getWorldPosition(new Vector3());
  const objectSize = object3D && getSafeBoundingBox(object3D).getSize(new Vector3());
  // TODO: fix for when tag auto rescale is on
  const y = objectSize ? (objectSize.y / 2) * OBJECT_SIZE_RATIO : 0;
  const position = objectWorldPos && new Vector3(objectWorldPos.x, objectWorldPos.y + y, objectWorldPos.z);

  if (position && object3D) {
    object3D.worldToLocal(position);
  }

  return (
    <group>
      <Html
        className='html-wrapper'
        position={position}
        style={{
          transform: 'translate3d(-50%,-100%,0)', // make the center of 3D transform the middle of bottom edge
        }}
      >
        <sceneComposerIdContext.Provider value={sceneComposerId}>
          <DataOverlayContainer node={node} component={component} />
        </sceneComposerIdContext.Provider>
      </Html>
    </group>
  );
};
