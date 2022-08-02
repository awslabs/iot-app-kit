import * as THREE from 'three';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import ab2str from 'arraybuffer-to-string';

import useLifecycleLogging from '../logger/react-logger/hooks/useLifecycleLogging';
import {
  AdditionalComponentData,
  KnownComponentType,
  KnownSceneProperty,
  SceneComposerInternalProps,
} from '../interfaces';
import {
  setCdnPath,
  setDracoDecoder,
  setFeatureConfig,
  setGetSceneObjectFunction,
  setLocale,
  setMetricRecorder,
} from '../common/GlobalSettings';
import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { IAnchorComponentInternal, SceneComposerOperationTypeMap, useStore } from '../store';
import { createStandardUriModifier } from '../utils/uriModifiers';
import sceneDocumentSnapshotCreator from '../utils/sceneDocumentSnapshotCreator';
import { SceneLayout } from '../layouts/SceneLayout';
import { findComponentByType } from '../utils/nodeUtils';
import { applyDataBindingTemplate } from '../utils/dataBindingTemplateUtils';

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
  onWidgetClick,
  onSelectionChanged,
  dataInput,
  dataBindingTemplate,
  locale,
}: SceneComposerInternalProps) => {
  useLifecycleLogging('StateManager');
  const sceneComposerId = useSceneComposerId();

  const setEditorConfig = useStore(sceneComposerId)((state) => state.setEditorConfig);
  const setDataInput = useStore(sceneComposerId)((state) => state.setDataInput);
  const setDataBindingTemplate = useStore(sceneComposerId)((state) => state.setDataBindingTemplate);
  const [sceneContentUri, setSceneContentUri] = useState<string>('');
  const [sceneContent, setSceneContent] = useState<string>('');
  const [loadSceneError, setLoadSceneError] = useState<Error | undefined>();
  const loadScene = useStore(sceneComposerId)((state) => state.loadScene);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const setSelectedSceneNodeRef = useStore(sceneComposerId)((state) => state.setSelectedSceneNodeRef);
  const baseUrl = useStore(sceneComposerId)((state) => state.getSceneProperty(KnownSceneProperty.BaseUrl));
  const messages = useStore(sceneComposerId)((state) => state.getMessages());
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);

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
      onWidgetClick,
      onSelectionChanged,
    });
  }, [
    config.mode,
    standardUriModifier,
    valueDataBindingProvider,
    showAssetBrowserCallback,
    onAnchorClick,
    onWidgetClick,
    onSelectionChanged,
  ]);

  useEffect(() => {
    if (onSelectionChanged) {
      const node = getSceneNodeByRef(selectedSceneNodeRef);
      const componentTypes = node?.components.map((component) => component.type) ?? [];

      const tagComponent = findComponentByType(node, KnownComponentType.Tag) as IAnchorComponentInternal;

      let additionalComponentData: AdditionalComponentData[] | undefined;
      if (tagComponent) {
        additionalComponentData = [
          {
            navLink: tagComponent.navLink,
            dataBindingContext: !tagComponent.valueDataBinding?.dataBindingContext
              ? undefined
              : applyDataBindingTemplate(tagComponent.valueDataBinding, dataBindingTemplate),
          },
        ];
      }

      onSelectionChanged({
        componentTypes,
        nodeRef: selectedSceneNodeRef,
        additionalComponentData,
      });
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
      sceneLoader
        ?.getSceneUri()
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
    }
  }, [sceneLoader, sceneContentUrl]);

  useEffect(() => {
    if (sceneContentUri && sceneContentUri.length > 0) {
      const promise = sceneLoader
        ? sceneLoader.getSceneObject(sceneContentUri)
        : getSceneObjectFunction?.(sceneContentUri);
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

  // load scene content
  useLayoutEffect(() => {
    if (sceneContent?.length > 0) {
      loadScene(sceneContent, { disableMotionIndicator: false });
    }
  }, [sceneContent]);

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

  // Throw error to be captured by ErrorBoundary and render error view
  useEffect(() => {
    if (loadSceneError) {
      throw loadSceneError;
    }
  }, [loadSceneError]);

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
        <IntlProvider locale={config.locale || locale}>
          <LoadingProgress />
        </IntlProvider>
      }
      onPointerMissed={pointerMissedCallback}
    />
  );
};

export default StateManager;
