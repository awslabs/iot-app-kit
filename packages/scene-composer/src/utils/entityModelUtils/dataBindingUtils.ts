import { DataValue } from '@aws-sdk/client-iottwinmaker';
import { DocumentType } from '@aws-sdk/types';
import { ITwinMakerEntityDataBindingContext } from '@iot-app-kit/source-iottwinmaker';
import { isEmpty } from 'lodash';

import { ValueDataBinding } from '../../models/SceneModels';

enum DataBindingPropertyKey {
  EntityId = 'entityId',
  ComponentName = 'componentName',
  PropertyName = 'propertyName',
  IsStaticData = 'isStaticData',
}

export const createDataBindingMap = (
  binding: ValueDataBinding | undefined,
): Partial<Record<DataBindingPropertyKey, DataValue>> => {
  const result: Partial<Record<DataBindingPropertyKey, DataValue>> = {};

  if (!binding || isEmpty(binding.dataBindingContext)) {
    return result;
  }

  const context = binding.dataBindingContext as ITwinMakerEntityDataBindingContext;

  if (context.entityId) {
    result[DataBindingPropertyKey.EntityId] = {
      stringValue: binding.dataBindingContext.entityId,
    };
  }

  if (context.componentName) {
    result[DataBindingPropertyKey.ComponentName] = {
      stringValue: context.componentName,
    };
  }

  if (context.propertyName) {
    result[DataBindingPropertyKey.PropertyName] = {
      stringValue: context.propertyName,
    };
  }

  if (binding.isStaticData !== undefined) {
    result[DataBindingPropertyKey.IsStaticData] = {
      stringValue: String(!!binding.isStaticData),
    };
  }

  return result;
};

export const parseDataBinding = (bindingMap: DocumentType): ValueDataBinding | undefined => {
  if (!bindingMap || isEmpty(bindingMap)) {
    return undefined;
  }

  return {
    dataBindingContext: {
      entityId: bindingMap[DataBindingPropertyKey.EntityId],
      componentName: bindingMap[DataBindingPropertyKey.ComponentName],
      propertyName: bindingMap[DataBindingPropertyKey.PropertyName],
    },
    isStaticData: bindingMap[DataBindingPropertyKey.IsStaticData] === 'true',
  };
};
