import React, { ReactElement, useContext } from 'react';
import { Html } from '@react-three/drei';

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

  const getOffsetFromTag = () => {
    const tagComponent: IAnchorComponentInternal | undefined = node.components.find(
      (elem) => elem.type === KnownComponentType.Tag,
    );
    if (tagComponent) {
      return tagComponent.offset;
    }
  };

  return (
    <group>
      <Html
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
