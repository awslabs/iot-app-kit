import { useCallback } from 'react';
import { CreateEntityCommandInput } from '@aws-sdk/client-iottwinmaker';
import { Color } from 'three';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import {
  COMPOSER_FEATURES,
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
import { createTagEntityComponent } from '../utils/entityModelUtils/tagComponent';
import { createOverlayEntityComponent } from '../utils/entityModelUtils/overlayComponent';
import { createNodeEntityComponent } from '../utils/entityModelUtils/nodeComponent';
import { convertToIotTwinMakerNamespace } from '../utils/sceneResourceUtils';
import { SceneNodeRuntimeProperty } from '../store/internalInterfaces';
import { isDynamicNode } from '../utils/entityModelUtils/sceneUtils';

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
  addSceneNode: (node: ISceneNode, disableAutoSelect?: boolean) => Readonly<ISceneNode>,
  { layerId, sceneRootId, id, item }: AddTagInputs,
) => {
  const tagStyleEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.TagStyle];

  const anchorComponent: IAnchorComponent = {
    type: KnownComponentType.Tag,
    offset: [item.stemVector.x, item.stemVector.y, item.stemVector.z],
    icon: tagStyleEnabled
      ? convertToIotTwinMakerNamespace(SceneResourceType.Icon, DefaultAnchorStatus.Custom)
      : undefined,
    chosenColor: tagStyleEnabled
      ? '#' + new Color(item.color.r, item.color.g, item.color.b).getHexString('srgb')
      : undefined,
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
      [SceneNodeRuntimeProperty.LayerIds]: layerId && dynamicSceneEnabled ? [layerId] : undefined,
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
    await sceneMetadataModule.createSceneEntity(creatEntity);
  }
  addSceneNode(node, true);
};

const updateTag = async (
  dynamicSceneEnabled: boolean,
  updateSceneNode: (
    ref: string,
    partial: RecursivePartial<ISceneNodeInternal>,
    isTransient?: boolean,
    skipEntityUpdate?: boolean,
  ) => void,
  { layerId, sceneRootId, ref, node, item }: UpdateTagInputs,
) => {
  const shouldSyncTagStyle = getGlobalSettings().featureConfig[COMPOSER_FEATURES.TagStyle] && item.color;

  // assume only one tag per node which is same assumption as findComponentByType
  const components = [...node.components];
  const tagIndex = node.components.findIndex((elem) => elem.type === KnownComponentType.Tag);
  if (tagIndex !== -1) {
    const tag = components[tagIndex] as IAnchorComponent;
    const icon = shouldSyncTagStyle
      ? convertToIotTwinMakerNamespace(SceneResourceType.Icon, DefaultAnchorStatus.Custom)
      : tag.icon;
    const chosenColor = shouldSyncTagStyle
      ? '#' + new Color(item.color.r, item.color.g, item.color.b).getHexString('srgb')
      : tag.chosenColor;

    components[tagIndex] = {
      ...components[tagIndex],
      offset: [item.stemVector.x, item.stemVector.y, item.stemVector.z],
      icon,
      chosenColor,
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
  const isUpdate = isDynamicNode(node);

  if (dynamicSceneEnabled && sceneMetadataModule) {
    if (!layerId) {
      return;
    }

    if (!isUpdate) {
      const tagComp = tagIndex !== -1 ? createTagEntityComponent(components[tagIndex]) : undefined;
      const overlayComp =
        dataOverlayIndex !== -1
          ? createOverlayEntityComponent(components[dataOverlayIndex] as IDataOverlayComponent)
          : undefined;
      const nodeComp = createNodeEntityComponent(node, layerId);

      const createEntity: CreateEntityCommandInput = {
        workspaceId: undefined,
        entityId: ref,
        entityName: item.label + '_' + ref,
        parentEntityId: sceneRootId,
        components: {
          Node: nodeComp,
        },
      };
      if (tagComp) {
        createEntity.components![KnownComponentType.Tag] = tagComp;
      }
      if (overlayComp) {
        createEntity.components![KnownComponentType.DataOverlay] = overlayComp;
      }
      await sceneMetadataModule.createSceneEntity(createEntity);
    }
  }

  updateSceneNode(
    ref,
    {
      name: item.label,
      transform: {
        position: [item.anchorPosition.x, item.anchorPosition.y, item.anchorPosition.z],
      },
      components: components,
      properties: {
        [SceneNodeRuntimeProperty.LayerIds]: layerId && dynamicSceneEnabled ? [layerId] : undefined,
      },
    },
    false,
    !isUpdate,
  );
};

type AddTagInputs = {
  layerId?: string;
  sceneRootId?: string;
  id: string;
  item: MattertagItem | TagItem;
};
type UpdateTagInputs = {
  layerId?: string;
  sceneRootId?: string;
  ref: string;
  node: ISceneNodeInternal;
  item: MattertagItem | TagItem;
};

const useMatterportTags = (): {
  handleAddMatterportTag: (inputs: AddTagInputs) => Promise<void>;
  handleUpdateMatterportTag: (inputs: UpdateTagInputs) => Promise<void>;
  handleRemoveMatterportTag: (nodeRef: string) => Promise<void>;
} => {
  const sceneComposerId = useSceneComposerId();
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const updateSceneNodeInternal = useStore(sceneComposerId)((state) => state.updateSceneNodeInternal);
  const removeSceneNode = useStore(sceneComposerId)((state) => state.removeSceneNode);
  const dynamicSceneEnabled = useDynamicScene();

  const handleAddMatterportTag = useCallback(
    async (inputs: AddTagInputs) => {
      await addTag(dynamicSceneEnabled, appendSceneNode, inputs);
    },
    [appendSceneNode],
  );

  const handleUpdateMatterportTag = useCallback(
    async (inputs: UpdateTagInputs) => {
      await updateTag(dynamicSceneEnabled, updateSceneNodeInternal, inputs);
    },
    [updateSceneNodeInternal],
  );

  const handleRemoveMatterportTag = useCallback(
    async (nodeRef: string) => {
      const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;
      if (dynamicSceneEnabled && sceneMetadataModule) {
        await sceneMetadataModule.deleteSceneEntity({ entityId: nodeRef });
      }
      removeSceneNode(nodeRef);
    },
    [removeSceneNode],
  );

  return { handleAddMatterportTag, handleUpdateMatterportTag, handleRemoveMatterportTag };
};

export default useMatterportTags;
