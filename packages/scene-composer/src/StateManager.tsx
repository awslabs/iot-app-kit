import * as THREE from 'three';
import React, { ReactElement, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import ab2str from 'arraybuffer-to-string';

import useLifecycleLogging from './logger/react-logger/hooks/useLifecycleLogging';
import IntlProvider from './components/IntlProvider';
import {
  AnchorEventCallback,
  GetSceneObjectFunction,
  IDataInput,
  IValueDataBindingProvider,
  IDataBindingTemplate,
  KnownSceneProperty,
  OnSceneUpdateCallback,
  OperationMode,
  ShowAssetBrowserCallback,
  IMetricRecorder,
  COMPOSER_FEATURES,
  FeatureConfig,
} from './interfaces';
import {
  DracoDecoderConfig,
  setDracoDecoder,
  setLocale,
  setCdnPath,
  setMetricRecorder,
  enableDataBindingTemplate,
  getGlobalSettings,
  setFeatureConfig,
  setGetSceneObjectFunction,
} from './GlobalSettings';
import { sceneComposerIdContext } from './sceneComposerIdContext';
import { SceneComposerOperationTypeMap, useStore } from './store';
import { createStandardUriModifier } from './utils/uriModifiers';
import sceneDocumentSnapshotCreator from './sceneDocumentSnapshotCreator';
import { SceneLayout } from './layouts/scene-layout';
import { LoadingProgress } from './components/three-fiber/LoadingProgress';
import ILogger from './logger/ILogger';

export interface SceneComposerConfig {
  mode: OperationMode;
  dracoDecoder?: DracoDecoderConfig;
  cdnPath?: string;
  colorTheme?: 'dark' | 'light';
  shouldEnableDataBindingTemplate?: boolean;
  metricRecorder?: IMetricRecorder;
  // NOTE: this config is to continue support current feature flags. It will be deprecated once integrated
  // into App Kit, and then feature branch will be used to control new feature release.
  featureConfig?: FeatureConfig;
  logger?: ILogger;
}

export interface SceneComposerProps {
  sceneComposerId?: string;
  sceneContentUrl: string;
  getSceneObjectFunction: GetSceneObjectFunction;
  config: SceneComposerConfig;

  onSceneUpdated?: OnSceneUpdateCallback;

  valueDataBindingProvider?: IValueDataBindingProvider;
  showAssetBrowserCallback?: ShowAssetBrowserCallback;
  onAnchorClick?: AnchorEventCallback;

  dataInput?: IDataInput;
  dataBindingTemplate?: IDataBindingTemplate;

  locale?: string;
  ErrorView?: ReactElement;
  onError?(error: Error, errorInfo?: { componentStack: string }): void;
}

const StateManager: React.FC<SceneComposerProps> = ({
  sceneContentUrl,
  getSceneObjectFunction,
  config,
  onSceneUpdated,
  valueDataBindingProvider,
  showAssetBrowserCallback,
  onAnchorClick,
  dataInput,
  dataBindingTemplate,
  locale,
}: SceneComposerProps) => {
  useLifecycleLogging('StateManager');
  const sceneComposerId = useContext(sceneComposerIdContext);

  const setEditorConfig = useStore(sceneComposerId)((state) => state.setEditorConfig);
  const setDataInput = useStore(sceneComposerId)((state) => state.setDataInput);
  const setDataBindingTemplate = useStore(sceneComposerId)((state) => state.setDataBindingTemplate);
  const [sceneContent, setSceneContent] = useState<string>('');
  const loadScene = useStore(sceneComposerId)((state) => state.loadScene);
  const setSelectedSceneNodeRef = useStore(sceneComposerId)((state) => state.setSelectedSceneNodeRef);
  const baseUrl = useStore(sceneComposerId)((state) => state.getSceneProperty(KnownSceneProperty.BaseUrl));
  const messages = useStore(sceneComposerId)((state) => state.getMessages());
  const motionIndicatorEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.MOTION_INDICATOR];

  const standardUriModifier = useMemo(
    () => createStandardUriModifier(sceneContentUrl, baseUrl),
    [sceneContentUrl, baseUrl],
  );

  // Set SceneComposer configuration
  // Use layout effect to immediately re-render the SceneComposer when editor config change.
  useLayoutEffect(() => {
    THREE.Cache.enabled = true;

    setEditorConfig({
      operationMode: config.mode,
      uriModifier: standardUriModifier,
      valueDataBindingProvider,
      showAssetBrowserCallback,
      onAnchorClick,
    });

    if (config.dracoDecoder) {
      setDracoDecoder(config.dracoDecoder);
    }

    if (locale) {
      setLocale(locale);
    }

    setCdnPath(config.cdnPath);

    if (config.shouldEnableDataBindingTemplate) {
      enableDataBindingTemplate();
    }

    if (config.metricRecorder) {
      setMetricRecorder(config.metricRecorder);
    }

    if (config.featureConfig) {
      setFeatureConfig(config.featureConfig);
    }

    setGetSceneObjectFunction(getSceneObjectFunction);
  }, [
    config.mode,
    config.dracoDecoder,
    config.cdnPath,
    standardUriModifier,
    valueDataBindingProvider,
    showAssetBrowserCallback,
    onAnchorClick,
    locale,
  ]);

  useEffect(() => {
    if (sceneContentUrl?.length > 0) {
      const promise = getSceneObjectFunction(sceneContentUrl);
      if (promise === null) {
        throw new Error('Failed to fetch scene content');
      } else {
        promise
          .then((arrayBuffer) => {
            return ab2str(arrayBuffer);
          })
          .then((sceneContent) => {
            setSceneContent(sceneContent);
          });
      }
    }
  }, [sceneContentUrl]);

  // load scene content
  useLayoutEffect(() => {
    if (sceneContent?.length > 0) {
      loadScene(sceneContent, { disableMotionIndicator: !motionIndicatorEnabled });
    }
  }, [sceneContent, motionIndicatorEnabled]);

  // Subscribe to store update
  useEffect(() => {
    if (onSceneUpdated) {
      return useStore(sceneComposerId).subscribe((state) => {
        if (state.lastOperation) {
          if (SceneComposerOperationTypeMap[state.lastOperation] === 'UPDATE_DOCUMENT') {
            onSceneUpdated(sceneDocumentSnapshotCreator.create(state));
          }
        }
      });
    }
  }, [onSceneUpdated]);

  // Update data input
  useEffect(() => {
    if (dataInput) {
      setDataInput(dataInput);
    }
  }, [dataInput]);

  useEffect(() => {
    if (dataBindingTemplate) {
      setDataBindingTemplate(dataBindingTemplate);
    }
  }, [dataBindingTemplate]);

  const pointerMissedCallback = (e: ThreeEvent<PointerEvent>) => {
    // deselect selected node on click
    if (e.type === 'click') {
      setSelectedSceneNodeRef(undefined);
    }
  };

  const isViewing = config.mode === 'Viewing';
  const showMessageModal = messages.length > 0;

  return (
    <SceneLayout
      isViewing={isViewing}
      showMessageModal={showMessageModal}
      LoadingView={
        <IntlProvider locale={locale}>
          <LoadingProgress />
        </IntlProvider>
      }
      onPointerMissed={pointerMissedCallback}
    />
  );
};

export default StateManager;
