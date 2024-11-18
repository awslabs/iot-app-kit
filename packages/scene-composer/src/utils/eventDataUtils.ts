import {
  type IAnchorComponentInternal,
  type IEntityBindingComponentInternal,
  type IDataOverlayComponentInternal,
  type ISceneNodeInternal,
} from '../store';
import {
  type IDataOverlayInfo,
  type ITagData,
  type IEntityBindingInfo,
  type IDataBindingTemplate,
  KnownComponentType,
  type AdditionalComponentData,
} from '../interfaces';

import { applyDataBindingTemplate } from './dataBindingTemplateUtils';

export const getBindingsFromTag = (
  component: IAnchorComponentInternal,
  dataBindingTemplate: IDataBindingTemplate | undefined,
): ITagData => {
  return {
    chosenColor: component.chosenColor,
    customIcon: component.customIcon,
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
