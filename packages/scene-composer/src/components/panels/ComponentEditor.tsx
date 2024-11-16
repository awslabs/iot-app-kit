import { FormField, Input, SpaceBetween } from '@cloudscape-design/components';

import { KnownComponentType } from '../../interfaces';
import { type IDataOverlayComponentInternal, type ISceneComponentInternal, type ISceneNodeInternal } from '../../store';
import { type IAnimationComponentInternal, type IEntityBindingComponentInternal } from '../../store/internalInterfaces';
import { pascalCase } from '../../utils/stringUtils';

import { AnchorComponentEditor } from './scene-components/AnchorComponentEditor';
import { AnimationComponentEditor } from './scene-components/AnimationComponentEditor';
import CameraComponentEditor from './scene-components/CameraComponentEditor';
import { ColorOverlayComponentEditor } from './scene-components/ColorOverlayComponentEditor';
import { DataOverlayComponentEditor } from './scene-components/DataOverlayComponentEditor';
import { EntityBindingComponentEditor } from './scene-components/EntityBindingComponentEditor';
import { LightComponentEditor } from './scene-components/LightComponentEditor';
import { ModelRefComponentEditor } from './scene-components/ModelRefComponentEditor';
import { MotionIndicatorComponentEditor } from './scene-components/MotionIndicatorComponentEditor';
import { PlaneGeometryComponentEditor } from './scene-components/PlaneGeometryComponentEditor';
export interface IComponentEditorProps {
  node: ISceneNodeInternal;
  component: ISceneComponentInternal;
}

export const DefaultComponentEditor: React.FC<IComponentEditorProps> = ({ component }: IComponentEditorProps) => {
  const items = Object.keys(component).map((key) => {
    return { key, value: component[key] };
  });

  const itemsView = items.map((item, index) => {
    return (
      <FormField key={index} label={pascalCase(item.key)}>
        <Input disabled value={item.value} />
      </FormField>
    );
  });

  return (
    <>
      <SpaceBetween size='s'>{itemsView}</SpaceBetween>
    </>
  );
};

export const ComponentEditor: React.FC<IComponentEditorProps> = ({ node, component }: IComponentEditorProps) => {
  switch (component.type) {
    case KnownComponentType.Tag:
      return <AnchorComponentEditor node={node} component={component} />;
    case KnownComponentType.Light:
      return <LightComponentEditor node={node} component={component} />;
    case KnownComponentType.Camera:
      return <CameraComponentEditor node={node} component={component} />;
    case KnownComponentType.ModelShader:
      return <ColorOverlayComponentEditor node={node} component={component} />;
    case KnownComponentType.ModelRef:
      return <ModelRefComponentEditor node={node} component={component} />;
    case KnownComponentType.MotionIndicator:
      return <MotionIndicatorComponentEditor node={node} component={component} />;
    case KnownComponentType.DataOverlay:
      return <DataOverlayComponentEditor node={node} component={component as IDataOverlayComponentInternal} />;
    case KnownComponentType.EntityBinding:
      return <EntityBindingComponentEditor node={node} component={component as IEntityBindingComponentInternal} />;
    case KnownComponentType.Animation:
      return <AnimationComponentEditor node={node} component={component as IAnimationComponentInternal} />;
    case KnownComponentType.PlaneGeometry:
      return <PlaneGeometryComponentEditor node={node} component={component} />;
    default:
      return <DefaultComponentEditor node={node} component={component} />;
  }
};
