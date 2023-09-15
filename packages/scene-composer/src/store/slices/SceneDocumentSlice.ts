import { isDataBindingTemplate } from '@iot-app-kit/source-iottwinmaker';
import { isEmpty } from 'lodash';
import { GetState, SetState } from 'zustand';

import { IOverlaySettings, ISceneNode, KnownComponentType, KnownSceneProperty } from '../../interfaces';
import DebugLogger from '../../logger/DebugLogger';
import { Component } from '../../models/SceneModels';
import { containsMatchingEntityComponent } from '../../utils/dataBindingUtils';
import { mergeDeep } from '../../utils/objectUtils';
import { RecursivePartial } from '../../utils/typeUtils';
import { RootState } from '../Store';
import {
  addComponentToComponentNodeMap,
  addNodeToComponentNodeMap,
  deleteComponentFromComponentNodeMap,
} from '../helpers/componentMapHelpers';
import editorStateHelpers from '../helpers/editorStateHelpers';
import interfaceHelpers from '../helpers/interfaceHelpers';
import { removeNode, renderSceneNodesFromLayers } from '../helpers/sceneDocumentHelpers';
import serializationHelpers, { IDeserializeOptions } from '../helpers/serializationHelpers';
import { updateEntity } from '../helpers/updateEntityHelper';
import {
  IDataBoundSceneComponentInternal,
  IRuleBasedMapInternal,
  ISceneComponentInternal,
  ISceneDocumentInternal,
  ISceneNodeInternal,
  ISerializationErrorDetails,
} from '../internalInterfaces';
import { ComponentUpdateType } from '@aws-sdk/client-iottwinmaker';

const LOG = new DebugLogger('stateStore');

export interface ISceneDocumentSlice {
  /* Scene Document */
  document: ISceneDocumentInternal;
  sceneLoaded?: boolean;

  /* Internal Data Model APIs */
  getSceneNodeByRef(ref?: string): Readonly<ISceneNodeInternal> | undefined;
  getSceneNodesByRefs(refs: (string | undefined)[]): (ISceneNodeInternal | undefined)[];
  appendSceneNodeInternal(node: ISceneNodeInternal, parentRef?: string): void;

  renderSceneNodesFromLayers(nodes: ISceneNodeInternal[], layerId: string): void;

