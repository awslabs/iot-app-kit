import { DataValue } from '@aws-sdk/client-iottwinmaker';
import { ITwinMakerEntityDataBindingContext } from '@iot-app-kit/source-iottwinmaker';
import { isEmpty } from 'lodash';

import { ValueDataBinding } from '../../models/SceneModels';

export const createDataBindingMap = (binding: ValueDataBinding | undefined): Record<string, DataValue> => {
  if (!binding || isEmpty(binding.dataBindingContext)) {
    return {};
  }

  return {
    entityId: {
      stringValue: binding.dataBindingContext.entityId,
    },
    componentName: {
      stringValue: (binding.dataBindingContext as ITwinMakerEntityDataBindingContext).componentName,
    },
    propertyName: {
      stringValue: (binding.dataBindingContext as ITwinMakerEntityDataBindingContext).propertyName,
    },
    isStaticData: {
      stringValue: String(!!binding.isStaticData),
    },
  };
};
