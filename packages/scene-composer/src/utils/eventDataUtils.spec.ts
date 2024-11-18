import { type AdditionalComponentData, KnownComponentType, type IDataBindingTemplate } from '../interfaces';
import {
  type IAnchorComponentInternal,
  type IDataOverlayComponentInternal,
  type IEntityBindingComponentInternal,
  type ISceneNodeInternal,
  type ISubModelRefComponentInternal,
} from '../store';

import { getAdditionalComponentData } from './eventDataUtils';

describe('eventDataUtils', () => {
  let mockDataBindingTemplate: IDataBindingTemplate;
  let node: ISceneNodeInternal;

  beforeEach(() => {
    mockDataBindingTemplate = {
      sel_entity1: 'my_entity_id',
      sel_comp1: 'my_component_name',
      fakeKey1Template: 'fakeKey1Value',
      fakeKey2Template: 'fakeKey2Value',
    };

    node = {
      ref: 'test-ref',
      name: 'node',
      childRefs: [],
      transformConstraint: {},
      properties: {},
      components: [],
      transform: {
        position: [1, 1, 1],
        rotation: [1, 1, 1],
        scale: [1, 1, 1],
      },
    };
  });

  it('should return additional component data correctly', () => {
    const entityComponent: IEntityBindingComponentInternal = {
      ref: 'entityBindRef',
      type: KnownComponentType.EntityBinding,
      valueDataBinding: {
        dataBindingContext: {
          entityId: 'myEntityId',
        },
      },
    };

    const tagComponent: IAnchorComponentInternal = {
      ref: 'tagBindRef',
      type: KnownComponentType.Tag,
      valueDataBinding: {
        dataBindingContext: {
          entityId: 'sel_entity1',
          componentName: 'sel_comp1',
          propertyName: 'myProperty',
        },
      },
      chosenColor: 'color string',
      navLink: {
        destination: 'destination string',
      },
    };

    const datatOverlayComponent: IDataOverlayComponentInternal = {
      ref: 'dataOverlayRef',
      type: KnownComponentType.DataOverlay,
      valueDataBindings: [
        {
          valueDataBinding: {
            dataBindingContext: {
              entityId: 'sel_entity1',
              componentName: 'sel_comp1',
              propertyName: 'myProperty',
            },
          },
          bindingName: 'myBindNameOne',
        },
        {
          valueDataBinding: {
            dataBindingContext: {
              entityId: 'myEntityOne',
              componentName: 'myComponentOne',
              propertyName: 'myPropertyTwo',
            },
          },
          bindingName: 'myBindNameOne',
        },
      ],
      subType: 'TextAnnotation',
      dataRows: [],
    };

    const unboundComponent: ISubModelRefComponentInternal = {
      ref: 'skippableRef',
      type: KnownComponentType.SubModelRef,
      selector: 0,
    };

    node.components.push(entityComponent);
    node.components.push(tagComponent);
    node.components.push(datatOverlayComponent);
    node.components.push(unboundComponent);

    const expectedResult: AdditionalComponentData[] = [
      {
        dataBindingContext: {
          entityId: 'myEntityId',
        },
      },
      {
        chosenColor: 'color string',
        dataBindingContext: {
          entityId: 'my_entity_id',
          componentName: 'my_component_name',
          propertyName: 'myProperty',
        },
        navLink: {
          destination: 'destination string',
        },
      },
      {
        dataBindingContexts: [
          {
            entityId: 'my_entity_id',
            componentName: 'my_component_name',
            propertyName: 'myProperty',
          },
          {
            entityId: 'myEntityOne',
            componentName: 'myComponentOne',
            propertyName: 'myPropertyTwo',
          },
        ],
      },
      {},
    ];

    const result = getAdditionalComponentData(node, mockDataBindingTemplate);
    expect(result).toEqual(expectedResult);
  });

  it('should return empty component data if node undefined', () => {
    const result = getAdditionalComponentData(undefined, mockDataBindingTemplate);
    expect(result).toEqual([]);
  });

  it('should return undefined for undefined bindings', () => {
    const entityComponent: IEntityBindingComponentInternal = {
      ref: 'entityBindRef',
      type: KnownComponentType.EntityBinding,
      valueDataBinding: {},
    };

    const tagComponent: IAnchorComponentInternal = {
      ref: 'tagBindRef',
      type: KnownComponentType.Tag,
      valueDataBinding: {},
      chosenColor: 'color string',
      navLink: {
        destination: 'destination string',
      },
    };

    const datatOverlayComponent: IDataOverlayComponentInternal = {
      ref: 'dataOverlayRef',
      type: KnownComponentType.DataOverlay,
      valueDataBindings: [],
      subType: 'TextAnnotation',
      dataRows: [],
    };

    const skippableComponent: ISubModelRefComponentInternal = {
      ref: 'skippableRef',
      type: KnownComponentType.SubModelRef,
      selector: 0,
    };

    node.components.push(entityComponent);
    node.components.push(tagComponent);
    node.components.push(datatOverlayComponent);
    node.components.push(skippableComponent);

    const expectedResult: AdditionalComponentData[] = [
      {
        dataBindingContext: undefined,
      },
      {
        chosenColor: 'color string',
        dataBindingContext: undefined,
        navLink: {
          destination: 'destination string',
        },
      },
      {
        dataBindingContexts: [],
      },
      {},
    ];

    const result = getAdditionalComponentData(node, mockDataBindingTemplate);
    expect(result).toEqual(expectedResult);
  });
});
