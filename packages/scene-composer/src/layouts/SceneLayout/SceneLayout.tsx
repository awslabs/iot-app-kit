import React, { FC, Fragment, ReactNode, Suspense, useContext, useEffect, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useContextBridge } from '@react-three/drei/core/useContextBridge';
import { MatterportViewer, MpSdk } from '@matterport/r3f/dist';

import { getGlobalSettings, setMatterportSdk } from '../../common/GlobalSettings';
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
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { useSceneDocument, useStore } from '../../store';
import LogProvider from '../../logger/react-logger/log-provider';
import DefaultErrorFallback from '../../components/DefaultErrorFallback';
import { COMPOSER_FEATURES, ExternalLibraryConfig, KnownComponentType, MatterportConfig } from '../../interfaces';
import { CameraPreview } from '../../components/three-fiber/CameraPreview';
import useMatterportViewer from '../../hooks/useMatterportViewer';
import useSelectedNode from '../../hooks/useSelectedNode';
import { findComponentByType } from '../../utils/nodeUtils';
import { DeprecatedSceneNodeInspectorPanel } from '../../components/panels/SceneNodeInspectorPanel.C';

import { Direction } from './components/utils';
import ScenePanel from './components/ScenePanel';
import CameraPreviewTrack from './components/CameraPreviewTrack';

const UnselectableCanvas = styled(Canvas)`
  user-select: none;
  background: ${({ theme }) => {
    return theme.canvasBackground;
  }};
  z-index: 0;
`;

const R3FWrapper = (props: { matterportConfig?: MatterportConfig; children?: unknown; sceneLoaded?: boolean }) => {
  const { children, sceneLoaded, matterportConfig } = props;
  const sceneComposerId = useContext(sceneComposerIdContext);
  const ContextBridge = useContextBridge(LoggingContext, sceneComposerIdContext, ThemeContext);
  const { enableMatterportViewer } = useMatterportViewer();
  const loadMatterport = enableMatterportViewer && matterportConfig;

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
    <UnselectableCanvas shadows dpr={window.devicePixelRatio}>
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
  externalLibraryConfig?: ExternalLibraryConfig;
}
const SceneLayout: FC<SceneLayoutProps> = ({
  isViewing,
  LoadingView = null,
  showMessageModal,
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

  const dataBindingComponentEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.DataBinding];

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
      [intl.formatMessage({ defaultMessage: 'Inspector', description: 'Panel Tab title' })]:
        dataBindingComponentEnabled ? <SceneNodeInspectorPanel /> : <DeprecatedSceneNodeInspectorPanel />,
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
              {shouldShowPreview && (
                <CameraPreviewTrack ref={renderDisplayRef} title={selectedNode.selectedSceneNode?.name} />
              )}
              <R3FWrapper sceneLoaded={sceneLoaded} matterportConfig={externalLibraryConfig?.matterport}>
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
      showModal={showMessageModal}
      modalContent={<MessageModal />}
      header={!isViewing && <MenuBar />}
      leftPanel={isViewing ? viewingModeScenePanel : leftPanel}
      rightPanel={!isViewing && rightPanel}
      topBar={<TopBar />}
    />
  );
};

export default SceneLayout;
