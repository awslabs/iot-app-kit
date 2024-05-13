import { PropertyUpdateType } from '@aws-sdk/client-iottwinmaker';

import { componentTypeToId } from '../../common/entityModelConstants';
import { KnownComponentType } from '../../interfaces';

import { TagComponentProperty, createTagEntityComponent, parseTagComp, updateTagEntityComponent } from './tagComponent';

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
              stringValue: 'value 1',
            },
            param2: {
              stringValue: 'value 2',
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

  it('should return expected tag component with custom icon', () => {
    const result = createTagEntityComponent({
      type: KnownComponentType.Tag,
      customIcon: { prefix: 'prefix', iconName: 'name' },
    });

    expect(result.properties).toEqual({
      customIcon_prefix: {
        value: { stringValue: 'prefix' },
      },
      customIcon_iconName: {
        value: { stringValue: 'name' },
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
            entityId: {
              stringValue: 'eid',
            },
            componentName: {
              stringValue: 'cname',
            },
            propertyName: {
              stringValue: 'pname',
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

  it('should reset properties that are no longer present', () => {
    const tag = {
      type: KnownComponentType.Tag,
    };
    expect(
      updateTagEntityComponent(tag, {
        ...tag,
        icon: '',
        valueDataBinding: {},
        ruleBasedMapId: '',
        navLink: {
          params: [{ a: 'b' }],
          destination: 'a',
        },
        offset: [1, 1, 1],
        chosenColor: '',
        customIcon: {
          prefix: 'a',
          iconName: 'a',
        },
      }),
    ).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      propertyUpdates: {
        [TagComponentProperty.Icon]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        [TagComponentProperty.StyleBinding]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        [TagComponentProperty.RuleBasedMapId]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        [TagComponentProperty.NavLinkDestination]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        [TagComponentProperty.NavLinkParams]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        [TagComponentProperty.ChosenColor]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        [TagComponentProperty.Offset]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        [TagComponentProperty.CustomIconName]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        [TagComponentProperty.CustomIconPrefix]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
      },
    });
  });
});

describe('parseTagComp', () => {
  it('should parse to expected empty tag component', () => {
    expect(
      parseTagComp({
        componentTypeId: componentTypeToId[KnownComponentType.Tag],
        properties: [],
      }),
    ).toEqual({
      ref: expect.any(String),
      type: KnownComponentType.Tag,
      icon: undefined,
      offset: undefined,
      navLink: {
        destination: undefined,
        params: undefined,
      },
      chosenColor: undefined,
      ruleBasedMapId: undefined,
      valueDataBinding: undefined,
    });
  });

  it('should parse to expected tag component with icon', () => {
    const result = parseTagComp({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      properties: [
        {
          propertyName: 'icon',
          propertyValue: 'info',
        },
      ],
    });

    expect(result?.icon).toEqual('info');
  });

  it('should parse to expected tag component with navLink destination', () => {
    const result = parseTagComp({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      properties: [
        {
          propertyName: 'navLink_destination',
          propertyValue: 'destination',
        },
      ],
    });

    expect(result?.navLink?.destination).toEqual('destination');
  });

  it('should parse to expected tag component with navLink params', () => {
    const result = parseTagComp({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      properties: [
        {
          propertyName: 'navLink_params',
          propertyValue: {
            param1: 'value 1',
            param2: 'value 2',
          },
        },
      ],
    });

    expect(result?.navLink?.params).toEqual({
      param1: 'value 1',
      param2: 'value 2',
    });
  });

  it('should parse to expected tag component with offset', () => {
    const result = parseTagComp({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      properties: [
        {
          propertyName: 'offset',
          propertyValue: [1, 2, 3],
        },
      ],
    });

    expect(result?.offset).toEqual([1, 2, 3]);
  });

  it('should parse to expected tag component with chosenColor', () => {
    const result = parseTagComp({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      properties: [
        {
          propertyName: 'chosenColor',
          propertyValue: 'red',
        },
      ],
    });

    expect(result?.chosenColor).toEqual('red');
  });

  it('should parse to expected tag component with custom icon', () => {
    const result = parseTagComp({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      properties: [
        {
          propertyName: 'customIcon_prefix',
          propertyValue: 'prefix',
        },
        {
          propertyName: 'customIcon_iconName',
          propertyValue: 'name',
        },
      ],
    });

    expect(result?.customIcon).toEqual({ prefix: 'prefix', iconName: 'name' });
  });

  it('should parse to expected tag component without custom icon when icon prefix is missing', () => {
    const result = parseTagComp({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      properties: [
        {
          propertyName: 'customIcon_iconName',
          propertyValue: 'name',
        },
      ],
    });

    expect(result?.customIcon).toBeUndefined();
  });

  it('should parse to expected tag component with styleBinding with rule id', () => {
    const result = parseTagComp({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      properties: [
        {
          propertyName: 'styleBinding',
          propertyValue: {
            ruleBasedMapId: 'rule-id',
          },
        },
      ],
    });

    expect(result?.ruleBasedMapId).toEqual('rule-id');
  });

  it('should parse to expected tag component with styleBinding with data binding context', () => {
    const result = parseTagComp({
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      properties: [
        {
          propertyName: 'styleBinding',
          propertyValue: {
            entityId: 'eid',
            componentName: 'cname',
            propertyName: 'pname',
            isStaticData: 'true',
          },
        },
      ],
    });

    expect(result?.valueDataBinding).toEqual({
      dataBindingContext: {
        entityId: 'eid',
        componentName: 'cname',
        propertyName: 'pname',
      },
      isStaticData: true,
    });
  });
});
