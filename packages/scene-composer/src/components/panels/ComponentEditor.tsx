import React from 'react';
import { FormField, Input, SpaceBetween } from '@awsui/components-react';

import { IDataOverlayComponentInternal, ISceneComponentInternal, ISceneNodeInternal } from '../../store';
import { KnownComponentType } from '../../interfaces';
import { pascalCase } from '../../utils/stringUtils';

import { AnchorComponentEditor } from './scene-components/AnchorComponentEditor';
import { LightComponentEditor } from './scene-components/LightComponentEditor';
import { ColorOverlayComponentEditor } from './scene-components/ColorOverlayComponentEditor';
import { ModelRefComponentEditor } from './scene-components/ModelRefComponentEditor';
import { MotionIndicatorComponentEditor } from './scene-components/MotionIndicatorComponentEditor';
import CameraComponentEditor from './scene-components/CameraComponentEditor';
import { DataOverlayComponentEditor } from './scene-components/DataOverlayComponentEditor';

export interface IComponentEditorProps {
  node: ISceneNodeInternal;
  component: ISceneComponentInternal;
}

export const DefaultComponentEditor: React.FC<IComponentEditorProps> = ({ node, component }: IComponentEditorProps) => {
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
    <React.Fragment>
      <SpaceBetween size='s'>{itemsView}</SpaceBetween>
    </React.Fragment>
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
    default:
      return <DefaultComponentEditor node={node} component={component} />;
  }
};
