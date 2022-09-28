import InterfaceHelpers from '../../../src/store/helpers/interfaceHelpers';
import * as MathUtils from '../../../src/utils/mathUtils';
import { ISceneComponent, ITransform, ITransformConstraint } from '../../../src';

describe('interfaceHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an internal scene composer node with generated id', () => {
    jest.spyOn(MathUtils, 'generateUUID').mockReturnValue('test-uuid');
    const sceneComponentInternal = InterfaceHelpers.createSceneComponentInternal({ type: 'testComponent' });

    expect(MathUtils.generateUUID).toBeCalled();
    expect(sceneComponentInternal?.ref).toEqual('test-uuid');
    expect(sceneComponentInternal?.type).toEqual('testComponent');
  });

  it('creates an internal scene composer node with maintained id', () => {
    jest.spyOn(MathUtils, 'generateUUID');
    const sceneComponentInternal = InterfaceHelpers.createSceneComponentInternal({
      ref: 'a2a91acc-3a47-4875-a146-b95741aedc2a',
      type: 'testComponent',
    });

    expect(MathUtils.generateUUID).not.toBeCalled();
    expect(sceneComponentInternal?.ref).toEqual('a2a91acc-3a47-4875-a146-b95741aedc2a');
    expect(sceneComponentInternal?.type).toEqual('testComponent');
  });

  it('creates a scene node internal with defaults from minimal scene node', () => {
    jest.spyOn(MathUtils, 'generateUUID').mockReturnValue('test-uuid');

    const sceneNodeInternal = InterfaceHelpers.createSceneNodeInternal({});
    expect(MathUtils.generateUUID).toBeCalled();
    expect(sceneNodeInternal.ref).toEqual('test-uuid');
    expect(sceneNodeInternal.name).toEqual('test-uuid');
    expect(sceneNodeInternal.transform).toEqual({
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    });
    expect(sceneNodeInternal.transformConstraint).toEqual({});
    expect(sceneNodeInternal.components).toEqual([]);
    expect(sceneNodeInternal.parentRef).toBeUndefined();
    expect(sceneNodeInternal.childRefs).toEqual([]);
  });

  it('creates a scene node internal from complete scene node', () => {
    jest.spyOn(MathUtils, 'generateUUID');
    const sceneNode = {
      ref: 'a2a91acc-3a47-4875-a146-b95741aedc2a',
      name: 'testNode',
      transform: {
        position: [0, 1, 2],
        rotation: [180, 90, 0],
        scale: [1, 1, 1],
      },
      transformConstraint: { snapToFloor: true },
      components: [
        {
          ref: 'a2a91acc-3a47-4875-a146-b95741aedc2a',
          type: 'testComponent',
        },
      ],
      parentRef: 'testParent',
      childRefs: ['testChild'],
    };

    const sceneNodeInternal = InterfaceHelpers.createSceneNodeInternal(sceneNode as any);
    expect(MathUtils.generateUUID).not.toBeCalled();
    expect(sceneNodeInternal.ref).toEqual(sceneNode.ref);
    expect(sceneNodeInternal.name).toEqual(sceneNode.name);
    expect(sceneNodeInternal.transform).toEqual(sceneNode.transform);
    expect(sceneNodeInternal.transformConstraint).toEqual(sceneNode.transformConstraint);
    expect(sceneNodeInternal.components).toEqual(sceneNode.components);
    expect(sceneNodeInternal.parentRef).toEqual(sceneNode.parentRef);
    expect(sceneNodeInternal.childRefs).toEqual(sceneNode.childRefs);
  });
});
