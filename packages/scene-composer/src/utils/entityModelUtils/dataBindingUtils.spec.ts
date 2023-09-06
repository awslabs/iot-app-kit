import { ValueDataBinding } from '../../models/SceneModels';

import { createDataBindingMap } from './dataBindingUtils';

describe('createDataBindingMap', () => {
  it('should return empty map when no data binding is provided', () => {
    expect(createDataBindingMap(undefined)).toEqual({});
    expect(createDataBindingMap({})).toEqual({});
    expect(createDataBindingMap({ dataBindingContext: undefined })).toEqual({});
    expect(createDataBindingMap({ dataBindingContext: {} } as ValueDataBinding)).toEqual({});
  });

  it('should return map with only entityId', () => {
    expect(createDataBindingMap({ dataBindingContext: { entityId: 'eid' } })).toEqual({
      entityId: { stringValue: 'eid' },
      componentName: { stringValue: undefined },
      propertyName: { stringValue: undefined },
      isStaticData: { stringValue: 'false' },
    });
  });

  it('should return map with all data', () => {
    expect(
      createDataBindingMap({
        dataBindingContext: { entityId: 'eid', componentName: 'cname', propertyName: 'pname' },
        isStaticData: true,
      }),
    ).toEqual({
      entityId: { stringValue: 'eid' },
      componentName: { stringValue: 'cname' },
      propertyName: { stringValue: 'pname' },
      isStaticData: { stringValue: 'true' },
    });
  });
});
