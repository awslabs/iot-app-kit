import { ISceneNodeInternal } from "../src/store";

export const defaultNode: ISceneNodeInternal = {
    ref: 'node-ref',
    name: 'default-node',
    transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
    },
    transformConstraint: {},
    childRefs: [],
    components: [],
    properties: {},
};
