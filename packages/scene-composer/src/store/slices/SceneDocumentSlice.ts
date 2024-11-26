import { ComponentUpdateType } from '@aws-sdk/client-iottwinmaker';
import { isDataBindingTemplate } from '@iot-app-kit/source-iottwinmaker';
import { cloneDeep, isEmpty, isString } from 'lodash';
import type { PartialDeep } from 'type-fest';
import { type StoreApi } from 'zustand';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { RESERVED_LAYER_ID } from '../../common/entityModelConstants';
import {
  COMPOSER_FEATURES,
  type IOverlaySettings,
  type ISceneNode,
  KnownComponentType,
  KnownSceneProperty,
} from '../../interfaces';
import DebugLogger from '../../logger/DebugLogger';
import { Component } from '../../models/SceneModels';
import { containsMatchingEntityComponent } from '../../utils/dataBindingUtils';
import { createNodeEntity } from '../../utils/entityModelUtils/createNodeEntity';
import { deleteNodeEntity } from '../../utils/entityModelUtils/deleteNodeEntity';
import { isDynamicNode, isDynamicScene } from '../../utils/entityModelUtils/sceneUtils';
import { updateEntity } from '../../utils/entityModelUtils/updateNodeEntity';
import { mergeDeep } from '../../utils/objectUtils';
import { type RootState } from '../Store';
import { addComponentToComponentNodeMap, deleteComponentFromComponentNodeMap } from '../helpers/componentMapHelpers';
import editorStateHelpers from '../helpers/editorStateHelpers';
import interfaceHelpers from '../helpers/interfaceHelpers';
import { appendSceneNode, removeNode, renderSceneNodes, updateSceneNode } from '../helpers/sceneDocumentHelpers';
import serializationHelpers, { type IDeserializeOptions } from '../helpers/serializationHelpers';
import {
  DisplayMessageCategory,
  type IDataBoundSceneComponentInternal,
  type IRuleBasedMapInternal,
  type ISceneComponentInternal,
  type ISceneDocumentInternal,
  type ISceneNodeInternal,
  type ISerializationErrorDetails,
  SceneNodeRuntimeProperty,
} from '../internalInterfaces';

const LOG = new DebugLogger('stateStore');

export interface ISceneDocumentSlice {
  /* Scene Document */
  document: ISceneDocumentInternal;
  sceneLoaded?: boolean;

  /* Internal Data Model APIs */
  getSceneNodeByRef(ref?: string): Readonly<ISceneNodeInternal> | undefined;
  getSceneNodesByRefs(refs: (string | undefined)[]): (ISceneNodeInternal | undefined)[];
  appendSceneNodeInternal(node: ISceneNodeInternal, disableAutoSelect?: boolean): void;

  renderSceneNodes(nodes: ISceneNodeInternal[]): void;

  updateSceneNodeInternal(
    ref: string,
    partial: PartialDeep<ISceneNodeInternal>,
    isTransient?: boolean,
    skipEntityUpdate?: boolean,
  ): void;
  updateSceneNodeInternalBatch(
    nodesMap: Record<string, PartialDeep<ISceneNodeInternal>>,
    isTransient?: boolean,
    skipEntityUpdate?: boolean,
  ): void;

  updateDocumentInternal(partial: PartialDeep<Pick<ISceneDocumentInternal, 'unit'>>): void;
  listSceneRuleMapIds(): string[];
  getSceneRuleMapById(id?: string): Readonly<IRuleBasedMapInternal> | undefined;
  updateSceneRuleMapById(id: string, ruleMap: IRuleBasedMapInternal): void;
  removeSceneRuleMapById(id: string): void;
  addComponentInternal(nodeRef: string, component: ISceneComponentInternal): void;
  updateComponentInternal(nodeRef: string, component: ISceneComponentInternal, replace?: boolean): void;
  getSceneProperty<T>(property: KnownSceneProperty, defaultValue?: T): T | undefined;
  setSceneProperty<T>(property: KnownSceneProperty, value: T): void;
  getComponentRefByType(type: KnownComponentType): Record<string, string[]>;

