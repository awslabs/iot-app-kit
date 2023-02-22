import React, { FC, Fragment } from 'react';

import { KnownComponentType } from '../../../interfaces';
import {
  ISceneComponentInternal,
  ISceneNodeInternal,
  IModelRefComponentInternal,
  IAnchorComponentInternal,
  ICameraComponentInternal,
  ILightComponentInternal,
  IMotionIndicatorComponentInternal,
  IColorOverlayComponentInternal,
  ISubModelRefComponentInternal,
  IDataOverlayComponentInternal,
} from '../../../store';
import { getComponentsGroupName } from '../../../utils/objectThreeUtils';
import ModelRefComponent from '../ModelRefComponent';
import AnchorComponent from '../AnchorComponent';
import CameraComponent from '../CameraComponent';
import LightComponent from '../LightComponent';
import MotionIndicatorComponent from '../MotionIndicatorComponent';
import ColorOverlayComponent from '../ColorOverlayComponent';
import SubModelComponent from '../SubModelComponent';
import DataOverlayComponent from '../DataOverlayComponent';

interface ComponentViewProps {
  component: ISceneComponentInternal;
  node: ISceneNodeInternal;
}

interface ComponentGroupProps {
  node: ISceneNodeInternal;
  components?: ISceneComponentInternal[];
}

const ComponentView = ({ component, node }: ComponentViewProps) => {
  // TODO: Consider just dynamically loading Components based on a naming convention, so this doesn't have to constantly be updated.
  switch (component.type) {
    case KnownComponentType.ModelRef:
      return <ModelRefComponent component={component as IModelRefComponentInternal} node={node} />;
    case KnownComponentType.SubModelRef:
      return <SubModelComponent component={component as ISubModelRefComponentInternal} node={node} />;
    case KnownComponentType.Tag:
      return <AnchorComponent node={node} component={component as IAnchorComponentInternal} />;
    case KnownComponentType.Camera:
      return <CameraComponent node={node} component={component as ICameraComponentInternal} />;
    case KnownComponentType.Light:
      return <LightComponent node={node} component={component as ILightComponentInternal} />;
    case KnownComponentType.MotionIndicator:
      return <MotionIndicatorComponent node={node} component={component as IMotionIndicatorComponentInternal} />;
    case KnownComponentType.ModelShader:
      return <ColorOverlayComponent component={component as IColorOverlayComponentInternal} node={node} />;
    case KnownComponentType.DataOverlay:
      return <DataOverlayComponent node={node} component={component as IDataOverlayComponentInternal} />;
    default:
      return <Fragment key={component.ref}></Fragment>;
  }
};

const ComponentGroup: FC<ComponentGroupProps> = ({ node, components }) => {
  return (
    <group name={getComponentsGroupName(node.ref)}>
      {
        /* istanbul ignore next: Nullish */ components?.map((component) => (
          <ComponentView key={component.ref} component={component} node={node} />
        ))
      }
    </group>
  );
};

export default ComponentGroup;
