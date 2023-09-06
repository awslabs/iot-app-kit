import { componentTypeToId } from '../../common/entityModelConstants';
import { KnownComponentType } from '../../interfaces';

import { createTagEntityComponent, updateTagEntityComponent } from './tagComponent';

describe('createTagEntityComponent', () => {
  it('should return expected empty tag component', () => {
    expect(createTagEntityComponent({ type: KnownComponentType.Tag })).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      properties: {},
    });
  });

  it('should return expected tag component with icon', () => {
    const result = createTagEntityComponent({ type: KnownComponentType.Tag, icon: 'info' });

    expect(result.properties).toEqual({
      icon: {
        value: { stringValue: 'info' },
      },
    });
  });

  it('should return expected tag component with navLink destination', () => {
    const result = createTagEntityComponent({
      type: KnownComponentType.Tag,
      navLink: {
        destination: 'destination',
      },
    });

    expect(result.properties).toEqual({
      navLink_destination: {
        value: { stringValue: 'destination' },
      },
    });
  });

  it('should return expected tag component with navLink params', () => {
    const result = createTagEntityComponent({
      type: KnownComponentType.Tag,
      navLink: {
        params: {
          param1: 'value 1',
          param2: 'value 2',
        },
      },
    });

    expect(result.properties).toEqual({
      navLink_params: {
        value: {
          mapValue: {
            param1: {
              stringValue: 'value%201',
            },
            param2: {
              stringValue: 'value%202',
            },
          },
        },
      },
    });
  });

  it('should return expected tag component with offset', () => {
    const result = createTagEntityComponent({ type: KnownComponentType.Tag, offset: [1, 2, 3] });

    expect(result.properties).toEqual({
      offset: {
        value: {
          listValue: [{ doubleValue: 1 }, { doubleValue: 2 }, { doubleValue: 3 }],
        },
      },
    });
  });

  it('should return expected tag component with chosenColor', () => {
    const result = createTagEntityComponent({ type: KnownComponentType.Tag, chosenColor: 'red' });

    expect(result.properties).toEqual({
      chosenColor: {
        value: { stringValue: 'red' },
      },
    });
  });

  it('should return expected tag component with styleBinding with rule id', () => {
    const result = createTagEntityComponent({ type: KnownComponentType.Tag, ruleBasedMapId: 'rule-id' });

    expect(result.properties).toEqual({
      styleBinding: {
        value: {
          mapValue: {
            ruleBasedMapId: {
              stringValue: 'rule-id',
            },
          },
        },
      },
    });
  });

  it('should return expected tag component with styleBinding with data binding context', () => {
    const result = createTagEntityComponent({
      type: KnownComponentType.Tag,
      valueDataBinding: {
        dataBindingContext: {
          entityId: 'eid',
          componentName: 'cname',
          propertyName: 'pname',
        },
      },
    });

    expect(result.properties).toEqual({
      styleBinding: {
        value: {
          mapValue: {
            ruleBasedMapId: {
              stringValue: undefined,
            },
            entityId: {
              stringValue: 'eid',
            },
            componentName: {
              stringValue: 'cname',
            },
            propertyName: {
              stringValue: 'pname',
            },
            isStaticData: {
              stringValue: 'false',
            },
          },
        },
      },
    });
  });
});

describe('updateTagEntityComponent', () => {
  it('should return expected empty tag component', () => {
    expect(updateTagEntityComponent({ type: KnownComponentType.Tag })).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      propertyUpdates: {},
    });
  });
});
