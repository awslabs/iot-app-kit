import { ISceneNodeInternal, IModelRefComponentInternal } from '../../../store';

export const fakeSceneNode = (ref: string, childRefs: string[] = []): ISceneNodeInternal => {
  return {
    ref,
    name: '',
    transform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [0, 0, 0],
    },
    transformConstraint: { snapToFloor: true },
    components: [
      {
        ref: '123',
      } as IModelRefComponentInternal,
    ],
    childRefs: childRefs,
    properties: {},
  };
};
