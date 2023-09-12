import { useCallback } from 'react';
import { CreateEntityCommandInput, UpdateEntityCommandInput } from '@aws-sdk/client-iottwinmaker';
import { Color } from 'three';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import {
  DefaultAnchorStatus,
  IAnchorComponent,
  IDataOverlayComponent,
  ISceneNode,
  KnownComponentType,
  SceneResourceType,
} from '../interfaces';
import { IAnchorComponentInternal, IDataOverlayComponentInternal, ISceneNodeInternal, useStore } from '../store';
import { MattertagItem, TagItem } from '../utils/matterportTagUtils';
import { RecursivePartial } from '../utils/typeUtils';
import { Component } from '../models/SceneModels';
import { generateUUID } from '../utils/mathUtils';
import { getGlobalSettings } from '../common/GlobalSettings';
import { createTagEntityComponent, updateTagEntityComponent } from '../utils/entityModelUtils/tagComponent';
import { createOverlayEntityComponent, updateOverlayEntityComponent } from '../utils/entityModelUtils/overlayComponent';
import { createNodeEntityComponent, updateNodeEntityComponent } from '../utils/entityModelUtils/nodeComponent';
import { convertToIotTwinMakerNamespace } from '../utils/sceneResourceUtils';
import { SceneNodeRuntimeProperty } from '../store/internalInterfaces';

import useDynamicScene from './useDynamicScene';

const getContentForOverlayComponent = (label: string, description: string): string => {
  // Do not change indentation as it affects rendering
  return `#### **${label}**  
${description}`;
};

const getNewDataOverlayComponent = (item: MattertagItem | TagItem): IDataOverlayComponentInternal => {
  const dataoverlayComponent: IDataOverlayComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.DataOverlay,
    subType: Component.DataOverlaySubType.OverlayPanel,
    valueDataBindings: [],
    dataRows: [
      {
        rowType: Component.DataOverlayRowType.Markdown,
        content: getContentForOverlayComponent(item.label, item.description),
      },
    ],
  };
  return dataoverlayComponent;
};

