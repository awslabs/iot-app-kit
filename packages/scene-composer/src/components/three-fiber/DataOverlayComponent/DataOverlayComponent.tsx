import React, { ReactElement, useContext, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

import { ISceneNodeInternal } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { IAnchorComponentInternal, IDataOverlayComponentInternal } from '../../../store/internalInterfaces';
import { KnownComponentType } from '../../../interfaces';

import { DataOverlayContainer } from './DataOverlayContainer';

export interface DataOverlayComponentProps {
  node: ISceneNodeInternal;
  component: IDataOverlayComponentInternal;
}

export const DataOverlayComponent = ({ node, component }: DataOverlayComponentProps): ReactElement => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const htmlRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<Group>();

  const getOffsetFromTag = () => {
    const tagComponent: IAnchorComponentInternal | undefined = node.components.find(
      (elem) => elem.type === KnownComponentType.Tag,
    );
    if (tagComponent) {
      return tagComponent.offset;
    }
  };

  useFrame(() => {
    if (!htmlRef.current || !groupRef.current) return;
    htmlRef.current.hidden = !groupRef.current.visible;
  });

  return (
    <group ref={groupRef} userData={{ componentType: KnownComponentType.DataOverlay }}>
      <Html
        ref={htmlRef}
        className='tm-html-wrapper'
        // TODO: add position after finding proper way to always display overlay right above tag
        position={getOffsetFromTag()}
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
