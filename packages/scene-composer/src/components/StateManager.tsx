import { DataStream, ProviderWithViewport, TimeSeriesData, combineProviders } from '@iot-app-kit/core';
import { ThreeEvent } from '@react-three/fiber';
import ab2str from 'arraybuffer-to-string';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { ExecuteQueryCommand, Row } from '@aws-sdk/client-iottwinmaker'; // ES Modules import

import {
  getGlobalSettings,
  setDracoDecoder,
  setFeatureConfig,
  setGetSceneObjectFunction,
  setLocale,
  setMetricRecorder,
  setTwinMakerSceneMetadataModule,
} from '../common/GlobalSettings';
import {
  MATTERPORT_ACCESS_TOKEN,
  MATTERPORT_APPLICATION_KEY,
  MATTERPORT_ERROR,
  MATTERPORT_SECRET_ARN,
} from '../common/constants';
import { DisplayMessageCategory, ISceneComponentInternal } from '../store/internalInterfaces';
import { useSceneComposerId } from '../common/sceneComposerIdContext';
import useActiveCamera from '../hooks/useActiveCamera';
import useMatterportViewer from '../hooks/useMatterportViewer';
import {
  AdditionalComponentData,
  ExternalLibraryConfig,
  IEntityBindingComponent,
  ISceneNode,
  KnownComponentType,
  KnownSceneProperty,
  SceneComposerInternalProps,
} from '../interfaces';
import { SceneLayout } from '../layouts/SceneLayout';
import useLifecycleLogging from '../logger/react-logger/hooks/useLifecycleLogging';
import {
  IAnchorComponentInternal,
  ICameraComponentInternal,
  IEntityBindingComponentInternal,
  RootState,
  useStore,
  useViewOptionState,
} from '../store';
import { getCameraSettings } from '../utils/cameraUtils';
import { applyDataBindingTemplate } from '../utils/dataBindingTemplateUtils';
import { combineTimeSeriesData, convertDataStreamsToDataInput } from '../utils/dataStreamUtils';
import { findComponentByType } from '../utils/nodeUtils';
import sceneDocumentSnapshotCreator from '../utils/sceneDocumentSnapshotCreator';
import { createStandardUriModifier } from '../utils/uriModifiers';
import { generateUUID } from '../utils/mathUtils';

import IntlProvider from './IntlProvider';
import { LoadingProgress } from './three-fiber/LoadingProgress';