  /* External Data Model APIs */
  loadScene(sceneContent: string | ISceneDocumentInternal, options?: IDeserializeOptions): void;
  appendSceneNode(node: ISceneNode, disableAutoSelect?: boolean): Readonly<ISceneNode>;
  removeSceneNode(nodeRef: string): Readonly<ISceneNode> | undefined;
  updateSceneNode(ref: string, partial: Pick<ISceneNode, 'name' | 'parentRef' | 'transform' | 'childRefs'>): void;
  removeComponent(nodeRef: string, componentRef: string): void;

  /* Store APIs */
  findSceneNodeRefBy(dataBindingContext: unknown, componentTypeFilter?: KnownComponentType[]): string[];
}

function createEmptyDocumentState(): ISceneDocumentInternal {
  return {
    nodeMap: {},
    ruleMap: {},
    rootNodeRefs: [],
    componentNodeMap: {},
    unit: 'meter',
    version: '1',
    specVersion: undefined,
    properties: {},
  };
}

export const createSceneDocumentSlice = (
  set: (cb: (draft: RootState) => void) => void,
  get: StoreApi<RootState>['getState'],
): ISceneDocumentSlice =>
  ({
    document: createEmptyDocumentState(),

    loadScene: (sceneContent, options) => {
      get().resetEditorState();

      let errors: ISerializationErrorDetails[] | undefined;

      set((draft) => {
        let document: ISceneDocumentInternal | undefined;
        if (isString(sceneContent)) {
          const result = serializationHelpers.document.deserialize(sceneContent, options);
          errors = result.errors;
          document = result.document;
        } else {
          document = sceneContent;
        }

        if (document) {
          draft.document = document;
        } else {
          // fallback to the empty state
          draft.document = createEmptyDocumentState();
        }

        // Initialize view option values based on settings from the scene document
        const overlaySettings: IOverlaySettings | undefined =
          document?.properties?.[KnownSceneProperty.ComponentSettings]?.[KnownComponentType.DataOverlay];
        if (overlaySettings) {
          draft.noHistoryStates.componentVisibilities[Component.DataOverlaySubType.OverlayPanel] =
            overlaySettings.overlayPanelVisible;
        }

        const dynamicSceneEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.DynamicScene];

        if (!dynamicSceneEnabled || !isDynamicScene(document)) {
          draft.sceneLoaded = true;
        }
        draft.lastOperation = 'loadScene';
      });

      // We cannot nest set operations in the store impl, so we'll need to delay
      // setting error messages here.
      if (errors && !isEmpty(errors)) {
        get().addMessages(errors.map(editorStateHelpers.convertErrorToDisplayMessage));
      }
    },

    getSceneNodeByRef: (ref?) => {
      if (!ref) return undefined;
      return get().document?.nodeMap[ref];
    },

    getSceneNodesByRefs: (refs) => {
      return refs.map((ref) => get().getSceneNodeByRef(ref));
    },

    appendSceneNodeInternal: (node, disableAutoSelect) => {
      const document = get().document;

      if (!document) {
        return;
      }
      // check if node already exists
      if (document.nodeMap[node.ref]) {
        LOG.warn('adding an exising node has no effect.');
        return;
      }

      // check if parent is valid
      if (node.parentRef && !document.nodeMap[node.parentRef]) {
        LOG.warn('parent node does not exists.');
        return;
      }

      // Add the node to the state
      set((draft) => {
        const dynamicSceneEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.DynamicScene];

        // WJHH: Probably only occurs on node creation in a scene as the internal node model isn't being
        // set to dynamic until here
        if (dynamicSceneEnabled && isDynamicScene(draft.document) && !isDynamicNode(node)) {
          createNodeEntity(node, node.parentRef ?? draft.document.properties![KnownSceneProperty.SceneRootEntityId])
            .then(() => {
              // Add the node to the state after successful entity creation
              get().appendSceneNodeInternal(
                {
                  ...node,
                  properties: { ...node.properties, [SceneNodeRuntimeProperty.LayerIds]: [RESERVED_LAYER_ID] },
                },
                disableAutoSelect,
              );
            })
            .catch((e) => {
              get().addMessages([
                {
                  category: DisplayMessageCategory.Warning,
                  messageText: `Create entity for node ${node.name} failed with error: ${e.message}`,
                },
              ]);
            });
        } else {
          appendSceneNode(draft, node, disableAutoSelect);
        }
      });
    },

    renderSceneNodes: (nodes) => {
      set((draft) => {
        const document = draft.document;
        if (!document) {
          return;
        }

        renderSceneNodes(nodes, document, LOG);

        draft.sceneLoaded = true;
        draft.lastOperation = 'renderSceneNodes';
      });
    },

    updateSceneNodeInternal: (ref, partial, isTransient, skipEntityUpdate) => {
      set((draft) => {
        updateSceneNode(draft, ref, partial, skipEntityUpdate);

        draft.lastOperation = isTransient ? 'updateSceneNodeInternalTransient' : 'updateSceneNodeInternal';
      });
    },

    updateSceneNodeInternalBatch: (nodesMap, isTransient, skipEntityUpdate) => {
      set((draft) => {
        Object.keys(nodesMap).forEach((ref) => {
          const partial = nodesMap[ref];
          updateSceneNode(draft, ref, partial, skipEntityUpdate);
        });

        draft.lastOperation = isTransient ? 'updateSceneNodeInternalBatchTransient' : 'updateSceneNodeInternalBatch';
      });
    },

    updateDocumentInternal: (partial) => {
      set((draft) => {
        mergeDeep(draft.document, partial);

        draft.lastOperation = 'updateDocumentInternal';
      });
    },

    appendSceneNode: (node, disableAutoSelect) => {
      if (node.childRefs && node.childRefs.length > 0) {
        throw new Error('Error: node with children are not supported by append operation');
      }
      const newNode = interfaceHelpers.createSceneNodeInternal(node);
      get().appendSceneNodeInternal(newNode, disableAutoSelect);
      return newNode;
    },

    updateSceneNode: (ref, partial) => {
      get().updateSceneNodeInternal(ref, partial);
    },

    removeSceneNode: (nodeRef) => {
      const state = get();
      const document = state.document;

      if (!document.nodeMap[nodeRef]) {
        // TODO: This usually means a bug, we'll throw for now.
        throw new Error('Error: Invalid internal state, the node to be removed does not exist in the node map');
      }

      let nodeToRemove!: ISceneNodeInternal;

      set((draft) => {
        // deselect the selected node if it is the one that is being removed.
        if (state.selectedSceneNodeRef === nodeRef) {
          draft.selectedSceneNodeRef = undefined;
        }

        nodeToRemove = removeNode(draft.document, nodeRef, LOG);

        if (isDynamicNode(nodeToRemove)) {
          deleteNodeEntity(nodeRef)?.then(() => {
            // TODO: localize strings
            getGlobalSettings().onFlashMessage?.({
              type: 'success',
              header: `Successfully deleted ${nodeToRemove.name}.`,
            });
          });
        }

        draft.lastOperation = 'removeSceneNode';
      });

      return nodeToRemove;
    },

    listSceneRuleMapIds: () => {
      return Object.keys(get().document.ruleMap);
    },

    getSceneRuleMapById: (id) => {
      if (id === undefined) {
        return undefined;
      }
      return get().document.ruleMap[id];
    },

    updateSceneRuleMapById: (id, ruleMap) => {
      set((draft) => {
        draft.document.ruleMap[id] = ruleMap;

        draft.lastOperation = 'updateSceneRuleMapById';
      });
    },

    removeSceneRuleMapById: (id: string) => {
      set((draft) => {
        delete draft.document.ruleMap[id];

        draft.lastOperation = 'removeSceneRuleMapById';
      });
    },

    addComponentInternal: (nodeRef, component) => {
      const node = get().getSceneNodeByRef(nodeRef);
      if (!node) return;

      set((draft) => {
        draft.document.nodeMap[nodeRef].components.push(component);

        // Update componentNodeMap
        if (!draft.document.componentNodeMap[component.type]) {
          draft.document.componentNodeMap[component.type] = {};
        }
        addComponentToComponentNodeMap(draft.document.componentNodeMap[component.type]!, nodeRef, component.ref);

        if (isDynamicNode(node)) {
          updateEntity(node, [component]);
        }

        draft.lastOperation = 'addComponentInternal';
      });
    },

    updateComponentInternal: (nodeRef, component, replace = false) => {
      if (!component.ref) {
        throw new Error('Error: missing component ref');
      }
      const node = cloneDeep(get().getSceneNodeByRef(nodeRef));

      if (!node) {
        throw new Error('Error: invalid nodeRef ' + nodeRef);
      }

      const componentToUpdateIndex = node.components.findIndex((c) => c.ref === component.ref);
      if (componentToUpdateIndex === -1) {
        throw new Error('Error: unable to find the component ' + component.ref);
      }

      set((draft) => {
        if (!replace) {
          mergeDeep(draft.document.nodeMap[nodeRef].components[componentToUpdateIndex], component);
        } else {
          draft.document.nodeMap[nodeRef].components[componentToUpdateIndex] = component;
        }

        const updatedNode = draft.document.nodeMap[nodeRef];
        const updatedComponenet = updatedNode?.components[componentToUpdateIndex];

        if (updatedComponenet && isDynamicNode(updatedNode)) {
          updateEntity(updatedNode, [updatedComponenet], ComponentUpdateType.UPDATE, node);
        }

        draft.lastOperation = 'updateComponentInternal';
      });
    },

    removeComponent: (nodeRef, componentRef) => {
      const node = cloneDeep(get().getSceneNodeByRef(nodeRef));
      if (!node) return;

      const componentIndex = node.components.findIndex((c) => c.ref === componentRef);
      if (componentIndex === -1) return;

      set((draft) => {
        deleteComponentFromComponentNodeMap(
          draft.document.componentNodeMap[node.components[componentIndex].type],
          nodeRef,
          componentRef,
        );

        const removedComponenet = draft.document.nodeMap[nodeRef].components.splice(componentIndex, 1).at(0);

        if (removedComponenet && isDynamicNode(draft.document.nodeMap[nodeRef])) {
          updateEntity(draft.document.nodeMap[nodeRef], [removedComponenet], ComponentUpdateType.DELETE, node).then(
            () => {
              // TODO: localize strings
              getGlobalSettings().onFlashMessage?.({
                type: 'success',
                header: `Successfully deleted ${removedComponenet.type} component from ${node.name}.`,
              });
            },
          );
        }

        draft.lastOperation = 'removeComponent';
      });
    },

    getSceneProperty: (property, defaultValue?) => {
      const document = get().document;
      if (document.properties && property in document.properties) {
        return document.properties[property];
      }
      return defaultValue;
    },

    setSceneProperty: (property, value) => {
      set((draft) => {
        if (!draft.document.properties) {
          draft.document.properties = {};
        }
        draft.document.properties[property] = value;

        // TODO: better logic to only reset the binding when needed, like adding instead of changing the
        // sel_comp template doesn't need to reset.
        if (property === KnownSceneProperty.DataBindingConfig) {
          Object.values(draft.document.nodeMap)
            .flatMap((node) => node.components)
            .forEach((component) => {
              let valueDataBindings: Component.IDataBindingMap[] = [];
              if ('valueDataBinding' in component) {
                valueDataBindings = [component as Component.IDataBindingMap];
              } else if ('valueDataBindings' in component) {
                valueDataBindings = Object.values(
                  component.valueDataBindings as
                    | { [s: string]: Component.IDataBindingMap }
                    | ArrayLike<Component.IDataBindingMap>,
                );
              }

              valueDataBindings.forEach((binding: Component.IDataBindingMap) => {
                const hasDataBindingTemplate = Object.values(binding.valueDataBinding?.dataBindingContext ?? {}).find(
                  (value) => isDataBindingTemplate(value as string),
                );
                if (hasDataBindingTemplate && binding.valueDataBinding) {
                  binding.valueDataBinding.dataBindingContext = undefined;
                }
              });
            });
        }

        draft.lastOperation = 'setSceneProperty';
      });
    },

    getComponentRefByType: (type: KnownComponentType): Record<string, string[]> => {
      return get().document.componentNodeMap[type] || {};
    },

    // TODO: add find MotionIndicator node by data label support
    findSceneNodeRefBy: (
      dataLabels: unknown,
      componentTypeFilter: KnownComponentType[] = [KnownComponentType.Tag, KnownComponentType.ModelShader],
    ) => {
      const document = get().document;
      return Object.values(document.nodeMap)
        .filter((node) => {
          return node.components.find((component) => {
            if (componentTypeFilter.includes(component.type as KnownComponentType)) {
              const dataBoundComponent = component as IDataBoundSceneComponentInternal;
              const boundContext = dataBoundComponent?.valueDataBinding?.dataBindingContext;
              return containsMatchingEntityComponent(dataLabels, boundContext);
            } else {
              return false;
            }
          });
        })
        .map((node) => node.ref);
    },
  } as ISceneDocumentSlice);
