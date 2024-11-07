import { type ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { type IDataOverlayComponentInternal, type ISceneNodeInternal } from '../../../store/internalInterfaces';
import { Component } from '../../../models/SceneModels';
import { accessStore, useViewOptionState } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { applyDataBindingTemplate } from '../../../utils/dataBindingTemplateUtils';

import { DataOverlayRows } from './DataOverlayRows';
import {
  tmAnnotationContainer,
  tmArrow,
  tmArrowInner,
  tmArrowOuter,
  tmCloseButton,
  tmCloseButtonDiv,
  tmContainer,
  tmPanelContainer,
} from './styles';

export interface DataOverlayContainerProps {
  node: ISceneNodeInternal;
  component: IDataOverlayComponentInternal;
}

export const DataOverlayContainer = ({ component, node }: DataOverlayContainerProps): ReactElement | null => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedSceneNodeRef = accessStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const setSelectedSceneNodeRef = accessStore(sceneComposerId)((state) => state.setSelectedSceneNodeRef);
  const subType = component.subType;
  const isAnnotation = component.subType === Component.DataOverlaySubType.TextAnnotation;

  const componentVisible = useViewOptionState(sceneComposerId).componentVisibilities[subType];
  const initialVisibilitySkipped = useRef(false);

  const onWidgetClick = accessStore(sceneComposerId)((state) => state.getEditorConfig().onWidgetClick);
  const isViewing = accessStore(sceneComposerId)((state) => state.isViewing());
  const dataBindingTemplate = accessStore(sceneComposerId)((state) => state.dataBindingTemplate);

  // TODO: config.isPinned is not supported in milestone 1
  // const [visible, setVisible] = useState(component.config?.isPinned || componentVisible);
  const [visible, setVisible] = useState(componentVisible);

  // Toggle panel visibility on selection change
  useEffect(() => {
    if (selectedSceneNodeRef === node.ref) {
      setVisible(true);
    } else if (!isAnnotation && !componentVisible) {
      setVisible(false);
    }
  }, [selectedSceneNodeRef, node.ref]);

  // Toggle visibility on view option change. Skip the first call to make sure the
  // isPinned config can keep panel open initially.
  useEffect(() => {
    if (initialVisibilitySkipped.current) {
      if (!isAnnotation && selectedSceneNodeRef === node.ref) {
        setVisible(true);
      } else {
        setVisible(componentVisible);
      }
    }
    initialVisibilitySkipped.current = true;
  }, [componentVisible]);

  // Same behavior as other components to select node when clicked on the panel
  const onClickContainer = useCallback(
    (e) => {
      // Anchor only has special onClick handling in viewing mode
      if (isViewing) {
        if (onWidgetClick) {
          const dataBindingContexts: unknown[] = [];
          component.valueDataBindings.forEach((item) => {
            if (item.valueDataBinding) {
              dataBindingContexts.push(applyDataBindingTemplate(item.valueDataBinding, dataBindingTemplate));
            }
          });
          const componentTypes = node.components.map((component) => component.type) ?? [];
          onWidgetClick({
            componentTypes,
            nodeRef: node.ref,
            additionalComponentData: [
              {
                dataBindingContexts,
              },
            ],
          });
        }
      }

      e.stopPropagation();
      if (selectedSceneNodeRef !== node.ref) {
        setSelectedSceneNodeRef(node.ref);
      }
    },
    [selectedSceneNodeRef, node.ref, onWidgetClick],
  );

  const onClickCloseButton = useCallback(
    (e) => {
      setVisible(false);
      e.stopPropagation();
    },
    [setVisible],
  );

  return visible ? (
    <>
      <div
        ref={containerRef}
        onClick={onClickContainer}
        style={{ ...tmContainer, ...(isAnnotation ? tmAnnotationContainer : tmPanelContainer) }}
      >
        {!isAnnotation && !componentVisible && (
          <div style={tmCloseButtonDiv}>
            <button style={tmCloseButton} onClick={onClickCloseButton}>
              X
            </button>
          </div>
        )}
        <DataOverlayRows component={component} />
        {subType == Component.DataOverlaySubType.OverlayPanel && (
          <div style={tmArrow}>
            <div style={{ ...tmContainer, ...tmArrowOuter }} />
            <div style={{ ...tmContainer, ...tmArrowOuter, ...tmArrowInner }} />
          </div>
        )}
      </div>
    </>
  ) : null;
};
