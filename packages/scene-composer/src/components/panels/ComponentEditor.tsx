import React from 'react';
import { FormField, Input, SpaceBetween } from '@awsui/components-react';

import { ISceneComponentInternal, ISceneNodeInternal } from '../../store';
import { KnownComponentType } from '../../interfaces';
import { pascalCase } from '../../utils/stringUtils';

import { AnchorComponentEditor } from './scene-components/AnchorComponentEditor';
import { LightComponentEditor } from './scene-components/LightComponentEditor';
import { ColorOverlayComponentEditor } from './scene-components/ColorOverlayComponentEditor';
import { ModelRefComponentEditor } from './scene-components/ModelRefComponentEditor';
import { MotionIndicatorComponentEditor } from './scene-components/MotionIndicatorComponentEditor';
import { ViewpointComponentEditor } from './scene-components/ViewpointComponentEditor';

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

const createComponentEditor = (node: ISceneNodeInternal, component: ISceneComponentInternal) => {
  let result: JSX.Element;
  if (component.type === KnownComponentType.Tag) {
    result = <AnchorComponentEditor node={node} component={component} />;
  } else if (component.type === KnownComponentType.Light) {
    result = <LightComponentEditor node={node} component={component} />;
  } else if (component.type === KnownComponentType.ModelShader) {
    result = <ColorOverlayComponentEditor node={node} component={component} />;
  } else if (component.type === KnownComponentType.ModelRef) {
    result = <ModelRefComponentEditor node={node} component={component} />;
  } else if (component.type === KnownComponentType.MotionIndicator) {
    result = <MotionIndicatorComponentEditor node={node} component={component} />;
  } else if (component.type === KnownComponentType.Viewpoint) {
    result = <ViewpointComponentEditor node={node} component={component} />;
  } else {
    result = <DefaultComponentEditor node={node} component={component} />;
  }
  return result;
};

export const ComponentEditor: React.FC<IComponentEditorProps> = ({ node, component }: IComponentEditorProps) => {
  return createComponentEditor(node, component);
};
