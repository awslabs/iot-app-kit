import React, { FC, Fragment, ReactNode, Suspense, useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useContextBridge } from '@react-three/drei/core/useContextBridge';
import { isEmpty } from 'lodash';

import LoggingContext from '../../logger/react-logger/contexts/logging';
import MessageModal from '../../components/MessageModal';
import { MenuBar } from '../../components/MenuBar';
import { StaticLayout } from '../../components/StaticLayout';
import { WebGLCanvasManager } from '../../components/WebGLCanvasManager';
import { FloatingToolbar } from '../../components/toolbars';
import {
  SceneHierarchyPanel,
  SceneNodeInspectorPanel,
  SceneRulesPanel,
  SettingsPanel,
  TopBar,
} from '../../components/panels';
import { sceneComposerIdContext } from '../../sceneComposerIdContext';
import { useSceneDocument, useStore } from '../../store';
import { KnownComponentType, KnownSceneProperty } from '../../interfaces';
import { PoweredByMatterport } from '../../assets/svgs';

import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

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
  const getComponentRefByType = useStore(sceneComposerId)((state) => state.getComponentRefByType);
  const componentNodeMap = useStore(sceneComposerId)((state) => state.document.componentNodeMap);
  const ContextBridge = useContextBridge(LoggingContext, sceneComposerIdContext, ThemeContext);
  const intl = useIntl();
  const { sceneLoaded, getSceneProperty } = useSceneDocument(sceneComposerId);
  const matterportModelId: string = getSceneProperty(KnownSceneProperty.MatterportModelId);

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

  const showTopBar = useCallback(() => {
    return !isEmpty(getComponentRefByType(KnownComponentType.MotionIndicator));
  }, [componentNodeMap]);

  return (
    <StaticLayout
      mainContent={
        <Fragment>
          <FloatingToolbar isViewing={isViewing} />
          {matterportModelId && <PoweredByMatterport matterportModelId={matterportModelId} />}
          <UnselectableCanvas shadows dpr={window.devicePixelRatio} onPointerMissed={onPointerMissed}>
            <ContextBridge>
              <Suspense fallback={LoadingView}>{!sceneLoaded ? null : <WebGLCanvasManager />}</Suspense>
            </ContextBridge>
          </UnselectableCanvas>
        </Fragment>
      }
      showModal={showMessageModal}
      modalContent={<MessageModal />}
      header={!isViewing && <MenuBar />}
      leftPanel={isViewing ? viewingModeLeftPanel : leftPanel}
      rightPanel={!isViewing && rightPanel}
      topBar={showTopBar() && <TopBar />}
    />
  );
};

export default SceneLayout;
