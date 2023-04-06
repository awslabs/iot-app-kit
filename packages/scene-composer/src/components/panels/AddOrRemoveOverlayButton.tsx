import * as THREE from 'three';
import React, { useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';
import { Box, Button } from '@awsui/components-react';

import { KnownComponentType } from '../../interfaces';
import { IDataOverlayComponentInternal, useStore } from '../../store';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { findComponentByType } from '../../utils/nodeUtils';
import { Component } from '../../models/SceneModels';

export const AddOrRemoveOverlayButton: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const addComponentInternal = useStore(sceneComposerId)((state) => state.addComponentInternal);
  const removeComponent = useStore(sceneComposerId)((state) => state.removeComponent);
  const selectedSceneNode = getSceneNodeByRef(selectedSceneNodeRef);
  const intl = useIntl();

  const isTagComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.Tag);
  const isOverlayComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.DataOverlay);

  const onClick = useCallback(() => {
    if (!selectedSceneNodeRef) return;

    if (isOverlayComponent) {
      removeComponent(
        selectedSceneNodeRef,
        findComponentByType(selectedSceneNode, KnownComponentType.DataOverlay)!.ref,
      );
      return;
    }

    const component: IDataOverlayComponentInternal = {
      ref: THREE.MathUtils.generateUUID(),
      type: KnownComponentType.DataOverlay,
      subType: Component.DataOverlaySubType.OverlayPanel,
      valueDataBindings: [],
      dataRows: [
        {
          rowType: Component.DataOverlayRowType.Markdown,
          content: '',
        },
      ],
    };

    addComponentInternal(selectedSceneNodeRef, component);
  }, [selectedSceneNodeRef, isOverlayComponent, selectedSceneNode]);

  return (
    (isTagComponent && (
      <div style={{ overflow: 'auto' }}>
        <Box margin={{ top: 'xs' }} float={isOverlayComponent ? 'right' : 'left'}>
          <Button onClick={onClick}>
            {isOverlayComponent
              ? intl.formatMessage({ defaultMessage: 'Remove overlay', description: 'button label' })
              : intl.formatMessage({ defaultMessage: 'Add overlay', description: 'button label' })}
          </Button>
        </Box>
      </div>
    )) || <></>
  );
};
