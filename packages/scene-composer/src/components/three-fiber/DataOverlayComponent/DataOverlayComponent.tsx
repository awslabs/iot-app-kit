import { type ReactElement, useContext, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { type Group } from 'three';

import { type ISceneNodeInternal } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { type IAnchorComponentInternal, type IDataOverlayComponentInternal } from '../../../store/internalInterfaces';
import { KnownComponentType } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import useSelectedNode from '../../../hooks/useSelectedNode';

import { DataOverlayContainer } from './DataOverlayContainer';

export interface DataOverlayComponentProps {
  node: ISceneNodeInternal;
  component: IDataOverlayComponentInternal;
}

export const DataOverlayComponent = ({ node, component }: DataOverlayComponentProps): ReactElement => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { selectedSceneNodeRef } = useSelectedNode();
  const htmlRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<Group>(null);

  const getOffsetFromTag = () => {
    const tagComponent: IAnchorComponentInternal | undefined = node.components.find(
      (elem) => elem.type === KnownComponentType.Tag,
    );
    if (tagComponent) {
      return tagComponent.offset;
    }
  };

  // enforces a zIndex on outer div of r3f HTML to push the selected overlay to the front before other overlays
  useEffect(() => {
    if (htmlRef.current?.parentElement) {
      htmlRef.current.parentElement.style.zIndex = node.ref === selectedSceneNodeRef ? '999' : '1';
    }
  }, [selectedSceneNodeRef, node]);

  useFrame(() => {
    if (!htmlRef.current || !groupRef.current) return;
    htmlRef.current.hidden = !groupRef.current.visible;
  });

  return (
    <group ref={groupRef} userData={{ componentType: KnownComponentType.DataOverlay }}>
      <Html
        ref={htmlRef}
        zIndexRange={[]} //This stops the r3f HTML from trying to set the z-index based on geometry
        className='tm-html-wrapper'
        // TODO: add position after finding proper way to always display overlay right above tag
        position={getOffsetFromTag()}
        style={{
          // top: extra space for the arrow if overlay panel type
          top: component.subType == Component.DataOverlaySubType.OverlayPanel ? '-14px' : 'auto',
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
