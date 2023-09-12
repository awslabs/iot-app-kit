import { componentTypeToId } from '../../common/entityModelConstants';
import { KnownComponentType } from '../../interfaces';
import { Component } from '../../models/SceneModels';

import { createOverlayEntityComponent, parseOverlayComp, updateOverlayEntityComponent } from './overlayComponent';

describe('createOverlayEntityComponent', () => {
  it('should return expected default overlay component', () => {
    expect(
      createOverlayEntityComponent({
        type: KnownComponentType.DataOverlay,
        subType: Component.DataOverlaySubType.OverlayPanel,
        dataRows: [],
        valueDataBindings: [],
      }),
    ).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.DataOverlay],
      properties: {
        subType: {
          value: { stringValue: Component.DataOverlaySubType.OverlayPanel },
        },
        dataRows: {
          value: {
            listValue: [],
          },
        },
      },
    });
  });

  it('should return expected overlay component with data rows', () => {
    const result = createOverlayEntityComponent({
      type: KnownComponentType.DataOverlay,
      subType: Component.DataOverlaySubType.TextAnnotation,
      dataRows: [
        {
          rowType: Component.DataOverlayRowType.Markdown,
          content: '${abc} def',
        },
      ],
      valueDataBindings: [],
    });

    expect(result.properties).toEqual({
      subType: {
        value: { stringValue: Component.DataOverlaySubType.TextAnnotation },
      },
      dataRows: {
        value: {
          listValue: [
            {
              mapValue: {
                rowType: {
                  stringValue: Component.DataOverlayRowType.Markdown,
                },
                content: {
                  stringValue: '$%7Babc%7D%20def',
                },
              },
            },
          ],
        },
      },
    });
  });

  it('should return expected tag component with rowBindings', () => {
    const result = createOverlayEntityComponent({
      type: KnownComponentType.DataOverlay,
      subType: Component.DataOverlaySubType.TextAnnotation,
      dataRows: [],
      valueDataBindings: [
        {
          valueDataBinding: {
            dataBindingContext: {
              entityId: 'eid',
              componentName: 'cname',
              propertyName: 'pname',
            },
            isStaticData: true,
          },
          bindingName: 'binding-a',
        },
      ],
    });

    expect(result.properties).toEqual({
      subType: {
        value: { stringValue: Component.DataOverlaySubType.TextAnnotation },
      },
      dataRows: {
        value: {
          listValue: [],
        },
      },
      rowBindings: {
        value: {
          listValue: [
            {
              mapValue: {
                bindingName: {
                  stringValue: 'binding-a',
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
                  stringValue: 'true',
                },
              },
            },
          ],
        },
      },
    });
  });
});

describe('updateOverlayEntityComponent', () => {
  it('should return expected empty overlay component', () => {
    expect(
      updateOverlayEntityComponent({
        type: KnownComponentType.DataOverlay,
        subType: Component.DataOverlaySubType.OverlayPanel,
        dataRows: [],
        valueDataBindings: [],
      }),
    ).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.DataOverlay],
      propertyUpdates: {
        subType: {
          value: { stringValue: Component.DataOverlaySubType.OverlayPanel },
        },
        dataRows: {
          value: {
            listValue: [],
          },
        },
      },
    });
  });
});

describe('parseOverlayComp', () => {
  it('should return undefined', () => {
    expect(parseOverlayComp(null)).toBeUndefined();
    expect(parseOverlayComp({ random: 'random' })).toBeUndefined();
  });

  it('should parse to expected overlay component with data rows', () => {
    const result = parseOverlayComp({
      componentTypeId: componentTypeToId[KnownComponentType.DataOverlay],
      properties: [
        {
          propertyName: 'subType',
          propertyValue: Component.DataOverlaySubType.TextAnnotation,
        },
        {
          propertyName: 'dataRows',
          propertyValue: [
            {
              rowType: Component.DataOverlayRowType.Markdown,
              content: '$%7Babc%7D%20def',
            },
          ],
        },
      ],
    });

    expect(result).toEqual({
      ref: expect.anything(),
      type: KnownComponentType.DataOverlay,
      subType: Component.DataOverlaySubType.TextAnnotation,
      dataRows: [
        {
          rowType: Component.DataOverlayRowType.Markdown,
          content: '${abc} def',
        },
      ],
      valueDataBindings: [],
    });
  });

  it('should parse to expected tag component with rowBindings', () => {
    const result = parseOverlayComp({
      componentTypeId: componentTypeToId[KnownComponentType.DataOverlay],
      properties: [
        {
          propertyName: 'subType',
          propertyValue: Component.DataOverlaySubType.TextAnnotation,
        },
        {
          propertyName: 'rowBindings',
          propertyValue: [
            {
              bindingName: 'binding-a',
              entityId: 'eid',
              componentName: 'cname',
              propertyName: 'pname',
              isStaticData: 'true',
            },
          ],
        },
      ],
    });

    expect(result).toEqual({
      ref: expect.anything(),
      type: KnownComponentType.DataOverlay,
      subType: Component.DataOverlaySubType.TextAnnotation,
      dataRows: [],
      valueDataBindings: [
        {
          valueDataBinding: {
            dataBindingContext: {
              entityId: 'eid',
              componentName: 'cname',
              propertyName: 'pname',
            },
            isStaticData: true,
          },
          bindingName: 'binding-a',
        },
      ],
    });
  });
});