const StateManager: React.FC<SceneComposerInternalProps> = ({
  sceneLoader,
  sceneMetadataModule,
  config,
  onSceneUpdated,
  onSceneLoaded,
  valueDataBindingProviders,
  showAssetBrowserCallback,
  onWidgetClick,
  onSelectionChanged,
  dataStreams,
  queries,
  viewport,
  dataBindingTemplate,
  externalLibraryConfig,
  activeCamera,
  selectedDataBinding,
  query,
}: SceneComposerInternalProps) => {
  useLifecycleLogging('StateManager');
  const sceneComposerId = useSceneComposerId();

  const {
    setEditorConfig,
    setDataInput,
    setDataBindingTemplate,
    loadScene,
    appendSceneNodeBatch,
    document,
    sceneLoaded,
    selectedSceneNodeRef,
    setSelectedSceneNodeRef,
    getSceneNodeByRef,
    getObject3DBySceneNodeRef,
    addMessages,
  } = useStore(sceneComposerId)((state) => state);
  const [sceneContentUri, setSceneContentUri] = useState<string>('');
  const [sceneContent, setSceneContent] = useState<string>('');
  const [loadSceneError, setLoadSceneError] = useState<Error | undefined>();
  const [queriedStreams, setQueriedStreams] = useState<DataStream[] | undefined>();
  const [updatedExternalLibraryConfig, setUpdatedExternalLibraryConfig] = useState<ExternalLibraryConfig | undefined>(
    externalLibraryConfig,
  );
  const baseUrl = useStore(sceneComposerId)((state) => state.getSceneProperty<string>(KnownSceneProperty.BaseUrl));
  const messages = useStore(sceneComposerId)((state) => state.getMessages());
  const matterportModelId = useStore(sceneComposerId)((state) =>
    state.getSceneProperty<string>(KnownSceneProperty.MatterportModelId),
  );
  const { connectionNameForMatterportViewer, setConnectionNameForMatterportViewer } =
    useViewOptionState(sceneComposerId);
  const { enableMatterportViewer } = useMatterportViewer();

  const dataProviderRef = useRef<ProviderWithViewport<TimeSeriesData[]> | undefined>(undefined);
  const prevSelection = useRef<string | undefined>(undefined);

  const { setActiveCameraSettings, setActiveCameraName } = useActiveCamera();

  const standardUriModifier = useMemo(
    () => createStandardUriModifier(sceneContentUri || '', baseUrl),
    [sceneContentUri, baseUrl],
  );

  // Set SceneComposerInternal configuration
  // Use layout effect to immediately re-render the SceneComposerInternal when editor config change.
  useLayoutEffect(() => {
    THREE.Cache.enabled = true;

    setEditorConfig({
      operationMode: config.mode,
      uriModifier: standardUriModifier,
      // Currently only support single data binding provider. Need to update this code to support multiple.
      valueDataBindingProvider: valueDataBindingProviders?.TwinMakerEntityProperty,
      showAssetBrowserCallback,
      onWidgetClick,
      onSelectionChanged,
    });
  }, [
    config.mode,
    standardUriModifier,
    valueDataBindingProviders,
    showAssetBrowserCallback,
    onWidgetClick,
    onSelectionChanged,
  ]);

  // Initialize ConnectionNameForMatterportViewer on scene loading
  useEffect(() => {
    if (sceneMetadataModule) {
      sceneMetadataModule.getSceneInfo().then((getSceneResponse) => {
        if (getSceneResponse && getSceneResponse.sceneMetadata) {
          setConnectionNameForMatterportViewer(getSceneResponse.sceneMetadata[MATTERPORT_SECRET_ARN]);
        }
      });
    }
  }, [sceneLoaded]);

  useEffect(() => {
    if (!selectedDataBinding) {
      setActiveCameraName(activeCamera);
    }
  }, [activeCamera, selectedDataBinding]);

  useEffect(() => {
    // This hook will somehow be triggered twice initially with selectedSceneNodeRef = undefined.
    // Compare prevSelection with selectedSceneNodeRef to make sure the event is sent only when value
    // is changed.
    if (prevSelection.current === selectedSceneNodeRef) return;

    prevSelection.current = selectedSceneNodeRef;
    if (onSelectionChanged) {
      const node = getSceneNodeByRef(selectedSceneNodeRef);
      const componentTypes = node?.components.map((component) => component.type) ?? [];

      const tagComponent = findComponentByType(node, KnownComponentType.Tag) as IAnchorComponentInternal;
      const entityBindingComponent = findComponentByType(
        node,
        KnownComponentType.EntityBinding,
      ) as IEntityBindingComponentInternal;
      const additionalComponentData: AdditionalComponentData[] = [];
      if (tagComponent) {
        additionalComponentData.push({
          chosenColor: tagComponent.chosenColor,
          navLink: tagComponent.navLink,
          dataBindingContext: !tagComponent.valueDataBinding?.dataBindingContext
            ? undefined
            : applyDataBindingTemplate(tagComponent.valueDataBinding, dataBindingTemplate),
        });
      }
      // Add entityID info part of additional component data
      // We assumed IDataBindingMap will have only one mapping as data binding
      // will always have only one entity data.
      if (entityBindingComponent) {
        additionalComponentData.push({
          dataBindingContext: !entityBindingComponent?.valueDataBinding?.dataBindingContext
            ? undefined
            : entityBindingComponent?.valueDataBinding.dataBindingContext,
        });
      }
      onSelectionChanged({
        componentTypes,
        nodeRef: selectedSceneNodeRef,
        additionalComponentData,
      });
    }
  }, [selectedSceneNodeRef]);

  useEffect(() => {
    const node = getSceneNodeByRef(selectedSceneNodeRef);
    const cameraComponent = findComponentByType(node, KnownComponentType.Camera) as ICameraComponentInternal;
    if (cameraComponent) {
      const object3D = getObject3DBySceneNodeRef(selectedSceneNodeRef);

      setActiveCameraSettings(getCameraSettings(object3D, cameraComponent));
    }
  }, [selectedSceneNodeRef]);

  useEffect(() => {
    if (config.dracoDecoder) {
      setDracoDecoder(config.dracoDecoder);
    }
  }, [config.dracoDecoder]);

  useEffect(() => {
    if (config.featureConfig) {
      setFeatureConfig(config.featureConfig);
    }
  }, [config]);

  useEffect(() => {
    if (config.metricRecorder) {
      setMetricRecorder(config.metricRecorder);
    }
  }, [config.metricRecorder]);

  useEffect(() => {
    if (config.locale) {
      setLocale(config.locale);
    }
  }, [config.locale]);

  useEffect(() => {
    setGetSceneObjectFunction(sceneLoader.getSceneObject);
  }, [sceneLoader]);

  useEffect(() => {
    if (sceneMetadataModule) {
      setTwinMakerSceneMetadataModule(sceneMetadataModule);
    }
  }, [sceneMetadataModule]);

  // get scene uri
  useEffect(() => {
    sceneLoader
      .getSceneUri()
      .then((uri) => {
        if (uri) {
          setSceneContentUri(uri);
        } else {
          throw new Error('Got empty scene url');
        }
      })
      .catch((error) => {
        setLoadSceneError(error || new Error('Failed to get scene uri'));
      });
  }, [sceneLoader]);

  useEffect(() => {
    if (sceneContentUri && sceneContentUri.length > 0) {
      const promise = sceneLoader.getSceneObject(sceneContentUri);
      if (!promise) {
        setLoadSceneError(new Error('Failed to fetch scene content'));
      } else {
        promise
          .then((arrayBuffer) => {
            return ab2str(arrayBuffer);
          })
          .then((sceneContent) => {
            setSceneContent(sceneContent);
          })
          .catch((error) => {
            setLoadSceneError(error || new Error('Failed to fetch scene content'));
          });
      }
    }
  }, [sceneContentUri]);

  useEffect(() => {
    if (sceneMetadataModule && enableMatterportViewer) {
      sceneMetadataModule
        .getSceneInfo()
        .then((sceneInfo) => {
          if (sceneInfo.error && sceneInfo.error.code === MATTERPORT_ERROR && sceneInfo.error.message) {
            addMessages([{ category: DisplayMessageCategory.Warning, messageText: sceneInfo.error.message }]);
          } else if (sceneInfo && sceneInfo.generatedSceneMetadata) {
            const accessToken = sceneInfo.generatedSceneMetadata[MATTERPORT_ACCESS_TOKEN];
            const applicationKey = sceneInfo.generatedSceneMetadata[MATTERPORT_APPLICATION_KEY];

            if (applicationKey) {
              const updatedMatterportLibraryConfig = { ...externalLibraryConfig?.matterport };
              updatedMatterportLibraryConfig.modelId = matterportModelId;
              updatedMatterportLibraryConfig.accessToken = accessToken;
              updatedMatterportLibraryConfig.applicationKey = applicationKey;
              setUpdatedExternalLibraryConfig({ ...externalLibraryConfig, matterport: updatedMatterportLibraryConfig });
            } else {
              setUpdatedExternalLibraryConfig({ ...externalLibraryConfig });
            }
          }
        })
        .catch((error) => {
          setLoadSceneError(error || new Error('Failed to get scene details'));
        });
    } else {
      setUpdatedExternalLibraryConfig({ ...externalLibraryConfig });
    }
  }, [
    enableMatterportViewer,
    connectionNameForMatterportViewer,
    matterportModelId,
    externalLibraryConfig,
    sceneMetadataModule,
  ]);

  // load scene content
  useLayoutEffect(() => {
    if (sceneContent?.length > 0) {
      loadScene(sceneContent, { disableMotionIndicator: false });
    }
  }, [sceneContent]);

  useEffect(() => {
    if (onSceneLoaded && sceneLoaded) {
      // Delay the event handler to let other components finish loading, otherwise the consumer side will
      // fail to update scene states
      setTimeout(async () => {
        // onSceneLoaded();
        let nextToken: undefined | string = undefined;

        const rows: Row[] = [];
        do {
          const command = new ExecuteQueryCommand({
            workspaceId: getGlobalSettings().wsId,
            queryStatement: query,
            nextToken,
          });
          await getGlobalSettings()
            .tmClient?.send(command)
            .then((res) => {
              rows.push(...(res.rows ?? []));
              nextToken = res.nextToken;
            });
        } while (nextToken);

        const sceneNodes: ISceneNode[] = [];

        rows?.forEach((row) => {
          const entity = row.rowData![0]!;
          // console.log('xxx row', entity['entityId'], row.rowData![2]?.['entityId'])

          if (sceneNodes.find((node) => node.ref === entity['entityId'])) return;

          const nodeCompos = entity['components'].filter((comp) => comp['componentTypeId'] === 'com.example.3d.node');

          nodeCompos.forEach((nodeCompo) => {
            console.log('xxx ', nodeCompo.properties);
            const nodeTransform = entity['components'].find(
              (comp) =>
                comp.componentTypeId == 'com.example.3d.transform' &&
                comp.componentName.startsWith(nodeCompo.componentName + '_'),
            );
            // Assume components of the node are prefixed with the node component's name
            const node: ISceneNode = {
              ref: entity['entityId'] + '_' + nodeCompo['componentName'],
              name:
                nodeCompo.properties.find((p) => p.propertyName == 'name')?.propertyValue ??
                entity['entityName'] ??
                entity['entityId'],
              components: [
                {
                  type: KnownComponentType.EntityBinding,
                  valueDataBinding: {
                    dataBindingContext: {
                      entityId: entity['entityId'],
                    },
                  },
                } as IEntityBindingComponent,
              ],
              transform: {
                position: nodeTransform['properties'].find((p) => p['propertyName'] == 'position')?.propertyValue ?? [
                  0, 0, 0,
                ],
                scale: nodeTransform['properties'].find((p) => p['propertyName'] == 'scale')?.propertyValue ?? [
                  1, 1, 1,
                ],
                rotation: nodeTransform['properties'].find((p) => p['propertyName'] == 'rotation')?.propertyValue ?? [
                  0, 0, 0,
                ],
              },
              // parentRef: row.rowData![1]!['relationshipName'] == 'isChildOf' ? row.rowData![1]!['targetEntityId'] + '_node' : undefined,
            };

            // // Assume one component per node and in the same entity - KG doesn't return relationship value
            // const sceneComp = entity['components'].find((comp) => comp.componentName === nodeCompo.properties?.find((prop) => prop['propertyName'] === 'Components')?.propertyValue?.targetComponentName)
            const sceneComps = entity['components'].filter(
              (comp) =>
                comp['componentTypeId'].startsWith('com.example.3d.component') &&
                comp['componentName'].startsWith(nodeCompo.componentName + '_'),
            );
            sceneComps.forEach((sceneComp) => {
              const sceneCompConverted = {};
              switch (sceneComp['componentTypeId']) {
                case 'com.example.3d.component.tag':
                  const bindingComp = entity['components'].find(
                    (comp) =>
                      comp.componentTypeId == 'com.example.3d.twinmaker.databinding.context' &&
                      comp.componentName.startsWith(sceneComp.componentName + '_'),
                  );
                  if (bindingComp) {
                    sceneCompConverted['valueDataBinding'] = {
                      dataBindingContext: {
                        entityId: bindingComp.properties.find((p) => p.propertyName == 'entityId')?.propertyValue,
                        componentName: bindingComp.properties.find((p) => p.propertyName == 'componentName')
                          ?.propertyValue,
                        propertyName: bindingComp.properties.find((p) => p.propertyName == 'propertyName')
                          ?.propertyValue,
                      },
                    };
                  }
                  sceneComp?.properties?.forEach((prop) => {
                    if (prop.propertyName == 'offset_pure') {
                      sceneCompConverted['offset'] = prop.propertyValue;
                    } else {
                      sceneCompConverted[prop['propertyName']] = prop['propertyValue'];
                    }
                  });
                  break;
                case 'com.example.3d.component.dataoverlay':
                  // Assume only one row
                  const rowComp = entity['components'].find(
                    (comp) =>
                      comp.componentTypeId == 'com.example.3d.component.data.overlay.markdown.row' &&
                      comp.componentName.startsWith(sceneComp.componentName + '_row'),
                  );
                  sceneCompConverted['dataRows'] = [{}];
                  rowComp?.properties?.forEach((prop) => {
                    if (prop['propertyName'] == 'content') {
                      sceneCompConverted['dataRows'][0][prop['propertyName']] = decodeURI(prop['propertyValue']);
                    } else {
                      sceneCompConverted['dataRows'][0][prop['propertyName']] = prop['propertyValue'];
                    }
                  });
                  sceneCompConverted['subType'] = sceneComp?.properties?.find(
                    (p) => p.propertyName == 'subType',
                  )?.propertyValue;
                  sceneCompConverted['type'] = KnownComponentType.DataOverlay;
                  sceneCompConverted['valueDataBindings'] = [];

                  break;
                default:
                  if (sceneComp.componentTypeId == 'com.example.3d.component.data.overlay.markdown.row') return;

                  sceneComp?.properties?.forEach((prop) => {
                    sceneCompConverted[prop['propertyName']] = prop['propertyValue'];
                  });
              }
              node.components!.push(sceneCompConverted as any);
            });
            sceneNodes.push(node);
          });
          console.log('xxx res', rows, sceneNodes);

          sceneNodes.forEach((node) => {
            if (!sceneNodes.find((n) => node.parentRef == n.ref)) {
              node.parentRef = undefined;
            }
          });
          appendSceneNodeBatch(sceneNodes);
        });
      }, 100);
    }
  }, [sceneLoaded, onSceneLoaded, query]);

  // Subscribe to store update
  useEffect(() => {
    if (onSceneUpdated) {
      return useStore(sceneComposerId).subscribe(
        (state, old: Pick<RootState, 'document' | 'sceneLoaded'>) => {
          // Do not call onSceneUpdated when
          //  - scene is not loaded
          //  - scene is just loaded
          //  - document is not changed
          // Transient document update will also trigger onSceneUpdated, the app side will debounce the actual saving to S3 call.
          if (!state.sceneLoaded || !old.sceneLoaded || state.document === old.document) {
            return;
          }
          onSceneUpdated(sceneDocumentSnapshotCreator.create({ document: state.document }));
        },
        (state) => ({ document: state.document, sceneLoaded: state.sceneLoaded }),
      );
    }
  }, [onSceneUpdated]);

  // Update data input
  useEffect(() => {
    if ((queriedStreams || dataStreams) && viewport) {
      setDataInput(convertDataStreamsToDataInput([...(queriedStreams || []), ...(dataStreams || [])], viewport));
    }
  }, [queriedStreams, dataStreams]);

  useEffect(() => {
    if (queries && viewport) {
      dataProviderRef.current = combineProviders(
        queries.map((query) =>
          query.build(sceneComposerId, {
            viewport: viewport,
            settings: {
              // only support default settings for now until when customization is needed
              fetchFromStartToEnd: true,
            },
          }),
        ),
      );
      dataProviderRef.current.subscribe({
        next: (results: TimeSeriesData[]) => {
          const streams = combineTimeSeriesData(results);
          const completedStreams = streams.dataStreams.filter((s) => !s.isLoading && !s.isRefreshing);
          setQueriedStreams(completedStreams);
        },
      });
    }

    return () => {
      dataProviderRef.current?.unsubscribe();
      dataProviderRef.current = undefined;
    };
  }, [queries, viewport]);

  useEffect(() => {
    if (dataBindingTemplate) {
      setDataBindingTemplate(dataBindingTemplate);
    }
  }, [dataBindingTemplate]);

  // Throw error to be captured by ErrorBoundary and render error view
  useEffect(() => {
    if (loadSceneError) {
      throw loadSceneError;
    }
  }, [loadSceneError]);

  const pointerMissedCallback = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      // deselect selected node on click
      if (e.type === 'click') {
        setSelectedSceneNodeRef(undefined);
      }
    },
    [setSelectedSceneNodeRef],
  );

  const isViewing = config.mode === 'Viewing';
  const showMessageModal = messages.length > 0;

  return (
    <SceneLayout
      isViewing={isViewing}
      showMessageModal={showMessageModal}
      externalLibraryConfig={updatedExternalLibraryConfig}
      LoadingView={
        <IntlProvider locale={config.locale}>
          <LoadingProgress />
        </IntlProvider>
      }
      onPointerMissed={pointerMissedCallback}
    />
  );
};

export default StateManager;
