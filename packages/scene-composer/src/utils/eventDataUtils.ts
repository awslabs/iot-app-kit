import {
  IAnchorComponentInternal,
  IEntityBindingComponentInternal,
  IDataOverlayComponentInternal,
  ISceneNodeInternal,
} from '../store';
import {
  IDataOverlayInfo,
  ITagData,
  IEntityBindingInfo,
  IDataBindingTemplate,
  KnownComponentType,
  AdditionalComponentData,
} from '../interfaces';

import { applyDataBindingTemplate } from './dataBindingTemplateUtils';

export const getBindingsFromTag = (
  component: IAnchorComponentInternal,
  dataBindingTemplate: IDataBindingTemplate | undefined,
): ITagData => {
  return {
    chosenColor: component.chosenColor,
    navLink: component.navLink,
    dataBindingContext: !component.valueDataBinding?.dataBindingContext
      ? undefined
      : applyDataBindingTemplate(component.valueDataBinding, dataBindingTemplate),
  };
};

export const getBindingsFromEntityBinding = (component: IEntityBindingComponentInternal): IEntityBindingInfo => {
  return {
    dataBindingContext: !component?.valueDataBinding?.dataBindingContext
      ? undefined
      : component?.valueDataBinding.dataBindingContext,
  };
};

export const getBindingsFromDataOverlay = (
  component: IDataOverlayComponentInternal,
  dataBindingTemplate: IDataBindingTemplate | undefined,
): IDataOverlayInfo => {
  const dataBindingContexts: unknown[] = [];
  component.valueDataBindings.forEach((item) => {
    if (item.valueDataBinding) {
      dataBindingContexts.push(applyDataBindingTemplate(item.valueDataBinding, dataBindingTemplate));
    }
  });
  return { dataBindingContexts };
};

export const getAdditionalComponentData = (
  node: ISceneNodeInternal | undefined,
  dataBindingTemplate: IDataBindingTemplate | undefined,
): AdditionalComponentData[] => {
  const additionalComponentData: AdditionalComponentData[] = [];

  node?.components.forEach((component) => {
    const type = component.type;

    switch (type) {
      case KnownComponentType.Tag:
        additionalComponentData.push(getBindingsFromTag(component as IAnchorComponentInternal, dataBindingTemplate));
        break;
      case KnownComponentType.EntityBinding:
        additionalComponentData.push(getBindingsFromEntityBinding(component as IEntityBindingComponentInternal));
        break;
      case KnownComponentType.DataOverlay:
        additionalComponentData.push(
          getBindingsFromDataOverlay(component as IDataOverlayComponentInternal, dataBindingTemplate),
        );
        break;
      default:
        additionalComponentData.push({});
        break;
    }
  });
  return additionalComponentData;
};
