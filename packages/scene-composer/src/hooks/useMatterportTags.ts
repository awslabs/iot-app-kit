import { useCallback } from 'react';
import { CreateEntityCommand, UpdateEntityCommand } from '@aws-sdk/client-iottwinmaker';
import { Color } from 'three';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { IAnchorComponent, ISceneNode, KnownComponentType } from '../interfaces';
import { IAnchorComponentInternal, IDataOverlayComponentInternal, ISceneNodeInternal, useStore } from '../store';
import { MattertagItem, TagItem } from '../utils/matterportTagUtils';
import { RecursivePartial } from '../utils/typeUtils';
import { Component } from '../models/SceneModels';
import { generateUUID } from '../utils/mathUtils';
import { getGlobalSettings } from '../common/GlobalSettings';

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
  addSceneNode: (node: ISceneNode, parentRef?: string) => Readonly<ISceneNode>,
  id: string,
  item: MattertagItem | TagItem,
) => {
  const tmClient = getGlobalSettings().tmClient;

  console.log('xxx item', item);
  const anchorComponent: IAnchorComponent = {
    type: KnownComponentType.Tag,
    offset: [item.stemVector.x, item.stemVector.y, item.stemVector.z],
  };
  const dataoverlayComponent = getNewDataOverlayComponent(item);
  const node = {
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

  const creatEntity = new CreateEntityCommand({
    workspaceId: getGlobalSettings().wsId,
    entityId: id,
    entityName: item.label,
  });
  try {
    await tmClient?.send(creatEntity);
  } catch {}

  const transformComp = new UpdateEntityCommand({
    workspaceId: getGlobalSettings().wsId,
    entityId: id,
    componentUpdates: {
      tagnode_transform: {
        componentTypeId: 'com.example.3d.transform',
        propertyUpdates: {
          position: {
            value: {
              listValue: [
                { doubleValue: item.anchorPosition.x },
                { doubleValue: item.anchorPosition.y },
                { doubleValue: item.anchorPosition.z },
              ],
            },
          },
          rotation: {
            value: {
              listValue: [{ doubleValue: 0 }, { doubleValue: 0 }, { doubleValue: 0 }],
            },
          },
          scale: {
            value: {
              listValue: [{ doubleValue: 1 }, { doubleValue: 1 }, { doubleValue: 1 }],
            },
          },
        },
      },
      // 'tagnode_component_0_databinding': {
      //   'componentTypeId':'com.example.3d.twinmaker.databinding.context',
      //   propertyUpdates: {
      //     "entityId": {
      //       "value": { "stringValue": undefined}
      //     },
      //     "componentName": {
      //         "value": { "stringValue": undefined}
      //     },
      //     "propertyName": {
      //         "value": { "stringValue": undefined}
      //     }
      //   }
      // },
      tagnode_component_0: {
        componentTypeId: 'com.example.3d.component.tag',
        propertyUpdates: {
          type: {
            value: { stringValue: anchorComponent['type'] },
          },
          icon: {
            value: {
              stringValue: 'iottwinmaker.common.icon:Custom',
            },
          },
          chosenColor: {
            value: {
              stringValue: '#' + new Color(item.color.r, item.color.g, item.color.b).getHexString('srgb'),
            },
          },
          offset_pure: {
            definition: {
              dataType: {
                type: 'LIST',
                nestedType: {
                  type: 'DOUBLE',
                },
              },
            },
            value: {
              listValue: [
                { doubleValue: item.stemVector.x },
                { doubleValue: item.stemVector.y },
                { doubleValue: item.stemVector.z },
              ],
            },
          },
          // "ruleBasedMapId": {
          //     "value": { "stringValue": anchorComponent["ruleBasedMapId"]}
          // },
          // "valueDataBinding": {
          //     "value": {
          //         "relationshipValue": {
          //             "targetEntityId": id,
          //             "targetComponentName": 'tagnode_component_0_databinding'
          //         }
          //     }
          // }
        },
      },
      tagnode_component_1_row: {
        componentTypeId: 'com.example.3d.component.data.overlay.markdown.row',
        propertyUpdates: {
          content: {
            value: { stringValue: encodeURI(dataoverlayComponent.dataRows[0].content) },
          },
          rowType: {
            value: { stringValue: dataoverlayComponent.dataRows[0].rowType },
          },
        },
      },
      tagnode_component_1: {
        componentTypeId: 'com.example.3d.component.dataoverlay',
        propertyUpdates: {
          type: {
            value: { stringValue: dataoverlayComponent.type },
          },
          subType: {
            value: { stringValue: dataoverlayComponent.subType },
          },
          dataRows: {
            value: {
              listValue: [
                {
                  relationshipValue: {
                    targetEntityId: id,
                    targetComponentName: 'tagnode_component_1_row', // TODO: only one row for now
                  },
                },
              ],
            },
          },
          // "valueDataBindings": {
          //     "value": {
          //         "relationshipValue": {
          //             "targetEntityId": id,
          //             "targetComponentName": 'tagnode_component_0_databinding'
          //         }
          //     }
          // }
        },
      },
      tagnode: {
        componentTypeId: 'com.example.3d.node',
        propertyUpdates: {
          components: {
            value: {
              listValue: [
                {
                  relationshipValue: {
                    targetEntityId: id,
                    targetComponentName: 'tagnode_component_0',
                  },
                },
                {
                  relationshipValue: {
                    targetEntityId: id,
                    targetComponentName: 'tagnode_component_1',
                  },
                },
              ],
            },
          },
          name: {
            value: { stringValue: node['name'] },
          },
          transform: {
            value: {
              relationshipValue: {
                targetEntityId: id,
                targetComponentName: 'tagnode_transform',
              },
            },
          },
        },
      },
    },
  });
  tmClient?.send(transformComp);
  // addSceneNode(node);
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
