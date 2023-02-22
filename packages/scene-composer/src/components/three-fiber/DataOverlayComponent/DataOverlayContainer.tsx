import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Button } from '@awsui/components-react';

import { IDataOverlayComponentInternal, ISceneNodeInternal } from '../../../store/internalInterfaces';
import { Component } from '../../../models/SceneModels';
import { useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import useCallbackWhenNotPanning from '../../../hooks/useCallbackWhenNotPanning';

import { DataOverlayRows } from './DataOverlayRows';
import './styles.scss';

export interface DataOverlayContainerProps {
  node: ISceneNodeInternal;
  component: IDataOverlayComponentInternal;
}

export const DataOverlayContainer = ({ component, node }: DataOverlayContainerProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const setSelectedSceneNodeRef = useStore(sceneComposerId)((state) => state.setSelectedSceneNodeRef);
  const [visible, setVisible] = useState(
    component.config?.isPinned || component.subType === Component.DataOverlaySubType.TextAnnotation,
  );

  // Toggle panel visibility
  useEffect(() => {
    if (selectedSceneNodeRef === node.ref) {
      setVisible(true);
    }
  }, [selectedSceneNodeRef, node.ref]);

  // Same behavior as other components to select node when clicked on the panel
  const [onPointerDown, onPointerUp] = useCallbackWhenNotPanning(
    (e) => {
      e.stopPropagation();
      if (selectedSceneNodeRef !== node.ref) {
        setSelectedSceneNodeRef(node.ref);
      }
    },
    [selectedSceneNodeRef, node.ref],
  );

  const onClickCloseButton = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  return visible ? (
    <div
      ref={containerRef}
      onPointerUp={onPointerUp}
      onPointerDown={onPointerDown}
      className={`container ${
        component.subType === Component.DataOverlaySubType.TextAnnotation ? 'annotation-container' : 'panel-container'
      }`}
    >
      {component.subType === Component.DataOverlaySubType.OverlayPanel && (
        <div className='close-button'>
          <Button iconName='close' variant='icon' iconAlign='right' onClick={onClickCloseButton} />
        </div>
      )}
      <DataOverlayRows component={component} />
    </div>
  ) : null;
};
