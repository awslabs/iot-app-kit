interface ISceneHierarchyNode {
  objectRef: string;
  name: string;
  componentTypes?: string[];
  parentRef?: string;
}

export default ISceneHierarchyNode;
