import React, { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';

import LogProvider from './logger/react-logger/log-provider';
import IntlProvider from './components/IntlProvider';
import { darkTheme, lightTheme } from './theme';
import { GlobalStyles } from './GlobalStyles';
import { useStore } from './store';
import { sceneComposerIdContext } from './common/sceneComposerIdContext';
import { generateUUID } from './utils/mathUtils';
import StateManager from './components/StateManager';
import DefaultErrorFallback from './components/DefaultErrorFallback';
import { SCENE_BODY_CLASS } from './common/constants';
import { SceneComposerInternalProps } from './interfaces';

export const SceneComposerInternal: React.FC<SceneComposerInternalProps> = ({
  sceneComposerId,
  ErrorView,
  onError,
  config,
  locale,
  ...props
}: SceneComposerInternalProps) => {
  const currentSceneComposerId = useMemo(() => sceneComposerId ?? generateUUID(), [sceneComposerId]);

  const ErrorFallback: React.ReactNode = ErrorView || DefaultErrorFallback;

  // Assuming we only have dark or light...
  const theme = config.colorTheme ?? config.colorTheme === 'light' ? lightTheme : darkTheme;

  // label body as being used by the scene. this allows other components to identify it vs. other page components
  document.body.className = document.body.className + ' ' + SCENE_BODY_CLASS;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <LogProvider namespace='SceneComposer' logger={config.logger} ErrorView={ErrorFallback} onError={onError}>
        <IntlProvider locale={config.locale || locale}>
          <sceneComposerIdContext.Provider value={currentSceneComposerId}>
            <StateManager config={{ ...config, locale: config.locale || locale }} {...props} />
          </sceneComposerIdContext.Provider>
        </IntlProvider>
      </LogProvider>
    </ThemeProvider>
  );
};

export function useSceneComposerApi(sceneComposerId: string) {
  const state = useStore(sceneComposerId).getState();
  return {
    findSceneNodeRefBy: state.findSceneNodeRefBy,
    setCameraTarget: state.setCameraTarget,
    setSelectedSceneNodeRef: state.setSelectedSceneNodeRef,
  };
}

export type SceneComposerApi = ReturnType<typeof useSceneComposerApi>;
// TODO: remove after switching internal dependencies
export const SceneComposer = SceneComposerInternal;
