import React, { useContext, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { DeleteSvg, RotateIconSvg, ScaleIconSvg, TranslateIconSvg } from '../../../../assets/svgs';
import { KnownComponentType, TransformControlMode } from '../../../../interfaces';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useEditorState, useSceneDocument, useStore } from '../../../../store';
import { ToolbarItem } from '../../common/ToolbarItem';
import { TOOLBAR_ITEM_CONTAINER_HEIGHT, ToolbarItemGroup } from '../../common/styledComponents';
import { ToolbarItemOptions, ToolbarOrientation } from '../../common/types';
import { findComponentByType } from '../../../../utils/nodeUtils';
import { FLOATING_TOOLBAR_VERTICAL_ORIENTATION_BUFFER } from '../FloatingToolbar';
import { isDynamicScene } from '../../../../utils/entityModelUtils/sceneUtils';

enum TransformTypes {
  Translate = 'transform-translate',
  Rotate = 'transform-rotate',
  Scale = 'transform-scale',
}

const labelStrings = defineMessages({
  [TransformTypes.Translate]: { defaultMessage: 'Translate', description: 'Menu label' },
  [TransformTypes.Rotate]: { defaultMessage: 'Rotate', description: 'Menu label' },
  [TransformTypes.Scale]: { defaultMessage: 'Scale', description: 'Menu label' },
});

const textStrings = defineMessages({
  [TransformTypes.Translate]: { defaultMessage: 'Translate object', description: 'Menu Item' },
  [TransformTypes.Rotate]: { defaultMessage: 'Rotate object', description: 'Menu Item' },
  [TransformTypes.Scale]: { defaultMessage: 'Scale object', description: 'Menu Item' },
});

interface ObjectItemGroupProps {
  canvasHeight: number | undefined;
  toolbarOrientation: ToolbarOrientation;
}

export function ObjectItemGroup({ toolbarOrientation, canvasHeight }: ObjectItemGroupProps) {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const { selectedSceneNodeRef, transformControlMode, setTransformControlMode } = useEditorState(sceneComposerId);
  const setDeleteConfirmationModalVisible = useStore(sceneComposerId)(
    (state) => state.setDeleteConfirmationModalVisible,
  );
  const { getSceneNodeByRef, removeSceneNode, document } = useSceneDocument(sceneComposerId);
  const { formatMessage } = useIntl();
  const selectedSceneNode = getSceneNodeByRef(selectedSceneNodeRef);

  const isTagComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.Tag);
  const isOverlayComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.DataOverlay);
  const isDynamic = isDynamicScene(document);

  const transformSelectorItems = [
    {
      icon: { scale: 1.06, svg: TranslateIconSvg },
      uuid: TransformTypes.Translate,
      mode: 'translate',
      isSelected: transformControlMode === 'translate',
    },
    {
      icon: { scale: 1.06, svg: RotateIconSvg },
      uuid: TransformTypes.Rotate,
      mode: 'rotate',
      isDisabled: isTagComponent || isOverlayComponent,
      isSelected: transformControlMode === 'rotate',
    },
    {
      icon: { scale: 1.06, svg: ScaleIconSvg },
      uuid: TransformTypes.Scale,
      mode: 'scale',
      isDisabled: isTagComponent || isOverlayComponent,
      isSelected: transformControlMode === 'scale',
    },
  ].map(
    (item) =>
      ({
        ...item,
        label: labelStrings[item.uuid] ? formatMessage(labelStrings[item.uuid]) : undefined, // If there's a label string, show label
        text: textStrings[item.uuid] ? formatMessage(textStrings[item.uuid]) : undefined, // if there's a text string, show text
      } as ToolbarItemOptions & { mode: TransformControlMode }),
  );

  const initialSelectedItem = useMemo(() => {
    return transformSelectorItems.find((item) => item.mode === transformControlMode) ?? transformSelectorItems[0];
  }, [transformSelectorItems, transformControlMode, isTagComponent, isOverlayComponent]);

  const isDeleteDisabled = selectedSceneNodeRef === undefined;

  const translatedItems = useMemo(() => {
    return transformSelectorItems;
  }, [intl, isTagComponent, isOverlayComponent, transformControlMode]);

  return (
    <ToolbarItemGroup isVertical={toolbarOrientation === ToolbarOrientation.Vertical}>
      <ToolbarItem
        items={[
          {
            label: intl.formatMessage({ defaultMessage: 'Delete', description: 'Toolbar label' }),
            icon: { svg: DeleteSvg },
            uuid: 'delete',
            isDisabled: isDeleteDisabled,
          },
        ]}
        type='button'
        onSelect={() => {
          if (selectedSceneNodeRef) {
            if (isDynamic) {
              setDeleteConfirmationModalVisible(true, { type: 'deleteNode', nodeRef: selectedSceneNodeRef });
            } else if (removeSceneNode) {
              removeSceneNode(selectedSceneNodeRef);
            }
          }
        }}
        isVertical={toolbarOrientation === ToolbarOrientation.Vertical}
      />
      <ToolbarItem
        items={translatedItems}
        type='mode-select'
        initialSelectedItem={initialSelectedItem}
        onSelect={(selectedItem) => setTransformControlMode(selectedItem.mode)}
        maxMenuContainerHeight={
          canvasHeight
            ? canvasHeight - FLOATING_TOOLBAR_VERTICAL_ORIENTATION_BUFFER - TOOLBAR_ITEM_CONTAINER_HEIGHT
            : undefined
        }
        isVertical={toolbarOrientation === ToolbarOrientation.Vertical}
        menuPosition={toolbarOrientation === ToolbarOrientation.Vertical ? 'right' : 'bottom-right'}
      />
    </ToolbarItemGroup>
  );
}
