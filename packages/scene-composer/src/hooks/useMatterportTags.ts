import { useCallback } from 'react';
import { Color } from 'three';
import { isEmpty } from 'lodash';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import {
  DefaultAnchorStatus,
  IAnchorComponent,
  ISceneNode,
  KnownComponentType,
  SceneResourceType,
} from '../interfaces';
import { IAnchorComponentInternal, IDataOverlayComponentInternal, ISceneNodeInternal, useStore } from '../store';
import { MattertagItem, TagItem } from '../utils/matterportTagUtils';
import { RecursivePartial } from '../utils/typeUtils';
import { Component } from '../models/SceneModels';
import { generateUUID } from '../utils/mathUtils';
import { convertToIotTwinMakerNamespace } from '../utils/sceneResourceUtils';
import { FONT_AWESOME_PREFIX, MATTERPORT_FONTID_PROPERTY } from '../common/constants';

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

const addTag = (
  addSceneNode: (node: ISceneNode, disableAutoSelect?: boolean) => Readonly<ISceneNode>,
  { id, item }: AddTagInputs,
) => {
  const anchorComponent: IAnchorComponent = {
    type: KnownComponentType.Tag,
    offset: [item.stemVector.x, item.stemVector.y, item.stemVector.z],
    icon: convertToIotTwinMakerNamespace(SceneResourceType.Icon, DefaultAnchorStatus.Custom),
    chosenColor: '#' + new Color(item.color.r, item.color.g, item.color.b).getHexString('srgb'),
    customIcon:
      MATTERPORT_FONTID_PROPERTY in item && !isEmpty(item.fontId)
        ? { prefix: FONT_AWESOME_PREFIX, iconName: item.fontId }
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
    },
  } as ISceneNode;

  addSceneNode(node, true);
};

const updateTag = (
  updateSceneNode: (ref: string, partial: RecursivePartial<ISceneNodeInternal>, isTransient?: boolean) => void,
  { ref, node, item }: UpdateTagInputs,
) => {
  const shouldSyncTagStyle = item.color;

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
    const customIcon =
      shouldSyncTagStyle && MATTERPORT_FONTID_PROPERTY in item && !isEmpty(item.fontId)
        ? { prefix: FONT_AWESOME_PREFIX, iconName: item.fontId }
        : tag.customIcon;

    components[tagIndex] = {
      ...components[tagIndex],
      offset: [item.stemVector.x, item.stemVector.y, item.stemVector.z],
      icon,
      chosenColor,
      customIcon,
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

  updateSceneNode(
    ref,
    {
      name: isEmpty(item.label) ? node.name : item.label,
      transform: {
        position: [item.anchorPosition.x, item.anchorPosition.y, item.anchorPosition.z],
      },
      components: components,
    },
    false,
  );
};

type AddTagInputs = {
  id: string;
  item: MattertagItem | TagItem;
};
type UpdateTagInputs = {
  ref: string;
  node: ISceneNodeInternal;
  item: MattertagItem | TagItem;
};

const useMatterportTags = (): {
  handleAddMatterportTag: (inputs: AddTagInputs) => void;
  handleUpdateMatterportTag: (inputs: UpdateTagInputs) => void;
  handleRemoveMatterportTag: (nodeRef: string) => void;
} => {
  const sceneComposerId = useSceneComposerId();
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const updateSceneNodeInternal = useStore(sceneComposerId)((state) => state.updateSceneNodeInternal);
  const removeSceneNode = useStore(sceneComposerId)((state) => state.removeSceneNode);

  const handleAddMatterportTag = useCallback(
    async (inputs: AddTagInputs) => {
      addTag(appendSceneNode, inputs);
    },
    [appendSceneNode],
  );

  const handleUpdateMatterportTag = useCallback(
    async (inputs: UpdateTagInputs) => {
      updateTag(updateSceneNodeInternal, inputs);
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
