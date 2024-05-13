import { PropertyUpdateType } from '@aws-sdk/client-iottwinmaker';

import { componentTypeToId } from '../../common/entityModelConstants';
import { IPlaneGeometryComponent, KnownComponentType } from '../../interfaces';

import {
  createPlaneGeometryEntityComponent,
  parsePlaneGeometryComp,
  updatePlaneGeometryEntityComponent,
} from './planeGeometryComponent';

const plane: IPlaneGeometryComponent = {
  type: KnownComponentType.PlaneGeometry,
  width: 10,
  height: 20,
};

const coloredPlane: IPlaneGeometryComponent = {
  type: KnownComponentType.PlaneGeometry,
  width: 10,
  height: 20,
  color: '#abcdef',
};

const texturedGroundPlane: IPlaneGeometryComponent = {
  type: KnownComponentType.PlaneGeometry,
  width: 10,
  height: 20,
  textureUri: 'filepath',
};

describe('createPlaneGeometryEntityComponent', () => {
  it('should return expected plane with no color', () => {
    expect(createPlaneGeometryEntityComponent(plane)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.PlaneGeometry],
      properties: {
        width: {
          value: {
            doubleValue: 10,
          },
        },
        height: {
          value: {
            doubleValue: 20,
          },
        },
      },
    });
  });

  it('should return expected plane with color', () => {
    expect(createPlaneGeometryEntityComponent(coloredPlane)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.PlaneGeometry],
      properties: {
        width: {
          value: {
            doubleValue: 10,
          },
        },
        height: {
          value: {
            doubleValue: 20,
          },
        },
        color: {
          value: {
            stringValue: '#abcdef',
          },
        },
      },
    });
  });

  it('should return expected plane with texture', () => {
    expect(createPlaneGeometryEntityComponent(texturedGroundPlane)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.PlaneGeometry],
      properties: {
        width: {
          value: {
            doubleValue: 10,
          },
        },
        height: {
          value: {
            doubleValue: 20,
          },
        },
        textureUri: {
          value: {
            stringValue: 'filepath',
          },
        },
      },
    });
  });

  describe('updatePlaneGeometryEntityComponent', () => {
    it('should return expected plane', () => {
      expect(updatePlaneGeometryEntityComponent(plane)).toEqual({
        componentTypeId: componentTypeToId[KnownComponentType.PlaneGeometry],
        propertyUpdates: expect.objectContaining({
          width: {
            value: {
              doubleValue: 10,
            },
          },
          height: {
            value: {
              doubleValue: 20,
            },
          },
        }),
      });
    });

    it('should return expected colored plane', () => {
      expect(updatePlaneGeometryEntityComponent(coloredPlane)).toEqual({
        componentTypeId: componentTypeToId[KnownComponentType.PlaneGeometry],
        propertyUpdates: expect.objectContaining({
          width: {
            value: {
              doubleValue: 10,
            },
          },
          height: {
            value: {
              doubleValue: 20,
            },
          },
          color: {
            value: {
              stringValue: '#abcdef',
            },
          },
        }),
      });
    });

    it('should return expected textured ground plane', () => {
      expect(updatePlaneGeometryEntityComponent(texturedGroundPlane)).toEqual({
        componentTypeId: componentTypeToId[KnownComponentType.PlaneGeometry],
        propertyUpdates: expect.objectContaining({
          width: {
            value: {
              doubleValue: 10,
            },
          },
          height: {
            value: {
              doubleValue: 20,
            },
          },
          textureUri: {
            value: {
              stringValue: 'filepath',
            },
          },
        }),
      });
    });

    it('should reset properties that are no longer present', () => {
      expect(updatePlaneGeometryEntityComponent(plane, { ...plane, textureUri: '', color: '' })).toEqual({
        componentTypeId: componentTypeToId[KnownComponentType.PlaneGeometry],
        propertyUpdates: {
          textureUri: {
            updateType: PropertyUpdateType.RESET_VALUE,
          },
          color: {
            updateType: PropertyUpdateType.RESET_VALUE,
          },
          width: {
            value: {
              doubleValue: 10,
            },
          },
          height: {
            value: {
              doubleValue: 20,
            },
          },
        },
      });
    });
  });

  describe('parseLightComp', () => {
    it('should parse to expected plane component', () => {
      expect(
        parsePlaneGeometryComp({
          properties: [
            {
              propertyName: 'width',
              propertyValue: 10,
            },
            {
              propertyName: 'height',
              propertyValue: 20,
            },
          ],
        }),
      ).toEqual({
        ref: expect.any(String),
        ...plane,
      });
    });

    it('should parse to expected colored plane component', () => {
      expect(
        parsePlaneGeometryComp({
          properties: [
            {
              propertyName: 'width',
              propertyValue: 10,
            },
            {
              propertyName: 'height',
              propertyValue: 20,
            },
            {
              propertyName: 'color',
              propertyValue: '#abcdef',
            },
          ],
        }),
      ).toEqual({
        ref: expect.any(String),
        ...coloredPlane,
      });
    });

    it('should parse to expected textured ground plane component', () => {
      expect(
        parsePlaneGeometryComp({
          properties: [
            {
              propertyName: 'width',
              propertyValue: 10,
            },
            {
              propertyName: 'height',
              propertyValue: 20,
            },
            {
              propertyName: 'textureUri',
              propertyValue: 'filepath',
            },
          ],
        }),
      ).toEqual({
        ref: expect.any(String),
        ...texturedGroundPlane,
      });
    });

    it('should fail to parse component missing height or width', () => {
      expect(
        parsePlaneGeometryComp({
          properties: [
            {
              propertyName: 'color',
              propertyValue: '#abcdef',
            },
          ],
        }),
      ).toBeUndefined();
    });

    it('should fail to parse component missing properties', () => {
      expect(parsePlaneGeometryComp({})).toBeUndefined();
    });
  });
});