const addTag = async (
  dynamicSceneEnabled: boolean,
  layerId: string | undefined,
  sceneRootId: string | undefined,
  addSceneNode: (node: ISceneNode, parentRef?: string) => Readonly<ISceneNode>,
  id: string,
  item: MattertagItem | TagItem,
) => {
  const anchorComponent: IAnchorComponent = {
    type: KnownComponentType.Tag,
    offset: [item.stemVector.x, item.stemVector.y, item.stemVector.z],
    icon: convertToIotTwinMakerNamespace(SceneResourceType.Icon, DefaultAnchorStatus.Custom),
    chosenColor: '#' + new Color(item.color.r, item.color.g, item.color.b).getHexString('srgb'),
  };
  const dataoverlayComponent = getNewDataOverlayComponent(item);
  const nodeRef = generateUUID();
  const node = {
    ref: nodeRef,
    name: item.label,
    components: [anchorComponent, dataoverlayComponent],
    transform: {
      position: [item.anchorPosition.x, item.anchorPosition.y, item.anchorPosition.z],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    properties: {
      matterportId: id, //mattertag uses item.sid and tag uses item.id so we just us the collection key for both
      [SceneNodeRuntimeProperty.LayerIds]: layerId ? [layerId] : undefined,
    },
  } as ISceneNode;

  const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;

  if (dynamicSceneEnabled && sceneMetadataModule) {
    if (!layerId || !sceneRootId) {
      return;
    }

    const tagComp = createTagEntityComponent(anchorComponent);
    const overlayComp = createOverlayEntityComponent(dataoverlayComponent);
    const nodeComp = createNodeEntityComponent(node, layerId);

    const creatEntity: CreateEntityCommandInput = {
      workspaceId: undefined,
      entityId: nodeRef,
      entityName: item.label + '_' + nodeRef,
      parentEntityId: sceneRootId,
      components: {
        [KnownComponentType.Tag]: tagComp,
        [KnownComponentType.DataOverlay]: overlayComp,
        Node: nodeComp,
      },
    };
    try {
      await sceneMetadataModule.createSceneEntity(creatEntity);
    } catch (e) {
      console.error('Create scene node entity failed', e);
    }
  }
  addSceneNode(node);
};

const updateTag = async (
  dynamicSceneEnabled: boolean,
  layerId: string | undefined,
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
      icon: convertToIotTwinMakerNamespace(SceneResourceType.Icon, DefaultAnchorStatus.Custom),
      chosenColor: '#' + new Color(item.color.r, item.color.g, item.color.b).getHexString('srgb'),
    } as IAnchorComponentInternal;
  }
  const dataOverlayIndex = node.components.findIndex((elem) => elem.type === KnownComponentType.DataOverlay);
  if (dataOverlayIndex !== -1) {
    components[dataOverlayIndex] = {
      ...components[dataOverlayIndex],
      dataRows: [
        {
          rowType: Component.DataOverlayRowType.Markdown,
          content: getContentForOverlayComponent(item.label, item.description),
        },
      ],
    } as IDataOverlayComponentInternal;
  } else {
    const dataoverlayComponent = getNewDataOverlayComponent(item);
    components.push(dataoverlayComponent);
  }

  const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;

  if (dynamicSceneEnabled && sceneMetadataModule) {
    if (!layerId) {
      return;
    }

    const tagComp = tagIndex !== -1 ? updateTagEntityComponent(components[tagIndex]) : undefined;
    const overlayComp =
      dataOverlayIndex !== -1
        ? updateOverlayEntityComponent(components[dataOverlayIndex] as IDataOverlayComponent)
        : undefined;
    const nodeComp = updateNodeEntityComponent(node, layerId);

    const updateEntity: UpdateEntityCommandInput = {
      workspaceId: undefined,
      entityId: ref,
      entityName: item.label + '_' + ref,
      componentUpdates: {
        Node: nodeComp,
      },
    };
    if (tagComp) {
      updateEntity.componentUpdates![KnownComponentType.Tag] = tagComp;
    }
    if (overlayComp) {
      updateEntity.componentUpdates![KnownComponentType.DataOverlay] = overlayComp;
    }
    try {
      await sceneMetadataModule.updateSceneEntity(updateEntity);
    } catch (e) {
      console.error('Update scene node entity failed', e);
    }
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
  handleAddMatterportTag: (
    layerId: string | undefined,
    sceneRootId: string | undefined,
    id: string,
    item: MattertagItem | TagItem,
  ) => Promise<void>;
  handleUpdateMatterportTag: (
    layerId: string | undefined,
    ref: string,
    node: ISceneNodeInternal,
    item: MattertagItem | TagItem,
  ) => Promise<void>;
  handleRemoveMatterportTag: (nodeRef: string) => void;
} => {
  const sceneComposerId = useSceneComposerId();
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const updateSceneNodeInternal = useStore(sceneComposerId)((state) => state.updateSceneNodeInternal);
  const removeSceneNode = useStore(sceneComposerId)((state) => state.removeSceneNode);
  const dynamicSceneEnabled = useDynamicScene();

  const handleAddMatterportTag = useCallback(
    async (layerId: string | undefined, sceneRootId: string | undefined, id: string, item: MattertagItem | TagItem) => {
      await addTag(dynamicSceneEnabled, layerId, sceneRootId, appendSceneNode, id, item);
    },
    [appendSceneNode],
  );

  const handleUpdateMatterportTag = useCallback(
    async (layerId: string | undefined, ref: string, node: ISceneNodeInternal, item: MattertagItem | TagItem) => {
      await updateTag(dynamicSceneEnabled, layerId, updateSceneNodeInternal, ref, node, item);
    },
    [updateSceneNodeInternal],
  );

  const handleRemoveMatterportTag = useCallback(
    (nodeRef: string) => {
      const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;
      if (dynamicSceneEnabled && sceneMetadataModule) {
        sceneMetadataModule
          .deleteSceneEntity({ entityId: nodeRef })
          .then((_) => {
            removeSceneNode(nodeRef);
          })
          .catch((e) => {
            console.error('Delete scene node entity failed', e);
          });
      } else {
        removeSceneNode(nodeRef);
      }
    },
    [removeSceneNode],
  );

  return { handleAddMatterportTag, handleUpdateMatterportTag, handleRemoveMatterportTag };
};

export default useMatterportTags;
