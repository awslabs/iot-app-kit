import { SpaceBetween } from '@awsui/components-react';
import React, { useCallback, useContext } from 'react';
import { UpdateEntityCommand } from '@aws-sdk/client-iottwinmaker';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { useStore } from '../../../store';
import { IEntityBindingComponentInternal, IModelRefComponentInternal } from '../../../store/internalInterfaces';
import { IComponentEditorProps } from '../ComponentEditor';

import { ComponentWithDataBindings, DataBindingMapEditor } from './common/DataBindingMapEditor';
import { getGlobalSettings } from '../../../common/GlobalSettings';
import { findComponentByType } from '../../../utils/nodeUtils';
import { KnownComponentType } from '../../../interfaces';

export interface IEntityBindingComponentEditorProps extends IComponentEditorProps {
  component: IEntityBindingComponentInternal;
}

export const EntityBindingComponentEditor: React.FC<IEntityBindingComponentEditorProps> = ({
  node,
  component,
}: IEntityBindingComponentEditorProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const removeComponent = useStore(sceneComposerId)((state) => state.removeComponent);
  const valueDataBindingProvider = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );

  const onUpdateCallback = useCallback(
    (componentPartial: Partial<ComponentWithDataBindings>, replace?: boolean) => {
      // When the data binding component has valueDataBindings left, update the component, otherwise remove
      // the whole component instead
      if (componentPartial.valueDataBindings && componentPartial.valueDataBindings.length > 0) {
        const valueDataBinding = componentPartial.valueDataBindings[0];
        const componentPartialWithRef = {
          ref: component.ref,
          type: component.type,
          valueDataBinding: valueDataBinding.valueDataBinding,
        };

        const modelref = findComponentByType(getSceneNodeByRef(selectedSceneNodeRef!), KnownComponentType.ModelRef) as IModelRefComponentInternal
        // TODO: support different component types
        const updateComponent: UpdateEntityCommand = new UpdateEntityCommand({
          workspaceId: getGlobalSettings().wsId,
          entityId: valueDataBinding.valueDataBinding?.dataBindingContext?.entityId,
          parentEntityUpdate: getSceneNodeByRef(selectedSceneNodeRef!)?.parentRef ? {
            updateType: 'UPDATE',
            parentEntityId: getSceneNodeByRef(selectedSceneNodeRef!)?.parentRef
          } : undefined,
          componentUpdates: {
            "node": {
              componentTypeId: 'example.scene.node',
              propertyUpdates: {
                "Components": {
                  "definition": {
                    "dataType": {
                      "type": "RELATIONSHIP"
                    },
                    "isTimeSeries": false,
                    "isRequiredInEntity": false,
                    "isExternalId": false,
                    "isStoredExternally": false,
                  },
                  "value": {
                    "relationshipValue": {
                      "targetEntityId": valueDataBinding.valueDataBinding?.dataBindingContext?.entityId,
                      "targetComponentName": "GLTF"
                    }
                  }
                },
                "Transform": {
                  "definition": {
                    "dataType": {
                      "type": "MAP",
                      "nestedType": {
                        "type": "STRING"
                      }
                    },
                    "isTimeSeries": false,
                    "isRequiredInEntity": false,
                    "isExternalId": false,
                    "isStoredExternally": false,
                  },
                  "value": {
                    "mapValue": {
                      "position": {
                        "stringValue": JSON.stringify(getSceneNodeByRef(selectedSceneNodeRef!)?.transform.position)
                      },
                      "rotation": {
                        "stringValue": JSON.stringify(getSceneNodeByRef(selectedSceneNodeRef!)?.transform.rotation)
                      },
                      "scale": {
                        "stringValue": JSON.stringify(getSceneNodeByRef(selectedSceneNodeRef!)?.transform.scale)
                      },
                    }
                  }
                }              
              }
            },
            "GLTF": {
              componentTypeId: 'example.scene.comp',
              propertyUpdates: {
                type: {
                  "definition": {
                    "dataType": {
                      "type": "STRING"
                    },
                    "isTimeSeries": false,
                    "isRequiredInEntity": false,
                    "isExternalId": false,
                    "isStoredExternally": false,
                  },
                  "value": {
                    "stringValue": modelref.type
                  }              
                },
                modelType: {
                  "definition": {
                    "dataType": {
                      "type": "STRING"
                    },
                    "isTimeSeries": false,
                    "isRequiredInEntity": false,
                    "isExternalId": false,
                    "isStoredExternally": false,
                  },
                  "value": {
                    "stringValue": modelref.modelType
                  }
                },
                uri: {
                  "definition": {
                    "dataType": {
                      "type": "STRING"
                    },
                    "isTimeSeries": false,
                    "isRequiredInEntity": false,
                    "isExternalId": false,
                    "isStoredExternally": false,
                  },
                  "value": {
                    "stringValue": modelref.uri
                  }
                }
              }
            }
          }
        })
        getGlobalSettings().tmClient?.send(updateComponent).then((res) => {
          updateComponentInternal(node.ref, componentPartialWithRef, replace);
        })
      } else {
        removeComponent(node.ref, component.ref);
      }
    },
    [node.ref, component.ref],
  );

  const compWithDb: ComponentWithDataBindings = {
    ref: component.ref,
    type: component.type,
    valueDataBindings: [{ valueDataBinding: component.valueDataBinding }],
  };

  return (
    <SpaceBetween size='s'>
      <DataBindingMapEditor
        allowPartialBinding
        skipFirstDivider
        hasBindingName={false}
        numFields={1}
        hasRemoveButton={false}
        valueDataBindingProvider={valueDataBindingProvider}
        component={compWithDb}
        onUpdateCallback={onUpdateCallback}
      />
    </SpaceBetween>
  );
};
