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

describe('createPlaneGeometryEntityComponent', () => {
  it('should return expected plane with no color', () => {
    expect(
      createPlaneGeometryEntityComponent({
        type: KnownComponentType.PlaneGeometry,
        width: 10,
        height: 20,
      }),
    ).toEqual({
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

  it('should return expected plane with no color', () => {
    expect(
      createPlaneGeometryEntityComponent({
        type: KnownComponentType.PlaneGeometry,
        width: 10,
        height: 20,
        color: '#abcdef',
      }),
    ).toEqual({
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
