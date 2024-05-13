import { ComponentRequest, ComponentUpdateRequest } from '@aws-sdk/client-iottwinmaker';
import { DocumentType } from '@aws-sdk/types';

import { IPlaneGeometryComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';
import { IPlaneGeometryComponentInternal } from '../../store';
import { generateUUID } from '../mathUtils';

import { resetProperties } from './updateNodeEntity';

enum PlaneGeometryComponentProperty {
  Width = 'width',
  Height = 'height',
  Color = 'color',
  TextureUri = 'textureUri',
}

export const createPlaneGeometryEntityComponent = (geometry: IPlaneGeometryComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.PlaneGeometry],
    properties: {
      [PlaneGeometryComponentProperty.Width]: {
        value: {
          doubleValue: geometry.width,
        },
      },
      [PlaneGeometryComponentProperty.Height]: {
        value: {
          doubleValue: geometry.height,
        },
      },
    },
  };

  if (geometry.color) {
    comp.properties![PlaneGeometryComponentProperty.Color] = {
      value: {
        stringValue: geometry.color,
      },
    };
  }
  if (geometry.textureUri) {
    comp.properties![PlaneGeometryComponentProperty.TextureUri] = {
      value: {
        stringValue: geometry.textureUri,
      },
    };
  }
  return comp;
};

export const updatePlaneGeometryEntityComponent = (
  geometry: IPlaneGeometryComponent,
  oldComponent?: IPlaneGeometryComponent,
): ComponentUpdateRequest => {
  const request = createPlaneGeometryEntityComponent(geometry);
  if (oldComponent) {
    resetProperties(geometry, oldComponent, request, Object.values(PlaneGeometryComponentProperty));
  }
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};

export const parsePlaneGeometryComp = (geometry: DocumentType): IPlaneGeometryComponentInternal | undefined => {
  const findWidth = geometry?.['properties']
    ? geometry?.['properties'].find((mp) => mp['propertyName'] === PlaneGeometryComponentProperty.Width)
    : undefined;
  const findHeight = geometry?.['properties']
    ? geometry?.['properties'].find((mp) => mp['propertyName'] === PlaneGeometryComponentProperty.Height)
    : undefined;
  if (!findWidth || !findHeight) {
    return undefined;
  }

  const planeGeometryComponent: IPlaneGeometryComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.PlaneGeometry,
    width: findWidth.propertyValue,
    height: findHeight.propertyValue,
    color: geometry?.['properties'].find((mp) => mp['propertyName'] === PlaneGeometryComponentProperty.Color)
      ?.propertyValue,
    textureUri: geometry?.['properties'].find((mp) => mp['propertyName'] === PlaneGeometryComponentProperty.TextureUri)
      ?.propertyValue,
  };
  return planeGeometryComponent;
};
