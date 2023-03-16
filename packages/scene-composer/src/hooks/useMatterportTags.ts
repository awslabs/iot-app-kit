import { useRef, useCallback, useEffect } from 'react';
import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { IAnchorComponent, ISceneNode, KnownComponentType } from '../interfaces';
import { IAnchorComponentInternal, ISceneComponentInternal, ISceneNodeInternal, useStore } from '../store';
import { MattertagItem, MattertagObserver, TagItem, TagObserver} from '../utils/matterportTagUtils';
import { findComponentByType } from '../utils/nodeUtils';
import { RecursivePartial } from '../utils/typeUtils';

const addTag = (
  addSceneNode: (node: ISceneNode, parentRef?: string) => Readonly<ISceneNode>,
  id: string,
  item: MattertagItem | TagItem) => {
    const anchorComponent: IAnchorComponent = {
      type: 'Tag',
      offset: [item.stemVector.x, item.stemVector.y, item.stemVector.z],
    };
   const node = {
      name: item.label,
      components: [anchorComponent],
      transform: {
        // rotate the point through x-axis by -90 degree
        position: [item.anchorPosition.x, item.anchorPosition.y, item.anchorPosition.z],
        rotation: [0,0,0],
        scale: [1,1,1],
      },
      properties: {
        matterportId: id, //mattertag uses item.sid and tag uses item.id so we just us the collection key for both
      },
      //parentRef: getRefForParenting(),
    } as ISceneNode;
    addSceneNode(node);
};

const updateTag = (
  updateSceneNode: (ref: string, partial: RecursivePartial<ISceneNodeInternal>, isTransient?: boolean) => void,
  updateComponen: (nodeRef: string, component: ISceneComponentInternal, replace?: boolean) => void,
  ref: string,
  node: ISceneNodeInternal,
  item: MattertagItem | TagItem
) => {
  updateSceneNode(ref, {
    name: item.label,
    transform: {
      // rotate the point through x-axis by -90 degree
      position: [item.anchorPosition.x, item.anchorPosition.y, item.anchorPosition.z],
      rotation: [0,0,0],
      scale: [1,1,1],
    },
  });
  const tagComponent = findComponentByType(node, KnownComponentType.Tag) as IAnchorComponentInternal;
  const result = {... tagComponent, offset: [item.stemVector.x, item.stemVector.y, item.stemVector.z]};
  updateComponen(ref, result );
};

const useMatterportTags = () => {
  const sceneComposerId = useSceneComposerId();
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const updateSceneNodeInternal = useStore(sceneComposerId)((state) => state.updateSceneNodeInternal);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const removeSceneNode = useStore(sceneComposerId)((state) => state.removeSceneNode);

  const handleAddMatterportTag = useCallback((id: string, item: MattertagItem | TagItem) => {
    addTag(appendSceneNode, id, item);
  }, [appendSceneNode]);
  
  const handleUpdateMatterportTag = useCallback((ref: string, node: ISceneNodeInternal, item: MattertagItem | TagItem) => {
    updateTag(updateSceneNodeInternal, updateComponentInternal, ref, node, item);
  },[updateSceneNodeInternal, updateComponentInternal]);

  const handleRemoveMatterportTag = useCallback((nodeRef: string) => {
    removeSceneNode(nodeRef);
  },[removeSceneNode]);

  return {handleAddMatterportTag, handleUpdateMatterportTag, handleRemoveMatterportTag};
};

export default useMatterportTags;
