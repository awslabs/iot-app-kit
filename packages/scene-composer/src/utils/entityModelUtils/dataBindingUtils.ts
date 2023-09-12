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
): Record<DataBindingPropertyKey, DataValue> | {} => {
  if (!binding || isEmpty(binding.dataBindingContext)) {
    return {};
  }

  return {
    [DataBindingPropertyKey.EntityId]: {
      stringValue: binding.dataBindingContext.entityId,
    },
    [DataBindingPropertyKey.ComponentName]: {
      stringValue: (binding.dataBindingContext as ITwinMakerEntityDataBindingContext).componentName,
    },
    [DataBindingPropertyKey.PropertyName]: {
      stringValue: (binding.dataBindingContext as ITwinMakerEntityDataBindingContext).propertyName,
    },
    [DataBindingPropertyKey.IsStaticData]: {
      stringValue: String(!!binding.isStaticData),
    },
  };
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
