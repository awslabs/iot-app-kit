import { Vector3, Object3D, Scene } from 'three';

import { AddingWidgetInfo, KnownComponentType } from '../../src';
import {
  createNodeWithTransform,
  findComponentByType,
  findNearestViableParentAncestorNodeRef,
} from '../../src/utils/nodeUtils';

describe('nodeUtils', () => {
  describe('findComponentByType', () => {
    const node = {
      components: [
        {
          type: KnownComponentType.Viewpoint,
          name: 'Viewpoint1',
        },
        {
          type: KnownComponentType.Tag,
          name: 'Tag',
        },
        {
          type: KnownComponentType.Viewpoint,
          name: 'Viewpoint2',
        },
      ],
    };

    it('should return the first matching component by type', () => {
      const component = findComponentByType(node as any, KnownComponentType.Viewpoint);

      expect((component as any)!.name).toEqual('Viewpoint1');
    });

    it('should return undefined if the component is not found', () => {
      const component = findComponentByType(node as any, KnownComponentType.Light);

      expect(component).toBeUndefined();
    });

    it('should return undefined if the node is undefined', () => {
      const component = findComponentByType(undefined, KnownComponentType.Viewpoint);

      expect(component).toBeUndefined();
    });
  });

  describe('findNearestViableParentAncestorNodeRef', () => {
    it('should be undefined if object undefined', () => {
      expect(findNearestViableParentAncestorNodeRef(undefined)).toBeUndefined();
    });

    it('should return undefined if no viable parent', () => {
      const scene = new Scene();
      const group = new Object3D();
      const tag = new Object3D();
      tag.userData = { nodeRef: 'node-ref', componentTypes: [KnownComponentType.Tag] };
      group.add(tag);
      scene.add(group);

      expect(findNearestViableParentAncestorNodeRef(tag)).toBeUndefined();
    });

    it('should return modelRef if ancestor is modelRef', () => {
      const scene = new Scene();
      const model = new Object3D();
      model.userData = { nodeRef: 'node-ref', componentTypes: [KnownComponentType.ModelRef] };
      const group = new Object3D();
      const tag = new Object3D();
      tag.userData = { nodeRef: 'node-ref', componentTypes: [KnownComponentType.Tag] };
      group.add(tag);
      model.add(group);
      scene.add(model);

      expect(findNearestViableParentAncestorNodeRef(tag)).toBe(model);
    });

    it('should return empty if ancestor is empty node', () => {
      const scene = new Scene();
      const empty = new Object3D();
      empty.userData = { nodeRef: 'node-ref', componentTypes: [] };
      const group = new Object3D();
      const tag = new Object3D();
      tag.userData = { nodeRef: 'node-ref', componentTypes: [KnownComponentType.Tag] };
      group.add(tag);
      empty.add(group);
      scene.add(empty);

      expect(findNearestViableParentAncestorNodeRef(tag)).toBe(empty);
    });
  });

  describe('createNodeWithTransform', () => {
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

      const node = createNodeWithTransform(widgetInfo, new Vector3(5, 5, 5), new Vector3());

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

      const node = createNodeWithTransform(widgetInfo, new Vector3(5, 5, 5), new Vector3(), parent);

      expect(node.ref).toEqual('test-ref');
      expect(node.components[0].type).toEqual(KnownComponentType.Tag);
      expect(node.transform.position).toEqual([1, 1, 1]);
      expect(node.transform.rotation).toEqual([0, 0, 0]);
      expect(node.transform.scale).toEqual([1, 1, 1]);
      expect(parent.worldToLocal).toBeCalledWith(new Vector3(5, 5, 5));
    });
  });
});
