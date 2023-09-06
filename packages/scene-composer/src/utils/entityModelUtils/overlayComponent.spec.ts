import { componentTypeToId } from '../../common/entityModelConstants';
import { KnownComponentType } from '../../interfaces';
import { Component } from '../../models/SceneModels';

import { createOverlayEntityComponent, updateOverlayEntityComponent } from './overlayComponent';

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
