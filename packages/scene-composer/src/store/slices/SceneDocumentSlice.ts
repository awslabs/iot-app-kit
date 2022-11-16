import { GetState, SetState, StoreApi } from 'zustand';

import DebugLogger from '../../logger/DebugLogger';
import { RecursivePartial } from '../../utils/typeUtils';
import { mergeDeep } from '../../utils/objectUtils';
import { containsMatchingEntityComponent } from '../../utils/dataBindingUtils';
import { isDataBindingTemplate } from '../../utils/dataBindingTemplateUtils';
import { RootState } from '../Store';
import serializationHelpers, { IDeserializeOptions } from '../helpers/serializationHelpers';
import {
  addComponentToComponentNodeMap,
  addNodeToComponentNodeMap,
  deleteComponentFromComponentNodeMap,
  deleteNodeFromComponentNodeMap,
} from '../helpers/componentMapHelpers';
import {
  ISceneNodeInternal,
  ISceneComponentInternal,
  ISceneDocumentInternal,
  IRuleBasedMapInternal,
  IDataBoundSceneComponentInternal,
  ISerializationErrorDetails,
} from '../internalInterfaces';
import interfaceHelpers from '../helpers/interfaceHelpers';
import editorStateHelpers from '../helpers/editorStateHelpers';
import { ISceneNode, KnownComponentType, KnownSceneProperty } from '../../interfaces';

const LOG = new DebugLogger('stateStore');

export interface ISceneDocumentSlice {
  /* Scene Document */
  document: ISceneDocumentInternal;
  sceneLoaded?: boolean;

  /* Internal Data Model APIs */
  getSceneNodeByRef(ref?: string): Readonly<ISceneNodeInternal> | undefined;
  getSceneNodesByRefs(refs: (string | undefined)[]): (ISceneNodeInternal | undefined)[];
  appendSceneNodeInternal(node: ISceneNodeInternal, parentRef?: string): void;
  updateSceneNodeInternal(ref: string, partial: RecursivePartial<ISceneNodeInternal>, isTransient?: boolean): void;
  updateDocumentInternal(partial: RecursivePartial<Pick<ISceneDocumentInternal, 'unit' | 'rootNodeRefs'>>): void;
  listSceneRuleMapIds(): string[];
  getSceneRuleMapById(id?: string): Readonly<IRuleBasedMapInternal> | undefined;
  updateSceneRuleMapById(id: string, ruleMap: IRuleBasedMapInternal): void;
  removeSceneRuleMapById(id: string): void;
  addComponentInternal(nodeRef: string, component: ISceneComponentInternal): void;
  updateComponentInternal(nodeRef: string, component: ISceneComponentInternal, replace?: boolean): void;
  getSceneProperty(property: KnownSceneProperty, defaultValue?: any): any;
  setSceneProperty(property: KnownSceneProperty, value: any): void;
  clearTemplatizedDataBindings(): void;
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

export const createSceneDocumentSlice = (
  set: SetState<RootState>,
  get: GetState<RootState>,
  api: StoreApi<RootState>,
) =>
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

        draft.sceneLoaded = true;
        draft.lastOperation = 'loadScene';
      });

      // We cannot nest set operations in the store impl, so we'll need to delay
      // setting error messages here.
      if (errors) {
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

    updateSceneNodeInternal: (ref, partial, isTransient) => {
      set((draft) => {
        mergeDeep(draft.document.nodeMap[ref], partial);
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

        nodeToRemove = document.nodeMap[nodeRef]!;
        const subTreeNodeRefs: string[] = [nodeRef];
        const findSubTreeNodes = (node: ISceneNodeInternal, accumulator: string[]) => {
          node.childRefs.forEach((childRef) => {
            accumulator.push(childRef);
            const childNode = document.nodeMap[childRef];
            if (!childNode) {
              LOG.warn('unable to find the child node by ref', childRef);
            } else {
              findSubTreeNodes(childNode, accumulator);
            }
          });
        };
        findSubTreeNodes(nodeToRemove, subTreeNodeRefs);

        LOG.verbose('removing the following nodes', subTreeNodeRefs);

        // remove the nodes from nodemap
        subTreeNodeRefs.forEach((current) => {
          deleteNodeFromComponentNodeMap(draft.document.componentNodeMap, draft.document!.nodeMap[current]);
          delete draft.document!.nodeMap[current];
        });

        // remove from componentNodeMap
        deleteNodeFromComponentNodeMap(draft.document.componentNodeMap, nodeToRemove);

        // remove the node from root node array if it is a root node
        if (!nodeToRemove.parentRef) {
          const rootIndex = document.rootNodeRefs.findIndex((v) => v === nodeRef);
          if (rootIndex !== -1) {
            draft.document!.rootNodeRefs.splice(rootIndex, 1);
          }
        } else {
          // remove the node from parent
          const indexOfNodeInParent = document.nodeMap[nodeToRemove.parentRef]!.childRefs.findIndex(
            (ref) => ref === nodeToRemove.ref,
          );
          draft.document!.nodeMap[nodeToRemove.parentRef]?.childRefs.splice(indexOfNodeInParent, 1);
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
    },

    removeComponent: (nodeRef, componentRef) => {
      const node = get().getSceneNodeByRef(nodeRef);
      if (!node) return;

      const componentIndex = node.components.findIndex((c) => c.ref === componentRef);
      if (componentIndex === -1) return;

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
        draft.lastOperation = 'setSceneProperty';
      });
    },

    clearTemplatizedDataBindings: () => {
      set((draft) => {
        Object.values(draft.document.nodeMap)
          .flatMap((node) => node.components)
          .filter(
            (component) =>
              component.type === KnownComponentType.Tag || component.type === KnownComponentType.ModelShader,
          )
          .forEach((component) => {
            const dataBindingContext = (component as IDataBoundSceneComponentInternal)?.valueDataBinding;
            const hasDataBindingTemplate =
              Object.values((dataBindingContext?.dataBindingContext as any) ?? {}).filter((value) =>
                isDataBindingTemplate(value as string),
              ).length > 0;
            if (hasDataBindingTemplate) {
              dataBindingContext!.dataBindingContext = {};
            }
          });

        draft.lastOperation = 'clearTemplatizedDataBindings';
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
