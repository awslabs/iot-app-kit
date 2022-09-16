import React, { FC, Fragment, ReactNode, Suspense, useContext, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useContextBridge } from '@react-three/drei/core/useContextBridge';

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
import { KnownComponentType } from '../../interfaces';
import { CameraPreview } from '../../components/three-fiber/CameraPreview';
import useSelectedNode from '../../hooks/useSelectedNode';
import { findComponentByType } from '../../utils/nodeUtils';

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

interface SceneLayoutProps {
  isViewing: boolean;
  onPointerMissed: (event: ThreeEvent<PointerEvent>) => void;
  LoadingView: ReactNode;
  showMessageModal: boolean;
}

const SceneLayout: FC<SceneLayoutProps> = ({ isViewing, onPointerMissed, LoadingView = null, showMessageModal }) => {
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

  const leftPanelEditModeProps = {
    [intl.formatMessage({ defaultMessage: 'Hierarchy', description: 'Panel Tab title' })]: <SceneHierarchyPanel />,
    [intl.formatMessage({ defaultMessage: 'Rules', description: 'Panel Tab title' })]: <SceneRulesPanel />,
    [intl.formatMessage({ defaultMessage: 'Settings', description: 'Panel Tab title' })]: (
      <SettingsPanel valueDataBindingProvider={valueDataBindingProvider} />
    ),
  };
  const leftPanelViewModeProps = {
    [intl.formatMessage({ defaultMessage: 'Hierarchy', description: 'Panel Tab title' })]: <SceneHierarchyPanel />,
  };
  const rightPanelProps = {
    [intl.formatMessage({ defaultMessage: 'Inspector', description: 'Panel Tab title' })]: <SceneNodeInspectorPanel />,
  };

  const leftPanel = <LeftPanel {...leftPanelEditModeProps} />;

  const viewingModeLeftPanel = <LeftPanel {...leftPanelViewModeProps} />;

  const rightPanel = <RightPanel {...rightPanelProps} />;

  return (
    <StaticLayout
      mainContent={
        <Fragment>
          <LogProvider namespace={'SceneLayout'} ErrorView={DefaultErrorFallback}>
            <FloatingToolbar isViewing={isViewing} />
            {shouldShowPreview && (
              <CameraPreviewTrack ref={renderDisplayRef} title={selectedNode.selectedSceneNode?.name} />
            )}
            <UnselectableCanvas shadows dpr={window.devicePixelRatio} onPointerMissed={onPointerMissed}>
              <ContextBridge>
                {/* TODO: Add loading view */}
                <Suspense fallback={LoadingView}>
                  {!sceneLoaded ? null : (
                    <Fragment>
                      <WebGLCanvasManager />
                      {shouldShowPreview && <CameraPreview track={renderDisplayRef} />}
                    </Fragment>
                  )}
                </Suspense>
              </ContextBridge>
            </UnselectableCanvas>
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
