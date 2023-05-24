import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { ThemeProvider } from 'styled-components';
import { applyMode, Mode } from '@awsui/global-styles';
import { cloneDeep } from 'lodash';

import { SCENE_BODY_CLASS } from '../common/constants';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import LogProvider from '../logger/react-logger/log-provider';
import { GlobalStyles } from '../GlobalStyles';
import { KnownComponentType, SceneComposerInternalProps, StyleTarget } from '../interfaces';
import { materialReducer, initialMaterialMaps, addMaterial, removeMaterial, backUpOriginalMaterial } from '../reducers';
import { IDataBindingComponentInternal, useStore } from '../store';
import { darkTheme, lightTheme } from '../theme';
import { containsMatchingEntityComponent } from '../utils/dataBindingUtils';
import { generateUUID } from '../utils/mathUtils';
import { createMaterialFromStyle } from '../utils/objectThreeStyleUtils';

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

  const ErrorFallback = ErrorView || DefaultErrorFallback;

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
  const state = store.getState(); //This should likely be a useEffect updated by store instead!
  const [materialMaps, dispatch] = useReducer(materialReducer, initialMaterialMaps);

  const highlights = useCallback(
    (decorations: StyleTarget[]) => {
      const bindingComponentTypeFilter = [KnownComponentType.DataBinding];
      const nodeList = Object.values(store.getState().document.nodeMap);
      decorations.forEach((styleTarget) => {
        nodeList.forEach((node) => {
          const bindingComponent = node.components.find((component) => {
            if (bindingComponentTypeFilter.includes(component.type as KnownComponentType)) {
              const dataBoundComponent = component as IDataBindingComponentInternal;
              //TODO this should get changed to not be an array soon
              const boundContext = dataBoundComponent?.valueDataBindings?.at(0)?.valueDataBinding?.dataBindingContext;
              return containsMatchingEntityComponent(styleTarget.dataBindingContext, boundContext);
            } else {
              return false;
            }
          });
          if (bindingComponent) {
            const object3D = store.getState().getObject3DBySceneNodeRef(node.ref);
            if (object3D) {
              object3D?.traverse((o) => {
                const material = createMaterialFromStyle(o, styleTarget.style);
                if (material) {
                  //backup original
                  backUpOriginalMaterial(o, materialMaps, dispatch);
                  addMaterial(o, material, 'highlights', materialMaps, dispatch);
                }
              });
            }
          }
        });
      });
    },
    [store, dispatch, materialMaps],
  );

  const clearHighlights = useCallback(
    (dataBindingContexts: unknown[]) => {
      const bindingComponentTypeFilter = [KnownComponentType.DataBinding];
      const nodeList = Object.values(store.getState().document.nodeMap);
      dataBindingContexts.forEach((dataBindingContext) => {
        nodeList.forEach((node) => {
          const bindingComponent = node.components.find((component) => {
            if (bindingComponentTypeFilter.includes(component.type as KnownComponentType)) {
              const dataBoundComponent = component as IDataBindingComponentInternal;
              const boundContext = dataBoundComponent?.valueDataBindings?.at(0)?.valueDataBinding?.dataBindingContext;
              return containsMatchingEntityComponent(dataBindingContext, boundContext);
            } else {
              return false;
            }
          });
          if (bindingComponent) {
            const object3D = store.getState().getObject3DBySceneNodeRef(node.ref);
            if (object3D) {
              object3D?.traverse((o) => {
                removeMaterial(o, 'highlights', materialMaps, dispatch);
              });
            }
          }
        });
      });
    },
    [[store, dispatch, materialMaps]],
  );

  return {
    findSceneNodeRefBy: state.findSceneNodeRefBy,
    setCameraTarget: state.setCameraTarget,
    getSceneNodeByRef: (ref: string) => cloneDeep(state.getSceneNodeByRef(ref)),
    getSelectedSceneNodeRef: () => store.getState().selectedSceneNodeRef,
    setSelectedSceneNodeRef: state.setSelectedSceneNodeRef,
    highlights: highlights,
    clearHighlights: clearHighlights,
  };
}

export type SceneComposerApi = ReturnType<typeof useSceneComposerApi>;
