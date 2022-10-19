interface ISceneHierarchyNode {
  objectRef: string;
  name: string;
  childRefs: string[];
  componentTypes?: string[];
  parentRef?: string;
}

export default ISceneHierarchyNode;
