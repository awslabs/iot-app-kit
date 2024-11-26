import { type ComponentRequest, type ComponentUpdateRequest, PropertyUpdateType } from '@aws-sdk/client-iottwinmaker';
import { type DocumentType } from '@aws-sdk/types';
import isEmpty from 'lodash-es/isEmpty';
import { MAX_PROPERTY_STRING_LENGTH, componentTypeToId } from '../../common/entityModelConstants';
import { type IDataOverlayComponent, KnownComponentType } from '../../interfaces';
import { type Component } from '../../models/SceneModels';
import { type IDataOverlayComponentInternal } from '../../store';
import { generateUUID } from '../mathUtils';
import { createDataBindingMap, parseDataBinding } from './dataBindingUtils';
import { resetProperties } from './updateNodeEntity';

export enum OverlayComponentProperty {
  SubType = 'subType',
  DataRows = 'dataRows',
  RowType = 'rowType',
  Content = 'content',
  RowBindings = 'rowBindings',
  BindingName = 'bindingName',
}

export const createOverlayEntityComponent = (overlay: IDataOverlayComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.DataOverlay],
    properties: {
      [OverlayComponentProperty.SubType]: {
        value: {
          stringValue: overlay.subType,
        },
      },
      [OverlayComponentProperty.DataRows]: {
        value: {
          listValue: overlay.dataRows.map((r) => {
            const contents: Record<string, { stringValue: string }> = {};
            const encodedContent = encodeURI(r.content);
            // Split the content into multiple parts to avoid the max string length being exceeded
            for (
              let index = 0;
              index < Math.min(10, Math.ceil(encodedContent.length / MAX_PROPERTY_STRING_LENGTH));
              index++
            ) {
              // the ket for first content part will not have index suffix so existing overlays can continue to work
              const key =
                index === 0 ? OverlayComponentProperty.Content : `${OverlayComponentProperty.Content}_${index}`;
              contents[key] = {
                stringValue: encodedContent.substring(
                  index * MAX_PROPERTY_STRING_LENGTH,
                  Math.min(encodedContent.length, (index + 1) * MAX_PROPERTY_STRING_LENGTH),
                ),
              };
            }

            return {
              mapValue: {
                [OverlayComponentProperty.RowType]: {
                  stringValue: r.rowType,
                },
                ...contents,
              },
            };
          }),
        },
      },
    },
  };
  if (!isEmpty(overlay.valueDataBindings)) {
    comp.properties![OverlayComponentProperty.RowBindings] = {
      value: {
        listValue: overlay.valueDataBindings.map((v) => {
          const bindings = createDataBindingMap(v.valueDataBinding);
          bindings[OverlayComponentProperty.BindingName] = {
            stringValue: v.bindingName,
          };
          return {
            mapValue: bindings,
          };
        }),
      },
    };
  }
  return comp;
};

export const updateOverlayEntityComponent = (
  overlay: IDataOverlayComponent,
  oldComponent?: IDataOverlayComponent,
): ComponentUpdateRequest => {
  const request = createOverlayEntityComponent(overlay);
  if (oldComponent) {
    resetProperties(overlay, oldComponent, request, Object.values(OverlayComponentProperty));
    if (
      (!overlay.valueDataBindings || isEmpty(overlay.valueDataBindings)) &&
      !isEmpty(oldComponent.valueDataBindings)
    ) {
      request.properties![OverlayComponentProperty.RowBindings] = {
        updateType: PropertyUpdateType.RESET_VALUE,
      };
    }
  }
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};

export const parseOverlayComp = (comp: DocumentType): IDataOverlayComponentInternal | undefined => {
  if (!comp?.['properties']) {
    return undefined;
  }

  const bindings: Component.ValueDataBindingNamedMap[] = comp['properties']
    .find((p) => p['propertyName'] === OverlayComponentProperty.RowBindings)
    ?.propertyValue?.map((bindingMap) => ({
      bindingName: bindingMap[OverlayComponentProperty.BindingName],
      valueDataBinding: parseDataBinding(bindingMap),
    }));
  const rows: Component.DataOverlayMarkdownRow[] = comp['properties']
    .find((p) => p['propertyName'] === OverlayComponentProperty.DataRows)
    ?.propertyValue?.map((r) => {
      let index = 1;
      let content = r[OverlayComponentProperty.Content];
      while (r[`${OverlayComponentProperty.Content}_${index}`]) {
        content += r[`${OverlayComponentProperty.Content}_${index}`];
        index++;
      }
      return {
        content: decodeURI(content ?? ''),
        rowType: r[OverlayComponentProperty.RowType],
      };
    });

  const overlayComp: IDataOverlayComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.DataOverlay,
    subType: comp['properties'].find((p) => p['propertyName'] === OverlayComponentProperty.SubType)?.propertyValue,
    dataRows: rows ?? [],
    valueDataBindings: bindings ?? [],
  };

  return overlayComp;
};
