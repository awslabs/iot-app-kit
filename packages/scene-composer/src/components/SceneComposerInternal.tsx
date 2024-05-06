import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { ThemeProvider } from 'styled-components';
import { Mode } from '@cloudscape-design/global-styles';
import { cloneDeep } from 'lodash';
import { useViewport } from '@iot-app-kit/react-components';

import { SCENE_BODY_CLASS } from '../common/constants';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import LogProvider from '../logger/react-logger/log-provider';
import { GlobalStyles } from '../GlobalStyles';
import useAwsLightDarkModes from '../hooks/useAwsLightDarkModes';
import { KnownComponentType, StyleTarget } from '../interfaces';
import { materialReducer, initialMaterialMaps, addMaterial, removeMaterial, backUpOriginalMaterial } from '../reducers';
import { accessStore } from '../store';
import { IDataBoundSceneComponentInternal, ISceneComponentInternal } from '../store/internalInterfaces';
import { darkTheme, lightTheme } from '../theme';
import { containsMatchingEntityComponent } from '../utils/dataBindingUtils';
import { generateUUID } from '../utils/mathUtils';
import { createMaterialFromStyle } from '../utils/objectThreeStyleUtils';
import { SceneComposerInternalProps } from '../interfaces/sceneComposerInternal';

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
  const sceneComposerInternalRef = useRef<HTMLDivElement>(null);
  const currentSceneComposerId = useMemo(() => sceneComposerId ?? generateUUID(), [sceneComposerId]);
  const { viewport } = useViewport();

  const ErrorFallback = ErrorView || DefaultErrorFallback;

  // Assuming we only have dark or light...
  const theme = config.colorTheme ?? config.colorTheme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    // label body as being used by the scene. this allows other components to identify it vs. other page components
    document.body.classList.add(SCENE_BODY_CLASS);

    return () => {
      document.body.classList.remove(SCENE_BODY_CLASS);
    };
  }, []);

  useAwsLightDarkModes(sceneComposerInternalRef, config.colorTheme === 'light' ? Mode.Light : Mode.Dark);

  return (
    <div ref={sceneComposerInternalRef} style={{ minHeight: '100%', minWidth: '100%', height: '100%', width: '100%' }}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <LogProvider
          namespace='SceneComposerInternal'
          logger={config.logger}
          ErrorView={ErrorFallback}
          onError={onError}
        >
          <IntlProvider locale={config.locale}>
            <sceneComposerIdContext.Provider value={currentSceneComposerId}>
              <StateManager config={config} {...props} viewport={props.viewport || viewport} />
            </sceneComposerIdContext.Provider>
          </IntlProvider>
        </LogProvider>
      </ThemeProvider>
    </div>
  );
};

export function useSceneComposerApi(sceneComposerId: string) {
  const document = accessStore(sceneComposerId)((state) => state.document);
  const findSceneNodeRefBy = accessStore(sceneComposerId)((state) => state.findSceneNodeRefBy);
  const setCameraTarget = accessStore(sceneComposerId)((state) => state.setCameraTarget);
  const getSceneNodeByRef = accessStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const selectedSceneNodeRef = accessStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const setSelectedSceneNodeRef = accessStore(sceneComposerId)((state) => state.setSelectedSceneNodeRef);
  const getObject3DBySceneNodeRef = accessStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);
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
