import React, { useContext, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { DeleteSvg, RotateIconSvg, ScaleIconSvg, TranslateIconSvg } from '../../../../assets/svgs';
import { KnownComponentType, TransformControlMode } from '../../../../interfaces';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useEditorState, useSceneDocument } from '../../../../store';
import { ToolbarItem } from '../../common/ToolbarItem';
import { ToolbarItemGroup } from '../../common/styledComponents';
import { ToolbarItemOptions } from '../../common/types';
import { findComponentByType } from '../../../../utils/nodeUtils';

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

export function ObjectItemGroup() {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const { selectedSceneNodeRef, transformControlMode, setTransformControlMode } = useEditorState(sceneComposerId);
  const { getSceneNodeByRef, removeSceneNode } = useSceneDocument(sceneComposerId);
  const { formatMessage } = useIntl();
  const selectedSceneNode = getSceneNodeByRef(selectedSceneNodeRef);

  const isTagComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.Tag);
  const isOverlayComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.DataOverlay);

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
    <ToolbarItemGroup>
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
        onClick={() => {
          if (removeSceneNode && selectedSceneNodeRef) {
            removeSceneNode(selectedSceneNodeRef);
          }
        }}
      />
      <ToolbarItem
        items={translatedItems}
        type='mode-select'
        initialSelectedItem={initialSelectedItem}
        onClick={(selectedItem) => setTransformControlMode(selectedItem.mode)}
      />
    </ToolbarItemGroup>
  );
}