  updateSceneNodeInternal(ref: string, partial: RecursivePartial<ISceneNodeInternal>, isTransient?: boolean): void;
  updateDocumentInternal(partial: RecursivePartial<Pick<ISceneDocumentInternal, 'unit'>>): void;
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
  loadScene(sceneContent: string, options?: IDeserializeOptions): void;
  appendSceneNode(node: ISceneNode, parentRef?: string): Readonly<ISceneNode>;
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

export const createSceneDocumentSlice = (set: SetState<RootState>, get: GetState<RootState>): ISceneDocumentSlice =>
  ({
    document: createEmptyDocumentState(),

    loadScene: (sceneContent, options) => {
      get().resetEditorState();

      let errors: ISerializationErrorDetails[] | undefined;

      set((draft) => {
        const result = serializationHelpers.document.deserialize(sceneContent, options);

        errors = result.errors;

        if (result.document) {
          draft.document = result.document;
        } else {
          // fallback to the empty state
          draft.document = createEmptyDocumentState();
        }

        // Initialize view option values based on settings from the scene document
        const overlaySettings: IOverlaySettings | undefined =
          result.document?.properties?.[KnownSceneProperty.ComponentSettings]?.[KnownComponentType.DataOverlay];
        if (overlaySettings) {
          draft.noHistoryStates.componentVisibilities[Component.DataOverlaySubType.OverlayPanel] =
            overlaySettings.overlayPanelVisible;
        }

        draft.sceneLoaded = true;
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

    appendSceneNodeInternal: (node) => {
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
        draft.document!.nodeMap[node.ref] = node;

        // Update the parent node of the inserted node
        if (!node.parentRef) {
          draft.document!.rootNodeRefs.push(node.ref);
        } else {
          draft.document!.nodeMap[node.parentRef]!.childRefs.push(node.ref);
        }

        // Update componentNodeMap
        addNodeToComponentNodeMap(draft.document.componentNodeMap, node);

        // Update the selected node
        draft.selectedSceneNodeRef = node.ref;

        draft.lastOperation = 'appendSceneNodeInternal';
      });
    },

    renderSceneNodesFromLayers: (nodes, layerId) => {
      set((draft) => {
        const document = draft.document;
        if (!document) {
          return;
        }

        renderSceneNodesFromLayers(nodes, layerId, document, LOG);

        draft.lastOperation = 'renderSceneNodesFromLayers';
      });
    },

    updateSceneNodeInternal: (ref, partial, isTransient) => {
      const document = get().document;

      set((draft) => {
        // update target node
        mergeDeep(draft.document.nodeMap[ref], partial);

        // Reorder logics
        if ('parentRef' in partial) {
          const nodeToMove = document.nodeMap[ref];

          const oldParentRef = nodeToMove?.parentRef;
          const oldParent = document.nodeMap[oldParentRef || ''];

          const newParentRef = partial.parentRef;

          // remove target node from old parent
          if (!oldParentRef) {
            draft.document.rootNodeRefs = document.rootNodeRefs.filter((root) => root !== ref);
          } else {
            draft.document.nodeMap[oldParentRef].childRefs = oldParent.childRefs.filter((child) => child !== ref);
          }

          // update new parent to have target node as child
          if (!newParentRef) {
            draft.document.rootNodeRefs.push(ref);
          } else {
            draft.document.nodeMap[newParentRef].childRefs.push(ref);
          }
        }

        draft.lastOperation = isTransient ? 'updateSceneNodeInternalTransient' : 'updateSceneNodeInternal';
      });
    },

    updateDocumentInternal: (partial) => {
      set((draft) => {
        mergeDeep(draft.document, partial);

        draft.lastOperation = 'updateDocumentInternal';
      });
    },

    appendSceneNode: (node) => {
      if (node.childRefs && node.childRefs.length > 0) {
        throw new Error('Error: node with children are not supported by append operation');
      }
      const newNode = interfaceHelpers.createSceneNodeInternal(node);
      get().appendSceneNodeInternal(newNode);
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
      const layerId = get().getSceneProperty<string[]>(KnownSceneProperty.LayerIds)?.at(0);
      if (component && layerId) {
         updateEntity(node, component);
      }
        addComponentToComponentNodeMap(draft.document.componentNodeMap[component.type]!, nodeRef, component.ref);
        
        draft.lastOperation = 'addComponentInternal';
      });
    },

    updateComponentInternal: (nodeRef, component, replace = false) => {
      if (!component.ref) {
        throw new Error('Error: missing component ref');
      }
      const node = get().getSceneNodeByRef(nodeRef);

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
        draft.lastOperation = 'updateComponentInternal';
      });
      const updatedComponenet = get().document?.nodeMap[nodeRef]?.components[componentToUpdateIndex];
            console.log({component}, {updatedComponenet})

      const layerId = get().getSceneProperty<string[]>(KnownSceneProperty.LayerIds)?.at(0);
      if (updatedComponenet && layerId) {
         updateEntity(node, updatedComponenet);
      }
    },

    removeComponent: (nodeRef, componentRef) => {
      const node = get().getSceneNodeByRef(nodeRef);
      if (!node) return;

      const componentIndex = node.components.findIndex((c) => c.ref === componentRef);
      if (componentIndex === -1) return;

      const updatedComponenet = get().document?.nodeMap[nodeRef]?.components[componentIndex];
      const layerId = get().getSceneProperty<string[]>(KnownSceneProperty.LayerIds)?.at(0);
      if (updatedComponenet && layerId) {
         updateEntity(node,updatedComponenet, ComponentUpdateType.DELETE);
      }

      set((draft) => {
        deleteComponentFromComponentNodeMap(
          draft.document.componentNodeMap[node.components[componentIndex].type],
          nodeRef,
          componentRef,
        );

        draft.document.nodeMap[nodeRef].components.splice(componentIndex, 1);
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
