import React, { FC, Fragment, ReactNode, Suspense, useContext, useMemo, useRef } from 'react';
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
import useSelectedNode from '../../hooks/useSelectedNode';
import { findComponentByType } from '../../utils/nodeUtils';
import useFeature from '../../hooks/useFeature';
import { DeprecatedSceneNodeInspectorPanel } from '../../components/panels/SceneNodeInspectorPanel.C';

import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import CameraPreviewTrack from './components/CameraPreviewTrack';

const UnselectableCanvas = styled(Canvas)`
  user-select: none;
  background: ${({ theme }) => {
    return theme.canvasBackground;
  }};
  z-index: 0;
`;

const R3FWrapper = (props: {
  enableMatterport: boolean;
  matterportConfig?: MatterportConfig;
  children?: any;
  sceneLoaded?: boolean;
}) => {
  const { children, sceneLoaded, enableMatterport, matterportConfig } = props;
  const sceneComposerId = useContext(sceneComposerIdContext);
  const ContextBridge = useContextBridge(LoggingContext, sceneComposerIdContext, ThemeContext);
  const loadMatterPort = sceneLoaded && enableMatterport && matterportConfig?.modelId;

  return loadMatterPort ? (
    <MatterportViewer
      assetBase={matterportConfig?.assetBase}
      m={matterportConfig?.modelId}
      applicationKey={matterportConfig?.applicationKey}
      connect-auth={matterportConfig?.accessToken}
      connect-provider='iot-twinmaker'
      onReady={(matterportSdk: MpSdk) => {
        // propagate this out elsewhere if you wish to useMatterportSdk() interface
        // to control this viewer from other non-3d ui
        // <MpSdkContext.Provider value={matterportSdk}>
        //  <Other2DComponents/>
        // <MpSdkContext.Provider/>
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

  const [{ variation: matterportFeature }] = useFeature(COMPOSER_FEATURES.Matterport);

  const dataBindingComponentEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.DataBinding];

  const leftPanelEditModeProps = {
    [intl.formatMessage({ defaultMessage: 'Hierarchy', description: 'Panel Tab title' })]: <SceneHierarchyPanel />,
    [intl.formatMessage({ defaultMessage: 'Rules', description: 'Panel Tab title' })]: <SceneRulesPanel />,
    [intl.formatMessage({ defaultMessage: 'Settings', description: 'Panel Tab title' })]: (
      <SettingsPanel valueDataBindingProvider={valueDataBindingProvider} />
    ),
  };
  const leftPanelViewModeProps = {
    [intl.formatMessage({ defaultMessage: 'Hierarchy', description: 'Panel Tab title' })]: <SceneHierarchyPanel />,
    [intl.formatMessage({ defaultMessage: 'Settings', description: 'Panel Tab title' })]: (
      <SettingsPanel valueDataBindingProvider={valueDataBindingProvider} />
    ),
  };
  const rightPanelProps = {
    [intl.formatMessage({ defaultMessage: 'Inspector', description: 'Panel Tab title' })]:
      dataBindingComponentEnabled ? <SceneNodeInspectorPanel /> : <DeprecatedSceneNodeInspectorPanel />,
  };

  const leftPanel = <LeftPanel {...leftPanelEditModeProps} />;

  const viewingModeLeftPanel = <LeftPanel {...leftPanelViewModeProps} />;

  const rightPanel = <RightPanel {...rightPanelProps} />;

  return (
    <StaticLayout
      mainContent={
        <Fragment>
          <LogProvider namespace='SceneLayout' ErrorView={DefaultErrorFallback}>
            <FloatingToolbar isViewing={isViewing} />
            {/* {matterportModelId && <PoweredByMatterport matterportModelId={matterportModelId} />} */}
            {/*
            // TODO(mp): three upgrade type mismatch much unreadable, triage further.
            <UnselectableCanvas shadows dpr={window.devicePixelRatio} onPointerMissed={onPointerMissed}>
            */}
            <ContextBridge>
              {shouldShowPreview && (
                <CameraPreviewTrack ref={renderDisplayRef} title={selectedNode.selectedSceneNode?.name} />
              )}
              <R3FWrapper
                enableMatterport={matterportFeature === 'T1' && !!externalLibraryConfig?.matterport?.modelId}
                sceneLoaded={sceneLoaded}
                matterportConfig={externalLibraryConfig?.matterport}
              >
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
      leftPanel={isViewing ? viewingModeLeftPanel : leftPanel}
      rightPanel={!isViewing && rightPanel}
      topBar={<TopBar />}
    />
  );
};

export default SceneLayout;
