import { Vector3, Object3D, Euler, MathUtils, Quaternion } from 'three';

import { AddingWidgetInfo, KnownComponentType } from '../../src';

import { createNodeWithPositionAndNormal, createNodeWithTransform, findComponentByType } from './nodeUtils';

describe('nodeUtils', () => {
  describe('findComponentByType', () => {
    const node = {
      components: [
        {
          type: KnownComponentType.Tag,
          name: 'Tag',
        },
      ],
    };

    it('should return undefined if the component is not found', () => {
      const component = findComponentByType(node as any, KnownComponentType.Light);

      expect(component).toBeUndefined();
    });
  });

  describe('createNodeWithPositionAndNormal', () => {
    it('should create a node with the world coordinates', () => {
      const widgetInfo = {
        type: KnownComponentType.Tag,
        node: {
          ref: 'test-ref',
          components: [
            {
              type: KnownComponentType.Tag,
            },
          ],
        },
      } as AddingWidgetInfo;

      const node = createNodeWithPositionAndNormal(widgetInfo, new Vector3(5, 5, 5), new Vector3());

      expect(node.ref).toEqual('test-ref');
      expect(node.components[0].type).toEqual(KnownComponentType.Tag);
      expect(node.transform.position).toEqual([5, 5, 5]);
      expect(node.transform.rotation).toEqual([0, 0, 0]);
      expect(node.transform.scale).toEqual([1, 1, 1]);
    });

    it('should create a node with the local parent coordinates', () => {
      const parent = new Object3D();
      parent.userData = { nodeRef: 'parent-ref', componentTypes: [KnownComponentType.ModelRef] };
      parent.worldToLocal = jest.fn().mockReturnValue(new Vector3(1, 1, 1));
      const widgetInfo = {
        type: KnownComponentType.Tag,
        node: {
          ref: 'test-ref',
          components: [
            {
              type: KnownComponentType.Tag,
            },
          ],
        },
      } as AddingWidgetInfo;

      const node = createNodeWithPositionAndNormal(widgetInfo, new Vector3(5, 5, 5), new Vector3(), parent);

      expect(node.ref).toEqual('test-ref');
      expect(node.components[0].type).toEqual(KnownComponentType.Tag);
      expect(node.transform.position).toEqual([1, 1, 1]);
      expect(node.transform.rotation).toEqual([0, 0, 0]);
      expect(node.transform.scale).toEqual([1, 1, 1]);
      expect(parent.worldToLocal).toBeCalledWith(new Vector3(5, 5, 5));
    });
  });

  describe('createNodeWithTransform', () => {
    it('should create a node with the world coordinates', () => {
      const widgetInfo = {
        type: KnownComponentType.Camera,
        node: {
          ref: 'test-ref',
          components: [
            {
              type: KnownComponentType.Camera,
            },
          ],
        },
      } as AddingWidgetInfo;

      const node = createNodeWithTransform(widgetInfo, new Vector3(5, 5, 5), new Euler(0, 0, 0), new Vector3(1, 1, 1));

      expect(node).toMatchSnapshot();
    });

    it('should create a node with the local parent coordinates', () => {
      const parent = new Object3D();
      parent.userData = { nodeRef: 'parent-ref', componentTypes: [KnownComponentType.ModelRef] };
      parent.quaternion.setFromEuler(new Euler(MathUtils.degToRad(90), 0, 0));
      parent.worldToLocal = jest.fn().mockReturnValue(new Vector3(1, 1, 1));
      const widgetInfo = {
        type: KnownComponentType.Camera,
        node: {
          ref: 'test-ref',
          components: [
            {
              type: KnownComponentType.Camera,
            },
          ],
        },
      } as AddingWidgetInfo;

      const rotation = new Euler(0, MathUtils.degToRad(90), 0);

      const node = createNodeWithTransform(widgetInfo, new Vector3(5, 5, 5), rotation, new Vector3(1, 1, 1), parent);

      expect(node).toMatchSnapshot();
    });
  });
});
