import React, { FC, Fragment, ReactNode, Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import { useContextBridge } from '@react-three/drei/core/useContextBridge';
import { MatterportViewer, MpSdk } from '@matterport/r3f/dist';
import { isEmpty } from 'lodash';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { setMatterportSdk } from '../../common/GlobalSettings';
import LoggingContext from '../../logger/react-logger/contexts/logging';
import MessageModal from '../../components/MessageModal';
import { MenuBar } from '../../components/MenuBar';
import { StaticLayout } from '../StaticLayout';
import { WebGLCanvasManager } from '../../components/WebGLCanvasManager';
import { FloatingToolbar } from '../../components/toolbars';
import {
  SceneHierarchyPanel,
  SceneNodeInspectorPanel,
  SceneRulesPanel,
  SettingsPanel,
  TopBar,
} from '../../components/panels';
import { sceneComposerIdContext, useSceneComposerId } from '../../common/sceneComposerIdContext';
import { useSceneDocument, useStore } from '../../store';
import LogProvider from '../../logger/react-logger/log-provider';
import DefaultErrorFallback from '../../components/DefaultErrorFallback';
import { ExternalLibraryConfig, KnownComponentType, MatterportConfig } from '../../interfaces';
import { CameraPreview } from '../../components/three-fiber/CameraPreview';
import useMatterportViewer from '../../hooks/useMatterportViewer';
import useSelectedNode from '../../hooks/useSelectedNode';
import { findComponentByType } from '../../utils/nodeUtils';
import ConvertSceneModal from '../../components/ConvertSceneModal';
import useDynamicScene from '../../hooks/useDynamicScene';
import { SceneLayers } from '../../components/SceneLayers';

import { Direction } from './components/utils';
import ScenePanel from './components/ScenePanel';
import CameraPreviewTrack from './components/CameraPreviewTrack';

const queryClient = new QueryClient();

const UnselectableCanvas = styled(Canvas)`
  user-select: none;
  background: ${({ theme }) => {
    return theme.canvasBackground;
  }};
  z-index: 0;
`;

const TestBootstrapper = () => {
  const sceneComposerId = useSceneComposerId();
  const { scene, gl } = useThree();
  useEffect(() => {
    const customEvent = new CustomEvent('twinmaker:scene-loaded', {
      detail: {
        sceneComposerId,
        scene,
        gl,
      },
    });
    window.dispatchEvent(customEvent);

    return () => {
      const customEvent = new CustomEvent('twinmaker:scene-unloaded', {
        detail: {
          sceneComposerId,
        },
      });

      window.dispatchEvent(customEvent);
    };
  }, [scene, gl, sceneComposerId]);

  return <></>;
};

const R3FWrapper = (props: { matterportConfig?: MatterportConfig; children?: ReactNode; sceneLoaded?: boolean }) => {
  const { children, sceneLoaded, matterportConfig } = props;
  const sceneComposerId = useContext(sceneComposerIdContext);
  const ContextBridge = useContextBridge(LoggingContext, sceneComposerIdContext, ThemeContext);
  const { enableMatterportViewer } = useMatterportViewer();
  const loadMatterport = enableMatterportViewer && matterportConfig && !isEmpty(matterportConfig.modelId);

  useEffect(() => {
    if (!loadMatterport) {
      setMatterportSdk(sceneComposerId);
      /* Clear the Cache for THREE to reset the R3F when switching from a Matterport to a non-Matterport scene.
      This is required to revert/reset the changes done by the Matterport viewer. */
      window.THREE.Cache.clear();
    }
  }, [loadMatterport]);

  if (!sceneLoaded) {
    return null;
  }

  return loadMatterport ? (
    <MatterportViewer
      assetBase={matterportConfig?.assetBase}
      m={matterportConfig?.modelId}
      applicationKey={matterportConfig?.applicationKey}
      connect-auth={matterportConfig?.accessToken}
      connect-provider='iot-twinmaker'
      onReady={(matterportSdk: MpSdk) => {
        setMatterportSdk(sceneComposerId, matterportSdk);
      }}
      style={{ width: '100%', height: '100%' }}
      search={0}
      title={0}
      mt={0}
      play={1}
      mls={1}
    >
      <ContextBridge>
        <Suspense fallback={null}>{children}</Suspense>
      </ContextBridge>
    </MatterportViewer>
  ) : (
    <UnselectableCanvas shadows dpr={window.devicePixelRatio} id='tm-scene-unselectable-canvas'>
      <ContextBridge>
        <Suspense fallback={null}>{children}</Suspense>
      </ContextBridge>
    </UnselectableCanvas>
  );
};

interface SceneLayoutProps {
  isViewing: boolean;
  onPointerMissed: (event: ThreeEvent<PointerEvent>) => void;
  LoadingView: ReactNode;
  showMessageModal: boolean;
  showConvertSceneModal?: boolean;
  externalLibraryConfig?: ExternalLibraryConfig;
}
const SceneLayout: FC<SceneLayoutProps> = ({
  isViewing,
  LoadingView = null,
  showMessageModal,
  showConvertSceneModal,
  externalLibraryConfig,
}) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const valueDataBindingProvider = useStore(sceneComposerId)((state) => state.getEditorConfig)()
    .valueDataBindingProvider;
  const ContextBridge = useContextBridge(LoggingContext, sceneComposerIdContext, ThemeContext);
  const intl = useIntl();
  const { sceneLoaded } = useSceneDocument(sceneComposerId);
  const renderDisplayRef = useRef<HTMLDivElement>(null!);
  const selectedNode = useSelectedNode();

  const shouldShowPreview = useMemo(() => {
    return isViewing ? false : !!findComponentByType(selectedNode.selectedSceneNode, KnownComponentType.Camera);
  }, [selectedNode]);

  const dynamicSceneEnabled = useDynamicScene();

  const leftPanelEditModeProps = {
    direction: Direction.Left,
    panels: {
      [intl.formatMessage({ defaultMessage: 'Hierarchy', description: 'Panel Tab title' })]: <SceneHierarchyPanel />,
      [intl.formatMessage({ defaultMessage: 'Rules', description: 'Panel Tab title' })]: <SceneRulesPanel />,
      [intl.formatMessage({ defaultMessage: 'Settings', description: 'Panel Tab title' })]: (
        <SettingsPanel valueDataBindingProvider={valueDataBindingProvider} />
      ),
    },
  };
  const leftPanelViewModeProps = {
    direction: Direction.Left,
    collapse: isViewing,
    panels: {
      [intl.formatMessage({ defaultMessage: 'Hierarchy', description: 'Panel Tab title' })]: <SceneHierarchyPanel />,
      [intl.formatMessage({ defaultMessage: 'Settings', description: 'Panel Tab title' })]: (
        <SettingsPanel valueDataBindingProvider={valueDataBindingProvider} />
      ),
    },
  };
  const rightPanelProps = {
    direction: Direction.Right,
    panels: {
      [intl.formatMessage({ defaultMessage: 'Inspector', description: 'Panel Tab title' })]: (
        <SceneNodeInspectorPanel />
      ),
    },
  };

  const leftPanel = <ScenePanel {...leftPanelEditModeProps} />;
  const viewingModeScenePanel = <ScenePanel {...leftPanelViewModeProps} />;
  const rightPanel = <ScenePanel {...rightPanelProps} />;

  return (
    <StaticLayout
      mainContent={
        <Fragment>
          <LogProvider namespace='SceneLayout' ErrorView={DefaultErrorFallback}>
            <FloatingToolbar isViewing={isViewing} />
            <ContextBridge>
              {dynamicSceneEnabled && (
                <QueryClientProvider client={queryClient}>
                  <SceneLayers />
                </QueryClientProvider>
              )}

              {shouldShowPreview && (
                <CameraPreviewTrack ref={renderDisplayRef} title={selectedNode.selectedSceneNode?.name} />
              )}
              <R3FWrapper sceneLoaded={sceneLoaded} matterportConfig={externalLibraryConfig?.matterport}>
                {sceneLoaded && <TestBootstrapper />}
                <Suspense fallback={LoadingView}>
                  {!sceneLoaded ? null : (
                    <Fragment>
                      <WebGLCanvasManager />
                      {shouldShowPreview && <CameraPreview track={renderDisplayRef} />}
                    </Fragment>
                  )}
                </Suspense>
              </R3FWrapper>
            </ContextBridge>
          </LogProvider>
        </Fragment>
      }
      showModal={showMessageModal || (showConvertSceneModal && !isViewing)}
      modalContent={showConvertSceneModal && !isViewing ? <ConvertSceneModal /> : <MessageModal />}
      header={!isViewing && <MenuBar />}
      leftPanel={isViewing ? viewingModeScenePanel : leftPanel}
      rightPanel={!isViewing && rightPanel}
      topBar={<TopBar />}
    />
  );
};

export default SceneLayout;
