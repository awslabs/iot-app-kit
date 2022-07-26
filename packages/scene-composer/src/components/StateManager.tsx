import * as THREE from 'three';
import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import ab2str from 'arraybuffer-to-string';

import useLifecycleLogging from '../logger/react-logger/hooks/useLifecycleLogging';
import { KnownSceneProperty, COMPOSER_FEATURES, SceneComposerInternalProps } from '../interfaces';
import {
  setDracoDecoder,
  setLocale,
  setCdnPath,
  setMetricRecorder,
  getGlobalSettings,
  setFeatureConfig,
  setGetSceneObjectFunction,
} from '../common/GlobalSettings';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { SceneComposerOperationTypeMap, useStore } from '../store';
import { createStandardUriModifier } from '../utils/uriModifiers';
import sceneDocumentSnapshotCreator from '../utils/sceneDocumentSnapshotCreator';
import { SceneLayout } from '../layouts/scene-layout';

import IntlProvider from './IntlProvider';
import { LoadingProgress } from './three-fiber/LoadingProgress';

const StateManager: React.FC<SceneComposerInternalProps> = ({
  sceneContentUrl,
  getSceneObjectFunction,
  sceneLoader,
  config,
  onSceneUpdated,
  valueDataBindingProvider,
  showAssetBrowserCallback,
  onAnchorClick,
  dataInput,
  dataBindingTemplate,
  locale,
}: SceneComposerInternalProps) => {
  useLifecycleLogging('StateManager');
  const sceneComposerId = useContext(sceneComposerIdContext);

  const setEditorConfig = useStore(sceneComposerId)((state) => state.setEditorConfig);
  const setDataInput = useStore(sceneComposerId)((state) => state.setDataInput);
  const setDataBindingTemplate = useStore(sceneComposerId)((state) => state.setDataBindingTemplate);
  const [sceneContentUri, setSceneContentUri] = useState<string>('');
  const [sceneContent, setSceneContent] = useState<string>('');
  const loadScene = useStore(sceneComposerId)((state) => state.loadScene);
  const setSelectedSceneNodeRef = useStore(sceneComposerId)((state) => state.setSelectedSceneNodeRef);
  const baseUrl = useStore(sceneComposerId)((state) => state.getSceneProperty(KnownSceneProperty.BaseUrl));
  const messages = useStore(sceneComposerId)((state) => state.getMessages());
  const motionIndicatorEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.MOTION_INDICATOR];

  const standardUriModifier = useMemo(
    () => createStandardUriModifier(sceneContentUri || '', baseUrl),
    [sceneContentUri, baseUrl],
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
  }, [config.mode, standardUriModifier, valueDataBindingProvider, showAssetBrowserCallback, onAnchorClick]);

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
    setCdnPath(config.cdnPath);
  }, [config.cdnPath]);

  useEffect(() => {
    if (sceneLoader?.getSceneObject) {
      setGetSceneObjectFunction(sceneLoader.getSceneObject);
    } else if (getSceneObjectFunction) {
      setGetSceneObjectFunction(getSceneObjectFunction);
    }
  }, [getSceneObjectFunction, sceneLoader]);

  // get scene uri
  useEffect(() => {
    if (sceneContentUrl) {
      setSceneContentUri(sceneContentUrl);
    } else {
      sceneLoader?.getSceneUri().then((uri) => {
        if (uri) {
          setSceneContentUri(uri);
        }
      });
    }
  }, [sceneLoader, sceneContentUrl]);

  useEffect(() => {
    if (sceneContentUri && sceneContentUri.length > 0) {
      const promise = sceneLoader
        ? sceneLoader.getSceneObject(sceneContentUri)
        : getSceneObjectFunction?.(sceneContentUri);
      if (!promise) {
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
  }, [sceneContentUri]);

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
