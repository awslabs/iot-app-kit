import React, { useEffect, useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { applyMode, Mode } from '@awsui/global-styles';
import { cloneDeep } from 'lodash';

import LogProvider from '../logger/react-logger/log-provider';
import { darkTheme, lightTheme } from '../theme';
import { GlobalStyles } from '../GlobalStyles';
import { useStore } from '../store';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { generateUUID } from '../utils/mathUtils';
import { SCENE_BODY_CLASS } from '../common/constants';
import { SceneComposerInternalProps } from '../interfaces';

import StateManager from './StateManager';
import DefaultErrorFallback from './DefaultErrorFallback';
import IntlProvider from './IntlProvider';

export const SceneComposerInternal: React.FC<SceneComposerInternalProps> = ({
  sceneComposerId,
  ErrorView,
  onError,
  config,
  ...props
}: SceneComposerInternalProps) => {
  const currentSceneComposerId = useMemo(() => sceneComposerId ?? generateUUID(), [sceneComposerId]);

  const ErrorFallback: React.ReactNode = ErrorView || DefaultErrorFallback;

  // Assuming we only have dark or light...
  const theme = config.colorTheme ?? config.colorTheme === 'light' ? lightTheme : darkTheme;

  // label body as being used by the scene. this allows other components to identify it vs. other page components
  document.body.className = document.body.className + ' ' + SCENE_BODY_CLASS;

  useEffect(() => {
    if (config.colorTheme === 'light') {
      applyMode(Mode.Light);
    } else {
      applyMode(Mode.Dark);
    }
  }, [config.colorTheme]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <LogProvider namespace='SceneComposerInternal' logger={config.logger} ErrorView={ErrorFallback} onError={onError}>
        <IntlProvider locale={config.locale}>
          <sceneComposerIdContext.Provider value={currentSceneComposerId}>
            <StateManager config={config} {...props} />
          </sceneComposerIdContext.Provider>
        </IntlProvider>
      </LogProvider>
    </ThemeProvider>
  );
};

export function useSceneComposerApi(sceneComposerId: string) {
  const store = useStore(sceneComposerId);
  const state = store.getState();

  return {
    findSceneNodeRefBy: state.findSceneNodeRefBy,
    setCameraTarget: state.setCameraTarget,
    getSceneNodeByRef: (ref: string) => cloneDeep(state.getSceneNodeByRef(ref)),
    getSelectedSceneNodeRef: () => store.getState().selectedSceneNodeRef,
    setSelectedSceneNodeRef: state.setSelectedSceneNodeRef,
  };
}

export type SceneComposerApi = ReturnType<typeof useSceneComposerApi>;
