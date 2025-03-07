import { type GetSceneCommandOutput } from '@aws-sdk/client-iottwinmaker';
import {
  type DataStream,
  type DurationViewport,
  type ProviderWithViewport,
  type TimeSeriesData,
  combineProviders,
} from '@iot-app-kit/core';
import { type ThreeEvent } from '@react-three/fiber';
import ab2str from 'arraybuffer-to-string';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import {
  getMatterportSdk,
  setBasisuDecoder,
  setDracoDecoder,
  setFeatureConfig,
  setGetSceneObjectFunction,
  setLocale,
  setMetricRecorder,
  setOnFlashMessage,
  setTwinMakerSceneMetadataModule,
  subscribe,
  unsubscribe,
} from '../common/GlobalSettings';
import { MATTERPORT_ACCESS_TOKEN, MATTERPORT_APPLICATION_KEY, MATTERPORT_ERROR } from '../common/constants';
import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { SceneMetadataMapKeys } from '../common/sceneModelConstants';
import useActiveCamera from '../hooks/useActiveCamera';
import useMatterportViewer from '../hooks/useMatterportViewer';
import {
  type AdditionalComponentData,
  type ExternalLibraryConfig,
  KnownComponentType,
  KnownSceneProperty,
} from '../interfaces';
import { type SceneComposerInternalProps } from '../interfaces/sceneComposerInternal';
import { SceneLayout } from '../layouts/SceneLayout';
import useLifecycleLogging from '../logger/react-logger/hooks/useLifecycleLogging';
import {
  type ICameraComponentInternal,
  type ISceneDocumentInternal,
  type RootState,
  accessStore,
  useViewOptionState,
} from '../store';
import { DisplayMessageCategory } from '../store/internalInterfaces';
import { getCameraSettings } from '../utils/cameraUtils';
import { combineTimeSeriesData, convertDataStreamsToDataInput } from '../utils/dataStreamUtils';
import { getAdditionalComponentData } from '../utils/eventDataUtils';
import { findComponentByType } from '../utils/nodeUtils';
import sceneDocumentSnapshotCreator from '../utils/sceneDocumentSnapshotCreator';
import { createStandardUriModifier } from '../utils/uriModifiers';

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
  onFlashMessage,
}: SceneComposerInternalProps) => {
  useLifecycleLogging('StateManager');
  const sceneComposerId = useSceneComposerId();

  const {
    setEditorConfig,
    setDataInput,
    setDataBindingTemplate,
    loadScene,
    sceneLoaded,
    selectedSceneNodeRef,
    setSelectedSceneNodeRef,
    getSceneNodeByRef,
    getObject3DBySceneNodeRef,
    addMessages,
  } = accessStore(sceneComposerId)((state) => state);
  const [sceneContentUri, setSceneContentUri] = useState<string>('');
  const [sceneContent, setSceneContent] = useState<string | ISceneDocumentInternal | undefined>();
  const [loadSceneError, setLoadSceneError] = useState<Error | undefined>();
  const [queriedStreams, setQueriedStreams] = useState<DataStream[] | undefined>();
  const [updatedExternalLibraryConfig, setUpdatedExternalLibraryConfig] = useState<ExternalLibraryConfig | undefined>(
    externalLibraryConfig,
  );
  const matterportModelId = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<string>(KnownSceneProperty.MatterportModelId),
  );
  const {
    connectionNameForMatterportViewer,
    setConnectionNameForMatterportViewer,
    setViewport,
    setDataBindingQueryRefreshRate,
    setAutoQueryEnabled,
  } = useViewOptionState(sceneComposerId);
  const { enableMatterportViewer } = useMatterportViewer();
  const dataProviderRef = useRef<ProviderWithViewport<TimeSeriesData[]> | undefined>(undefined);
  const prevSelection = useRef<string | undefined>(undefined);
  const [matterportReady, setMatterportReady] = useState<boolean>(false);
  const [_sceneInfo, setSceneInfo] = useState<GetSceneCommandOutput | undefined>(undefined);

  const { setActiveCameraSettings, setActiveCameraName } = useActiveCamera();

  const standardUriModifier = useMemo(
    () => createStandardUriModifier(sceneContentUri || '', undefined),
    [sceneContentUri],
  );

  const isViewing = config.mode === 'Viewing';

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

  useEffect(() => {
    const onMatterportSdkUpdated = () => {
      const isReady = !!getMatterportSdk(sceneComposerId);
      setMatterportReady(isReady);
    };
    subscribe(onMatterportSdkUpdated);

    return () => {
      unsubscribe(onMatterportSdkUpdated);
    };
  }, []);

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
      const additionalComponentData: AdditionalComponentData[] = getAdditionalComponentData(node, dataBindingTemplate);

      onSelectionChanged({
        componentTypes,
        nodeRef: selectedSceneNodeRef,
        additionalComponentData,
      });
    }
  }, [selectedSceneNodeRef, onSelectionChanged]);

  useEffect(() => {
    const node = getSceneNodeByRef(selectedSceneNodeRef);
    const cameraComponent = findComponentByType(node, KnownComponentType.Camera) as ICameraComponentInternal;
    if (cameraComponent) {
      const object3D = getObject3DBySceneNodeRef(selectedSceneNodeRef);

      // @ts-expect-error type mismatch after update
      setActiveCameraSettings(getCameraSettings(object3D, cameraComponent));
    }
  }, [selectedSceneNodeRef]);

  useEffect(() => {
    if (config.basisuDecoder) {
      setBasisuDecoder(config.basisuDecoder);
    }
  }, [config.basisuDecoder]);

  useEffect(() => {
    if (config.dracoDecoder) {
      setDracoDecoder(config.dracoDecoder);
    }
  }, [config.dracoDecoder]);

  useEffect(() => {
    if (config.featureConfig) {
      setFeatureConfig(config.featureConfig);
    }
  }, [config.featureConfig]);

  useEffect(() => {
    setAutoQueryEnabled(isViewing && !queries && !dataStreams);
  }, [isViewing, queries, dataStreams]);

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
    setOnFlashMessage(onFlashMessage);
  }, [onFlashMessage]);

  useEffect(() => {
    setGetSceneObjectFunction(sceneLoader.getSceneObject);
  }, [sceneLoader]);

  useEffect(() => {
    if (sceneMetadataModule) {
      setTwinMakerSceneMetadataModule(sceneMetadataModule);
      sceneMetadataModule
        .getSceneInfo()
        .then((info) => {
          setSceneInfo(info);

          // Initialize ConnectionNameForMatterportViewer
          if (info && info.sceneMetadata?.[SceneMetadataMapKeys.MATTERPORT_SECRET_ARN]) {
            setConnectionNameForMatterportViewer(info.sceneMetadata[SceneMetadataMapKeys.MATTERPORT_SECRET_ARN]);
          }
        })
        .catch((error) => {
          setLoadSceneError(error || new Error('Failed to get scene info'));
        });
    }
  }, [sceneMetadataModule]);

  // get scene uri
  useEffect(() => {
    // Fetch scene uri for static scene
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
    if (sceneContent) {
      loadScene(sceneContent, { disableMotionIndicator: false });
    }
  }, [sceneContent]);

  useEffect(() => {
    if (onSceneLoaded && sceneLoaded && (!enableMatterportViewer || matterportReady)) {
      onSceneLoaded();
    }
  }, [sceneLoaded, onSceneLoaded, enableMatterportViewer, matterportReady]);

  // Subscribe to store update
  useEffect(() => {
    if (onSceneUpdated) {
      return accessStore(sceneComposerId).subscribe(
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
        // @ts-expect-error type mismatch after update
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
    setViewport(viewport);
  }, [viewport]);

  useEffect(() => {
    setDataBindingQueryRefreshRate(config.dataBindingQueryRefreshRate);
  }, [config.dataBindingQueryRefreshRate]);

  useEffect(() => {
    if (queries && viewport) {
      const refreshRate = config.dataBindingQueryRefreshRate ?? 5000;
      dataProviderRef.current = combineProviders(
        queries.map((query) =>
          query.build(sceneComposerId, {
            viewport: viewport,
            settings: {
              // only support default settings for now until when customization is needed
              fetchFromStartToEnd: true,
              refreshRate: (viewport as DurationViewport).duration ? refreshRate : undefined,
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
  }, [queries, viewport, config.dataBindingQueryRefreshRate]);

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

  return (
    <SceneLayout
      isViewing={isViewing}
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
