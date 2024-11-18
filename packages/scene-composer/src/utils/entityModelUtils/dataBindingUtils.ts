import { type DataValue } from '@aws-sdk/client-iottwinmaker';
import { type DocumentType } from '@aws-sdk/types';
import {
  type ITwinMakerDataBindingContext,
  type ITwinMakerEntityDataBindingContext,
} from '@iot-app-kit/source-iottwinmaker';
import { isEmpty } from 'lodash';

import { type ValueDataBinding } from '../../models/SceneModels';

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
  const dataBindingContext: ITwinMakerDataBindingContext = {
    entityId: bindingMap?.[DataBindingPropertyKey.EntityId],
    componentName: bindingMap?.[DataBindingPropertyKey.ComponentName],
    propertyName: bindingMap?.[DataBindingPropertyKey.PropertyName],
  };

  Object.keys(dataBindingContext).forEach((key) => {
    if (dataBindingContext[key] === undefined) {
      delete dataBindingContext[key];
    }
  });

  const result: ValueDataBinding = {};
  if (!isEmpty(dataBindingContext)) {
    result.dataBindingContext = dataBindingContext;
  }

  const isStaticDataValue = bindingMap?.[DataBindingPropertyKey.IsStaticData];

  if (isStaticDataValue !== undefined) {
    result.isStaticData = isStaticDataValue === 'true';
  }

  if (isEmpty(result)) {
    return undefined;
  }

  return result;
};
