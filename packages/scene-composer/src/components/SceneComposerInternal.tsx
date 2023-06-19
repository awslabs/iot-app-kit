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
import { useStore } from '../store';
import { IDataBoundSceneComponentInternal, ISceneComponentInternal } from '../store/internalInterfaces';
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
  const document = useStore(sceneComposerId)((state) => state.document);
  const findSceneNodeRefBy = useStore(sceneComposerId)((state) => state.findSceneNodeRefBy);
  const setCameraTarget = useStore(sceneComposerId)((state) => state.setCameraTarget);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const setSelectedSceneNodeRef = useStore(sceneComposerId)((state) => state.setSelectedSceneNodeRef);
  const getObject3DBySceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);
  const [materialMaps, dispatch] = useReducer(materialReducer, initialMaterialMaps);

  const findBindingComponent = (components: ISceneComponentInternal[], dataBindingContext: unknown) => {
    const bindingComponentTypeFilter = [KnownComponentType.EntityBinding];
    return components.find((component) => {
      if (bindingComponentTypeFilter.includes(component.type as KnownComponentType)) {
        const dataBoundComponent = component as IDataBoundSceneComponentInternal;
        const boundContext = dataBoundComponent?.valueDataBinding?.dataBindingContext;
        return containsMatchingEntityComponent(dataBindingContext, boundContext);
      } else {
        return false;
      }
    });
  };
  const highlights = useCallback(
    (decorations: StyleTarget[]) => {
      const nodeList = Object.values(document.nodeMap);
      decorations.forEach((styleTarget) => {
        nodeList.forEach((node) => {
          const bindingComponent = findBindingComponent(node.components, styleTarget.dataBindingContext);
          if (bindingComponent) {
            const object3D = getObject3DBySceneNodeRef(node.ref);
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
    [document, getObject3DBySceneNodeRef, dispatch, materialMaps],
  );

  const clearHighlights = useCallback(
    (dataBindingContexts: unknown[]) => {
      const nodeList = Object.values(document.nodeMap);
      dataBindingContexts.forEach((dataBindingContext) => {
        nodeList.forEach((node) => {
          const bindingComponent = findBindingComponent(node.components, dataBindingContext);
          if (bindingComponent) {
            const object3D = getObject3DBySceneNodeRef(node.ref);
            if (object3D) {
              object3D?.traverse((o) => {
                removeMaterial(o, 'highlights', materialMaps, dispatch);
              });
            }
          }
        });
      });
    },
    [[document, getObject3DBySceneNodeRef, dispatch, materialMaps]],
  );

  return {
    findSceneNodeRefBy: findSceneNodeRefBy,
    setCameraTarget: setCameraTarget,
    getSceneNodeByRef: (ref: string) => cloneDeep(getSceneNodeByRef(ref)),
    getSelectedSceneNodeRef: () => selectedSceneNodeRef,
    setSelectedSceneNodeRef: setSelectedSceneNodeRef,
    highlights: highlights,
    clearHighlights: clearHighlights,
  };
}

export type SceneComposerApi = ReturnType<typeof useSceneComposerApi>;
