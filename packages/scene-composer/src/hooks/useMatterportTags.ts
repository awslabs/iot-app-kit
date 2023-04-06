import { useCallback } from 'react';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { IAnchorComponent, ISceneNode, KnownComponentType } from '../interfaces';
import { IAnchorComponentInternal, ISceneNodeInternal, useStore } from '../store';
import { MattertagItem, TagItem } from '../utils/matterportTagUtils';
import { RecursivePartial } from '../utils/typeUtils';

const addTag = (
  addSceneNode: (node: ISceneNode, parentRef?: string) => Readonly<ISceneNode>,
  id: string,
  item: MattertagItem | TagItem,
) => {
  const anchorComponent: IAnchorComponent = {
    type: KnownComponentType.Tag,
    offset: [item.stemVector.x, item.stemVector.y, item.stemVector.z],
  };
  const node = {
    name: item.label,
    components: [anchorComponent],
    transform: {
      position: [item.anchorPosition.x, item.anchorPosition.y, item.anchorPosition.z],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    properties: {
      matterportId: id, //mattertag uses item.sid and tag uses item.id so we just us the collection key for both
    },
  } as ISceneNode;
  addSceneNode(node);
};

const updateTag = (
  updateSceneNode: (ref: string, partial: RecursivePartial<ISceneNodeInternal>, isTransient?: boolean) => void,
  ref: string,
  node: ISceneNodeInternal,
  item: MattertagItem | TagItem,
) => {
  // assume only one tag per node which is same assumption as findComponentByType
  const components = [...node.components];
  const tagIndex = node.components.findIndex((elem) => elem.type === KnownComponentType.Tag);
  if (tagIndex !== -1) {
    components[tagIndex] = {
      ...components[tagIndex],
      offset: [item.stemVector.x, item.stemVector.y, item.stemVector.z],
    } as IAnchorComponentInternal;
  }
  updateSceneNode(ref, {
    name: item.label,
    transform: {
      position: [item.anchorPosition.x, item.anchorPosition.y, item.anchorPosition.z],
    },
    components: components,
  });
};

const useMatterportTags = (): {
  handleAddMatterportTag: (id: string, item: MattertagItem | TagItem) => void;
  handleUpdateMatterportTag: (ref: string, node: ISceneNodeInternal, item: MattertagItem | TagItem) => void;
  handleRemoveMatterportTag: (nodeRef: string) => void;
} => {
  const sceneComposerId = useSceneComposerId();
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const updateSceneNodeInternal = useStore(sceneComposerId)((state) => state.updateSceneNodeInternal);
  const removeSceneNode = useStore(sceneComposerId)((state) => state.removeSceneNode);

  const handleAddMatterportTag = useCallback(
    (id: string, item: MattertagItem | TagItem) => {
      addTag(appendSceneNode, id, item);
    },
    [appendSceneNode],
  );

  const handleUpdateMatterportTag = useCallback(
    (ref: string, node: ISceneNodeInternal, item: MattertagItem | TagItem) => {
      updateTag(updateSceneNodeInternal, ref, node, item);
    },
    [updateSceneNodeInternal],
  );

  const handleRemoveMatterportTag = useCallback(
    (nodeRef: string) => {
      removeSceneNode(nodeRef);
    },
    [removeSceneNode],
  );

  return { handleAddMatterportTag, handleUpdateMatterportTag, handleRemoveMatterportTag };
};

export default useMatterportTags;
